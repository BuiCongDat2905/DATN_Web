package com.datn.sellWatches.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.*;

import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.MultiMatchQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType;
import com.datn.sellWatches.DTO.Request.Elasticsearch.SearchProductRequest;
import com.datn.sellWatches.DTO.Request.Product.*;
import com.datn.sellWatches.DTO.Request.StringRequest;
import com.datn.sellWatches.DTO.Response.Elasticsearch.PageResponse;
import com.datn.sellWatches.DTO.Response.ProductResponse.*;
import com.datn.sellWatches.Document.ProductDocument;
import com.datn.sellWatches.Repository.ProductDocumentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.IndexOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.HighlightQuery;
import org.springframework.data.elasticsearch.core.query.highlight.Highlight;
import org.springframework.data.elasticsearch.core.query.highlight.HighlightField;
import org.springframework.data.elasticsearch.core.query.highlight.HighlightFieldParameters;
import org.springframework.data.elasticsearch.core.query.highlight.HighlightParameters;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.datn.sellWatches.Entity.Products;
import com.datn.sellWatches.Entity.Types;
import com.datn.sellWatches.Entity.Warehouse;
import com.datn.sellWatches.Exception.AppException;
import com.datn.sellWatches.Exception.ErrorCode;
import com.datn.sellWatches.Repository.ProductRepository;
import com.datn.sellWatches.Repository.TypeRepository;
import com.datn.sellWatches.Repository.WarehouseRepository;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductService {

	final ProductRepository productRepository;
	final TypeRepository typeRepository;
	final WarehouseRepository warehouseRepository;
	final ProductDocumentRepository	productDocumentRepository;
	final ElasticsearchTemplate  elasticsearchTemplate;

	private static final int DEFAULT_PAGE = 0;
	private static final int DEFAULT_SIZE = 10;
	private static final int MAX_SIZE = 100;
	private static final int DEFAULT_MIN_AGE = 0;
	private static final int DEFAULT_MAX_AGE = 200;

	private static final List<String> SEARCH_FIELDS = List.of(
			"ten_san_pham^2.0"
//			"ma_san_pham^2.0",
//			"loai^1.5",
//			"mo_ta^1.5"
	);
	private static final List<String> HIGHLIGHT_FIELDS = List.of(
			"ten_san_pham"
//			"ma_san_pham",
//			"loai",
//			"mo_ta"
	);
	private static final Map<String, String> SORT_FIELDS = Map.of(
//			"ngay_tao", "ngay_tao",
//			"gia", "gia",
			"ten_san_pham", "ten_san_pham.keyword"
//			"loai", "loai.keyword",
//			"ton_kho", "ton_kho",
//			"duong_kinh", "duong_kinh"
	);
	public Map<String, List<GetListProductsHomeResponse>> getListProductHome() {
	    Pageable pageable = PageRequest.of(0, 10);
	    Map<String, List<GetListProductsHomeResponse>> result = new HashMap<>();
	    
	    List<String> listLoai = Arrays.asList("newNam", "newNu", "newDoi", "quaNam", "quaNu", "quaDoi");
	    
	    try {
	        for (String tenLoai : listLoai) {
	            List<GetListProductsHomeResponse> listResponse = new ArrayList<>();
	            if (tenLoai.startsWith("new")) {
	                Page<Object[]> page = productRepository.getProductsInTypeWhereNew(validListType(tenLoai), pageable);
	                
	                for (Object[] row : page.getContent()) {
	                    listResponse.add(
	                    		GetListProductsHomeResponse.builder()
	                    		.id((String) row[0])
	                            .hinh_anh((String) row[1])
	                            .ten_san_pham((String) row[2])
	                            .ma_san_pham((String) row[3])
	                            .loai_may((String) row[4])                           
	                            .duong_kinh((float) row[5])
	                            .gia((int) row[6])
	                            .build()
	                    );
	                }
	            } 
	            else if (tenLoai.startsWith("qua")) {
	            	 Page<Object[]> page = productRepository.getProductsInTypeWhereQuantity(validListType(tenLoai), pageable);
		                
		                for (Object[] row : page.getContent()) {
		                    listResponse.add(
		                    		GetListProductsHomeResponse.builder()
		                    		.id((String) row[0])
		                            .hinh_anh((String) row[1])
		                            .ten_san_pham((String) row[2])
		                            .ma_san_pham((String) row[3])
		                            .loai_may((String) row[4])                           
		                            .duong_kinh((float) row[5])
		                            .gia((int) row[6])
		                            .build()
		                    );
		                }
	            }
	            
	            result.put(tenLoai, listResponse);
	        }
	    } catch(Exception e) {
	        log.info(e.toString());
	    }
		return result;
	}
	public GetProductByIdResponse getProduct(String productId) {
		Products products = productRepository.findById(productId)
				.orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXIT));
		
		return GetProductByIdResponse.builder()
				.id(products.getId())
				.ten_san_pham(products.getTen_san_pham())
				.ma_san_pham(products.getMa_san_pham())
				.gia(products.getGia())
				.mo_ta(products.getMo_ta())
				.loai_may(products.getLoai_may())
				.mat_kinh(products.getMat_kinh())
				.chat_lieu_vo(products.getChat_lieu_vo())
				.chat_lieu_day(products.getChat_lieu_day())
				.mau_mat(products.getMau_mat())
				.xuat_xu(products.getXuat_xu())
				.kieu_dang(products.getKieu_dang())
				.phong_cach(products.getPhong_cach())
				.duong_kinh(products.getDuong_kinh())
				.do_day(products.getDo_day())
				.khang_nuoc(products.getKhang_nuoc())
				.bao_hanh_hang(products.getBao_hanh_hang())
				.bao_hanh_shop(products.getBao_hanh_shop())
				.hinh_anh(products.getHinh_anh())
				.ngay_tao(products.getNgay_tao())
				.khac(products.getKhac())
				.thuong_hieu(products.getThuong_hieu())
				.gioi_tinh(products.getGioi_tinh())
				.loai(products.getLoai())
				.build();
	}
	
	public String validListType(String typeCode) {
		if (typeCode == null || typeCode.length() < 3) {
			return null;
		}
		String type = typeCode.substring(3);
		 if("Nam".equals(type)) {
		        return "Đồng hồ Nam";
		    }
		    if("Nu".equals(type)) {
		        return "Đồng hồ Nữ";
		    }
		    if("Doi".equals(type)) {
		        return "Đồng hồ Đôi";
		    }
		    return null;
	}
	public PageAndSearchProductResponse searchProductResponse(String tenSanPham, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		tenSanPham = tenSanPham.replace('d', 'đ').replace('D', 'Đ');
		Page<Object[]> productsPage = productRepository.findTenSanPham(tenSanPham, pageable);
		int totalPages = productsPage.getTotalPages() - 1;
		List<SearchProductResponse> listResponses = new ArrayList<>();
        for (Object[] row : productsPage.getContent()) {
        	listResponses.add(
            		SearchProductResponse.builder()
            		.id((String) row[0])
                    .ma_san_pham((String) row[1])
                    .ten_san_pham((String) row[2])
                    .loai_may((String) row[3])
                    .duong_kinh((float) row[4])
                    .gia((int) row[5])
                    .ton_kho((int) row[6])
                    .hinh_anh((String) row[7])
                    .loai((String) row[8])
                    .build()
            );
        }
		return PageAndSearchProductResponse.builder()
				.totalPages(totalPages)
				.searchProductResponse(listResponses)
				.build();
	}	
	public FilterPageResponse filterProduct(FilterProductsRequest request){
		Pageable pageable = PageRequest.of(request.getPage(), 20);
		String tenSanPham = null;
		if(request.getTenSanPham() != null) {
			tenSanPham = request.getTenSanPham().replace('d', 'đ').replace('D', 'Đ');
		}
		Page<Object[]> productsPage = productRepository.filterProducts(
				tenSanPham, 
				request.getGioiTinh(),
				request.getThuongHieu(),
				request.getMinGia(),
				request.getMaxGia(),
				request.getLoaiMay(),
				request.getMinDuongKinh(),
				request.getMaxDuongKinh(),
				request.getChatLieuDay(),
				request.getChatLieuVo(),
				request.getMatKinh(),
				request.getMauMat(),
				request.getPhongCach(),
				request.getKieuDang(),
				request.getXuatXu(),
				pageable);
		int totalPages = productsPage.getTotalPages() - 1;
		List<FilterProductsResponse> listResponses = new ArrayList<>();
		for (Object[] row : productsPage.getContent()) {
        	listResponses.add(
        			FilterProductsResponse.builder()
        			.id((String) row[0])
        			.ma_san_pham((String) row[1])
        			.ten_san_pham((String) row[2])
        			.loai_may((String) row[3])	
        			.duong_kinh((Float) row[4])
        			.gia((Integer) row[5])
        			.hinh_anh((String) row[6])
        			.loai((String) row[7])
                    .build()
            );
        }
		return FilterPageResponse.builder()
				.totalPage(totalPages)
				.filterProductsResponse(listResponses)
				.build();
	}
	
	public ListFilterProductAdminResponse filterProductAdmin(FilterProductAdminRequest request) {
		Pageable pageable = PageRequest.of(request.getPage(), 10);
		String tenSanPham = null;
		if(request.getTenSanPham() != null) {
			tenSanPham = request.getTenSanPham().replace('d', 'đ').replace('D', 'Đ');
		}
		Page<Object[]> productsPage = productRepository.filterProductAdmin(
				tenSanPham, 
				request.getLoai(),
				request.getMinGia(),
				request.getMaxGia(),
				request.getLoai(),
				request.getTonKho(),
				request.getNgayBatDau(),
				request.getNgayKetThuc(),
				pageable);
		int totalPages = productsPage.getTotalPages() - 1;
		List<FilterProductAdminResponse> listResponses = new ArrayList<>();
		for (Object[] row : productsPage.getContent()) {
        	listResponses.add(
        			FilterProductAdminResponse.builder()
        			.id((String) row[0])
        			.maSanPham((String) row[1])
        			.tenSanPham((String) row[2])
        			.gia((Integer) row[3])
        			.loai((String) row[4])
        			.tonKho((Integer) row[5])
        			.daBan((Integer) row[6])
        			.ngayTao((Date) row[7])
                    .build()
            );
        }
		return ListFilterProductAdminResponse.builder()
				.totalPage(totalPages)
				.filterProductAdminResponses(listResponses)
				.build();
	}
	@Transactional
	public boolean addProduct(AddProductRequest request) {
		try {
			LocalDate dateNow = LocalDate.now();
			Types loai = typeRepository.findByTenLoai(request.getLoaiSanPham())
					.orElseThrow(() -> new AppException(ErrorCode.TYPE_NOT_EXIT));
			Products product = Products.builder()
					.ma_san_pham(request.getMaSanPham())
					.ten_san_pham(request.getTenSanPham())
					.mo_ta(request.getMoTa())
					.loai_may(request.getLoaiMay())
					.mat_kinh(request.getMatKinh())
					.chat_lieu_vo(request.getChatLieuVo())
					.chat_lieu_day(request.getChatLieuDay())
					.mau_mat(request.getMauMat())
					.xuat_xu(request.getXuatXu())
					.kieu_dang(request.getKieuDang())
					.phong_cach(request.getPhongCach())
					.duong_kinh(request.getDuongKinh())
					.do_day(request.getDoDay())
					.khang_nuoc(request.getKhangNuoc())
					.bao_hanh_hang(request.getBaoHanhHang())
					.bao_hanh_shop(request.getBaoHanhShop())
					.hinh_anh(request.getHinhAnh())
					.khac(request.getKhac())
					.thuong_hieu(request.getThuongHieu())
					.gioi_tinh(request.getGioiTinh())
					.ngay_tao(dateNow)
					.loai(loai)
					.build();
			productRepository.save(product);
			Warehouse warehouse = Warehouse.builder()
					.da_ban(0)
					.gia_nhap(request.getGiaNhap())
					.ton_kho(request.getSoLuong())
					.products(product)
					.ngay_nhap(dateNow)
					.build();
			warehouseRepository.save(warehouse);
//			productDocumentRepository.save(product)
			return true;
		}catch(Exception e) {
			log.info(e.toString());
			return false;
		}
		
	}
	public List<GetProductForCart> getProductForCart(List<String> request){
		List<GetProductForCart> result = new ArrayList<>();
		for (String id : request) {
			 List<Object[]> rows = productRepository.getProductForCart(id);
		        for (Object[] row : rows) {
		            GetProductForCart item = GetProductForCart.builder()
		                .id((String) row[0])
		                .ma_san_pham((String) row[1])
		                .ten_san_pham((String) row[2])
		                .gia((int) row[3]) 
		                .hinh_anh((String) row[4])
		                .build();
		            result.add(item);
		        }
		}
		return result;
	}
	
	public Boolean removeProductId(List<String> request) {
		try {
			for(String id : request) {
				productRepository.deleteById(id);
			}
			return true;	
		}catch(Exception e) {
			log.info(e.toString());
			return false;
		}
		
	}
	public Boolean getProductUpdate(UpdateProductRequest request)  {
		try {
			Types type = typeRepository.findByTenLoai(request.getLoaiSanPham())
					.orElseThrow(() -> new AppException(ErrorCode.TYPE_NOT_EXIT));
			Products product = productRepository.findById(request.getId())
		            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXIT)); 
			LocalDate date = LocalDate.now();
		    Products updatedProduct = Products.builder()
		            .id(product.getId())  
		            .ma_san_pham(request.getMaSanPham())
		            .ten_san_pham(request.getTenSanPham())
		            .gia(request.getGiaBan())
		            .mo_ta(request.getMoTa())
		            .loai_may(request.getLoaiMay())
		            .mat_kinh(request.getMatKinh())
		            .chat_lieu_vo(request.getChatLieuVo())
		            .chat_lieu_day(request.getChatLieuDay())
		            .mau_mat(request.getMauMat())
		            .xuat_xu(request.getXuatXu())
		            .kieu_dang(request.getKieuDang())
		            .phong_cach(request.getPhongCach())
		            .duong_kinh(request.getDuongKinh())
		            .do_day(request.getDoDay())
		            .khang_nuoc(request.getKhangNuoc())
		            .bao_hanh_hang(request.getBaoHanhHang())
		            .bao_hanh_shop(request.getBaoHanhShop())
		            .hinh_anh(request.getHinhAnh())
		            .ngay_tao(date)
		            .khac(request.getKhac())
		            .loai(type)
					.gioi_tinh(request.getGioiTinh())
					.thuong_hieu(request.getThuongHieu())
		            .build();

		    productRepository.save(updatedProduct);

		    return true; 	
		    }catch(Exception e) {
		    	log.info(e.toString());
			return false;
		}
	}
	
	public GetProductTableAdminResponse getProductIdAdmin(IdProductRequest request) {
	    Object[] product = (Object[])productRepository.getProductTableAdmin(request.getId());

	    GetProductTableAdminResponse dto = GetProductTableAdminResponse.builder()
	        .id((String) product[0])
	        .maSanPham((String) product[1])
	        .tenSanPham((String) product[2])
	        .gia((int) product[3])
	        .moTa((String) product[4])
	        .loaiMay((String) product[5])
	        .matKinh((String) product[6])
	        .chatLieuVo((String) product[7])
	        .chatLieuDay((String) product[8])
	        .mauMat((String) product[9])
	        .xuatXu((String) product[10])
	        .kieuDang((String) product[11])
	        .phongCach((String) product[12])
	        .duongKinh(((Number) product[13]).floatValue())
	        .doDay(((Number) product[14]).floatValue())
	        .khangNuoc((String) product[15])
	        .baoHanhHang((String) product[16])
	        .baoHanhShop((String) product[17])
	        .hinhAnh((String) product[18])
	        .khac((String) product[19])
	        .thuongHieu((String) product[20])
	        .gioiTinh((String) product[21])
	        .soLuong((int) product[22])
	        .loaiSanPham((String) product[23])
	        .build();
	    return dto;
	}
	@PreAuthorize("hasRole('ADMIN')")
	public GetProductCodeResponse getProductCode(StringRequest request){
		Products product = productRepository.getProductCode(request.getName())
				.orElseThrow(()-> new AppException(ErrorCode.PRODUCT_NOT_EXIT));
		return GetProductCodeResponse.builder()
				.id(product.getId())
				.maSanPham(product.getMa_san_pham())
				.gia(product.getGia())
				.build();
	}

