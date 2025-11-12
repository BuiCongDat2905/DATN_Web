package com.datn.sellWatches.Controller;

import com.datn.sellWatches.DTO.Request.StringRequest;
import com.datn.sellWatches.DTO.Response.ApiResponse;
import com.datn.sellWatches.DTO.Response.CustomerResponse.GetInfoCustomerResponse;
import com.datn.sellWatches.Exception.AppException;
import com.datn.sellWatches.Service.AuthenticationService;
import com.datn.sellWatches.Service.CustomerService;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CustomerController {
    private CustomerService customerService;
    private AuthenticationService  authenticationService;
    @PostMapping("/getInfo")
    public ApiResponse<GetInfoCustomerResponse> getInforCustomer(@RequestBody StringRequest request) throws ParseException, JOSEException {
        GetInfoCustomerResponse result = null;
        if(request.getName() != null) {
            String  id =  authenticationService.extractSubject(request.getName());
            result = customerService.getInfoCustomer(id);
        }

        if(result == null){
            return ApiResponse.<GetInfoCustomerResponse>builder()
                    .message("CUSTOMER_NOT_EXIT")
                    .result(null)
                    .build();
        }
        return ApiResponse.<GetInfoCustomerResponse>builder()
                .result(result)
                .build();
    }
}
