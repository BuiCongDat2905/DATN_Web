package com.datn.sellWatches.Service;
import java.text.ParseException;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

import com.datn.sellWatches.DTO.Request.Authentication.*;
import com.datn.sellWatches.DTO.Request.Customer.SaveCustomerRequest;
import com.datn.sellWatches.DTO.Request.StringRequest;
import com.datn.sellWatches.DTO.Response.CustomerResponse.SaveCustomerResponse;
import com.datn.sellWatches.Entity.Role;
import com.datn.sellWatches.Repository.CustomerRepository;
import com.datn.sellWatches.Repository.RoleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.datn.sellWatches.DTO.Response.AuthenticationResponse.AuthenticationResponse;
import com.datn.sellWatches.DTO.Response.AuthenticationResponse.IntrospectResponse;
import com.datn.sellWatches.Entity.Account;
import com.datn.sellWatches.Entity.InvalidatedToken;
import com.datn.sellWatches.Exception.AppException;
import com.datn.sellWatches.Exception.ErrorCode;
import com.datn.sellWatches.Repository.AccountRepository;
import com.datn.sellWatches.Repository.InvalidatedTokenRepository;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    AccountRepository accountRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    CustomerService customerService;
    RoleRepository roleRepository;
    CustomerRepository customerRepository;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;
    
    public IntrospectResponse introspect(IntrospectRequest request)
            throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;
        String role = null;
        try {
            SignedJWT jwt = verifyToken(token);
            role = jwt.getJWTClaimsSet().getStringClaim("scope");
        } catch (AppException e) {
            isValid = false;
        }
        return IntrospectResponse.builder()
                .valid(isValid)
                .role(role)
                .build();
    }

    public AuthenticationResponse authenticate(LoginRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        log.info((request.toString()));
        var user = accountRepository.findByTenTaiKhoan(request.getTenTaiKhoan())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXISTED));
        boolean authenticated = passwordEncoder.matches(request.getMatKhau(),
                user.getMatKhau());
        if (!authenticated)
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        var token = generateToken(user);
        String location = "";

        if(user.getQuyen().getTenQuyen().equals("ADMIN")) {
            log.info(user.getQuyen().getTenQuyen());
            location = "/admin/thong-ke";
        }else{
            location = "/";
        }
        return  AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .localtion(location)
                .build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        var signToken = verifyToken(request.getToken());

        String jit = signToken.getJWTClaimsSet().getJWTID();
        Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();
        if (invalidatedTokenRepository.existsById(jit)) {
            return;
        }
        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jit)
                .het_han(expiryTime)
                .build();
        invalidatedTokenRepository.save(invalidatedToken);
    }

    public AuthenticationResponse refreshToken(RefreshRequest request)
            throws ParseException, JOSEException {
        var signedJWT = verifyToken(request.getToken());
        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jit)
                .het_han(expiryTime)
                .build();
        invalidatedTokenRepository.save(invalidatedToken);
        var username = signedJWT.getJWTClaimsSet().getSubject();
        var account = accountRepository.findByTenTaiKhoan(username)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        var token = generateToken(account);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    private String generateToken(Account account) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(account.getTenTaiKhoan())
                .issuer("devteria.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(account))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    private SignedJWT verifyToken(String token) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(verifier);
        if (!(verified && expiryTime.after(new Date())))
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        return signedJWT;
    }

    private String buildScope(Account acount) {
        return acount.getQuyen().getTenQuyen();
    }
    public String extractSubject(String token) throws ParseException, JOSEException {
        return verifyToken(token).getJWTClaimsSet().getSubject();
    }
    @Transactional
    public Boolean register(RegisterRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if(!customerRepository.existsById(request.getSoDienThoai())){
            SaveCustomerRequest saveCustomerRequest = SaveCustomerRequest.builder()
                    .so_dien_thoai(request.getSoDienThoai())
                    .ten_khach_hang(request.getTenNguoiDung())
                    .email(request.getEmail())
                    .dia_chi("")
                    .ngay_sinh(request.getNgaySinh())
                    .gioi_tinh(request.getGioiTinh())
                    .build();
            SaveCustomerResponse saveCustomerResponse = customerService.saveCustomerByOrder(saveCustomerRequest);
            boolean isCustomer = saveCustomerResponse.isCustomer();
            if(!isCustomer) {
                return false;
            }
        }
       try{
           if(accountRepository.existsByTenTaiKhoan(request.getSoDienThoai())){
               return false;
           }
           Role role = roleRepository.findByTenQuyen("CUSTOMER")
                   .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXIT));
           Account account = Account.builder()
                   .tenTaiKhoan(request.getSoDienThoai())
                   .matKhau(passwordEncoder.encode(request.getMatKhau()))
                   .quyen(role)
                   .build();
           accountRepository.save(account);
       }catch(Exception err) {
           log.info(err.toString());
           return false;
       }
        return true;
    }

}