//	Elasticsearch
	public PageResponse<SearchProductResponse> search(SearchProductRequest request){
		NativeQuery query = buildSearchQuery(request);

		SearchHits<ProductDocument> searchHits = elasticsearchTemplate.search(query, ProductDocument.class);

		List<SearchProductResponse> rl = searchHits.getSearchHits()
				.stream()
				.map(this::mapSearchHit)
				.toList();

		long totalHits = searchHits.getTotalHits();
		int totalPages = (int)Math.ceil((double) totalHits/request.getSize());

		return PageResponse.<SearchProductResponse>builder()
				.content(rl)
				.page(request.getPage())
				.size(request.getSize())
				.totalElements(totalHits)
				.totalPages(totalPages)
				.last(request.getPage() >= totalPages -1)
				.first(request.getPage() == 0)
				.build();
	}

	private NativeQuery buildSearchQuery(SearchProductRequest request){
		int page = request.getPage() >= 0
				? request.getPage()
				: DEFAULT_PAGE;
		int size = request.getSize() > 0
				? Math.min(request.getSize(), MAX_SIZE)
				: DEFAULT_SIZE;
		List<Query> mustQuery = new ArrayList<>();
		String keyword = request.getKeyword();


		if (keyword != null && !keyword.isBlank()) {

			mustQuery.add(
					Query.of(q -> q.matchPhrasePrefix(m -> m
							.field("ten_san_pham")
							.query(keyword)
					))
			);

		} else {

			mustQuery.add(
					Query.of(q -> q.matchAll(ma -> ma))
			);
		}

		List<Query> filterQuery = new ArrayList<>();

		// Filter: Loai
//		if(request.getLoai() != null && !request.getLoai().isBlank()){
//			filterQuery.add(
//					Query.of(q -> q.term(t -> t
//							.field("loai.keyword")
//							.value(request.getLoai())
//					))
//			);
//		}
//
//		// Filter: Gioi tinh
		if (request.getGioiTinh() != null && !request.getGioiTinh().isBlank()) {
			String loai = request.getGioiTinh().trim();

			filterQuery.add(
					Query.of(q -> q.term(t -> t
							.field("loai")
							.value(loai)
							.caseInsensitive(true)
					))
			);
		}
//
//		// Filter: Thuong hieu
//		if(request.getThuong_hieu() != null && !request.getThuong_hieu().isBlank()){
//			filterQuery.add(
//					Query.of(q -> q.term(t -> t
//							.field("thuong_hieu.keyword")
//							.value(request.getThuong_hieu())
//					))
//			);
//		}
//
//		// Filter: Loai may
//		if(request.getLoai_may() != null && !request.getLoai_may().isBlank()){
//			filterQuery.add(
//					Query.of(q -> q.term(t -> t
//							.field("loai_may.keyword")
//							.value(request.getLoai_may())
//					))
//			);
//		}
//
//		// Filter: Chat lieu vo
//		if(request.getChat_lieu_vo() != null && !request.getChat_lieu_vo().isBlank()){
//			filterQuery.add(
//					Query.of(q -> q.term(t -> t
//							.field("chat_lieu_vo.keyword")
//							.value(request.getChat_lieu_vo())
//					))
//			);
//		}
//
//		// Filter: Chat lieu day
//		if(request.getChat_lieu_day() != null && !request.getChat_lieu_day().isBlank()){
//			filterQuery.add(
//					Query.of(q -> q.term(t -> t
//							.field("chat_lieu_day.keyword")
//							.value(request.getChat_lieu_day())
//					))
//			);
//		}
//
//		// Filter: Xuat xu
//		if(request.getXuat_xu() != null && !request.getXuat_xu().isBlank()){
//			filterQuery.add(
//					Query.of(q -> q.term(t -> t
//							.field("xuat_xu.keyword")
//							.value(request.getXuat_xu())
//					))
//			);
//		}
//
//		// Filter: Kieu dang
//		if(request.getKieu_dang() != null && !request.getKieu_dang().isBlank()){
//			filterQuery.add(
//					Query.of(q -> q.term(t -> t
//							.field("kieu_dang.keyword")
//							.value(request.getKieu_dang())
//					))
//			);
//		}
//
		BoolQuery boolQuery = BoolQuery.of(b -> b
				.must(mustQuery)
				.filter(filterQuery));
		String requestSortField = request.getSortBy();
		String sortField = (requestSortField != null)
				? SORT_FIELDS.getOrDefault(requestSortField, "ngay_tao")
				: "ngay_tao";
		String sortDiretion = request.getSortDirection();
		Sort.Direction direction =
				"ASC".equalsIgnoreCase(sortDiretion)
						? Sort.Direction.ASC
						: Sort.Direction.DESC;
		Pageable pageable = PageRequest.of(
				page,
				size,
				Sort.by(direction, sortField)
			);

		// ⭐ Highlight Configuration
		HighlightFieldParameters highlightParams = HighlightFieldParameters.builder()
				.withFragmentSize(150)
				.withNumberOfFragments(1)
				.build();
		List<HighlightField> highlightFields = HIGHLIGHT_FIELDS.stream()
				.map(f -> new HighlightField(f, highlightParams))
				.toList();
		HighlightParameters highlightParameters = HighlightParameters.builder()
				.withPreTags("<em>")
				.withPostTags("</em>")
				.build();
		Highlight highlight = new Highlight(highlightParameters, highlightFields);
		HighlightQuery highlightQuery = new HighlightQuery(highlight, ProductDocument.class);

		NativeQuery query = new NativeQueryBuilder()
				.withQuery(Query.of(q -> q.bool(boolQuery)))
				.withPageable(pageable)
				.withHighlightQuery(highlightQuery)
				.build();
		log.debug("ES query built: keyword='{}', fuzzy={}, page={}/{}",
				request.getKeyword(), request.getFuzzy(),
				request.getPage(), request.getSize());

		return query;
	}
	private  SearchProductResponse mapSearchHit(SearchHit<ProductDocument> hit){
		ProductDocument doc = hit.getContent();

		return SearchProductResponse.builder()
				.id(doc.getId())
				.ma_san_pham(doc.getMa_san_pham())
				.ten_san_pham(doc.getTen_san_pham())
				.loai(doc.getLoai())
				.gia(doc.getGia())
				.loai_may(doc.getLoai_may())
				.ton_kho(doc.getTon_kho())
				.hinh_anh(doc.getHinh_anh())
				.duong_kinh(doc.getDuong_kinh())
				.build();
	}
	public void reindexAll() {
		IndexOperations	 indexOps = elasticsearchTemplate.indexOps(ProductDocument.class);

		if (indexOps.exists()) {
			indexOps.delete();
		}

		indexOps.create();
		indexOps.putMapping(indexOps.createMapping());

	}
	public void syncDataDoc() {
		productDocumentRepository.deleteAll();

		// Đọc dữ liệu từ MySQL
				List<Products> products = productRepository.findAll();

		// Map sang ProductDocument
				List<ProductDocument> docs = products.stream()
						.map(this::toDocument)
						.toList();

		// Lưu vào Elasticsearch
				productDocumentRepository.saveAll(docs);
	}
	private ProductDocument toDocument(Products product) {
		return ProductDocument.builder()
				.id(product.getId())
				.ma_san_pham(product.getMa_san_pham())
				.ten_san_pham(product.getTen_san_pham())
				.loai(product.getLoai().getTenLoai())
				.gia(product.getGia())
				// map các field còn lại
				.build();
	}

}
