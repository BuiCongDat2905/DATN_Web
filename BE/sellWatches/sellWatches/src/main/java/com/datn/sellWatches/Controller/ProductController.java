package com.datn.sellWatches.Controller;

import java.util.List;
import java.util.Map;

import com.datn.sellWatches.DTO.Request.Elasticsearch.SearchProductRequest;
import com.datn.sellWatches.DTO.Request.Product.*;
import com.datn.sellWatches.DTO.Request.StringRequest;
import com.datn.sellWatches.DTO.Response.Elasticsearch.PageResponse;
import com.datn.sellWatches.DTO.Response.ProductResponse.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.HandlerMapping;

import com.datn.sellWatches.DTO.Response.ApiResponse;
import com.datn.sellWatches.Service.ProductService;
import com.datn.sellWatches.Service.TypeService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;



@RestController
@RequestMapping("/products")
@Slf4j
public class ProductController {
	@Autowired
	ProductService productService;
	@Autowired
	TypeService typeService;
	@GetMapping
	public ApiResponse<Map<String, List<GetListProductsHomeResponse>>> getProductHome() {
		Map<String, List<GetListProductsHomeResponse>> result = productService.getListProductHome();
		return ApiResponse.<Map<String,List<GetListProductsHomeResponse>>>builder()
				.result(result)
				.build();
	}
	
	@GetMapping("/**")
	public ApiResponse<GetProductByIdResponse> getProductById(HttpServletRequest request) {
	    String bestMatchingPattern = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
	    String path = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
	    
	    AntPathMatcher apm = new AntPathMatcher();
	    String wildcardPart = apm.extractPathWithinPattern(bestMatchingPattern, path);
	    
	    return ApiResponse.<GetProductByIdResponse>builder()
	            .result(productService.getProduct(wildcardPart))
	            .build();
	}
//	@GetMapping("/search")
//	public ApiResponse<PageAndSearchProductResponse> getMethodName(
//			@RequestParam(value = "q",  required = false, defaultValue = "") String tenSanPham,
//			@RequestParam(value = "page", defaultValue = "0") int page,
//			 @RequestParam(name = "size", defaultValue = "20") int size) {
//		PageAndSearchProductResponse result = productService.searchProductResponse(tenSanPham, page, size);
//		return ApiResponse.<PageAndSearchProductResponse>builder()
//				.result(result)
//				.build();
//	}
	@PostMapping("/search")
	public ResponseEntity<?> search(@Valid @RequestBody SearchProductRequest request) {
		PageResponse<SearchProductResponse> response = productService.search(request);
		return ResponseEntity.ok(Map.of(
				"status", "success",
				"message", "Search completed",
				"data", response
		));
	}
	@PostMapping("/reindex")
	public ResponseEntity<?> reindex() {
		productService.reindexAll();
		return ResponseEntity.ok(Map.of(
				"status", "success",
				"message", "Reindex completed"
		));
	}
	@PostMapping("/sync-elasticsearch")
	public ResponseEntity<String> syncElasticsearch() {

		productService.syncDataDoc();

		return ResponseEntity.ok("Đồng bộ dữ liệu sang Elasticsearch thành công.");
	}
	@PostMapping("/filter")
	public ApiResponse<FilterPageResponse> filterProducts(@RequestBody FilterProductsRequest request) {
		FilterPageResponse result = productService.filterProduct(request);
		return ApiResponse.<FilterPageResponse>builder()
				.result(result)
				.build();
	}
	@PostMapping("/type")
	public ApiResponse<List<String>> getDistinctType() {
		List<String> result = typeService.getDistinctType();
		return ApiResponse.<List<String>>builder()
				.result(result)
				.build();
	}
	@PostMapping("/filterAdmin")
	public ApiResponse<ListFilterProductAdminResponse> filterProductsAdmin(@RequestBody FilterProductAdminRequest request) {
		ListFilterProductAdminResponse result = productService.filterProductAdmin(request);
		return ApiResponse.<ListFilterProductAdminResponse>builder()
				.result(result)
				.build();
	}
	@PostMapping("/addProduct")
	public ApiResponse<Boolean> addProduct(@RequestBody AddProductRequest request) {
		Boolean result = productService.addProduct(request);
		return ApiResponse.<Boolean>builder()
				.result(result)
				.build();
	}
	@PostMapping("/forCart")
	public ApiResponse<List<GetProductForCart>> getProductForCart(@RequestBody List<String> request) {
		List<GetProductForCart> result = productService.getProductForCart(request);
		return ApiResponse.<List<GetProductForCart>>builder()
				.result(result)
				.build();
	}
	@PostMapping("/remove")
	public ApiResponse<Boolean> removeProduct(@RequestBody List<String> request) {
		Boolean result = productService.removeProductId(request);
		return ApiResponse.<Boolean>builder()
				.result(result)
				.build();
	}
	@PostMapping("/update")
	public ApiResponse<Boolean> updateProduct(@RequestBody UpdateProductRequest request) {
		Boolean result = productService.getProductUpdate(request);
		return ApiResponse.<Boolean>builder()
				.result(result)
				.build();
	}
	@PostMapping("/idAdmin")
	public ApiResponse<GetProductTableAdminResponse> getProductIdAdmin(@RequestBody IdProductRequest request) {
		GetProductTableAdminResponse result = productService.getProductIdAdmin(request);
		return ApiResponse.<GetProductTableAdminResponse>builder()
				.result(result)
				.build();
	}
	@PostMapping("/productCode")
	public  ApiResponse<GetProductCodeResponse> getProductCode(@RequestBody StringRequest request){
		GetProductCodeResponse result = productService.getProductCode(request);
		if(result != null){
			return ApiResponse.<GetProductCodeResponse>builder()
				.result(result)
				.build();
		}
		return ApiResponse.<GetProductCodeResponse>builder()
				.message("PRODUCT_NOT_EXIT")
				.build();
	}
}
