package com.datn.sellWatches.Controller;

import org.springframework.security.web.header.Header;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.datn.sellWatches.DTO.Request.Dashboard.DashboardDayRequest;
import com.datn.sellWatches.DTO.Response.ApiResponse;
import com.datn.sellWatches.DTO.Response.DasboardResponse.DasboardCustomerResponse;
import com.datn.sellWatches.DTO.Response.DasboardResponse.DashboardBottom;
import com.datn.sellWatches.DTO.Response.DasboardResponse.DashboardOrderResponse;
import com.datn.sellWatches.DTO.Response.DasboardResponse.DashboardProductResponse;
import com.datn.sellWatches.DTO.Response.DasboardResponse.DashboardRevenueTopResponse;
import com.datn.sellWatches.DTO.Response.DasboardResponse.DashboardTop;
import com.datn.sellWatches.Service.CustomerService;
import com.datn.sellWatches.Service.OrderService;
import com.datn.sellWatches.Service.PaymentService;
import com.datn.sellWatches.Service.ShipService;
import com.datn.sellWatches.Service.WarehouseService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

	private final ShipService shipService;
	private final CustomerService customerService;
	private final OrderService orderService;
	private final PaymentService paymentService; 
	private final WarehouseService warehouseService;
	
	@PostMapping("/top")
	ApiResponse<DashboardTop> dashboardProductTop(@RequestBody DashboardDayRequest request) {
		log.info(request.toString());
		DashboardProductResponse dasProduct = shipService.dashboardProduct(request);
		DasboardCustomerResponse dasCustomer = customerService.getDasboardCustomer(request);
		DashboardOrderResponse dasOrder = orderService.dashboardOrder(request);
		DashboardRevenueTopResponse dasProductSell = warehouseService.DashboardRevenueTop(request);
		DashboardTop result = DashboardTop.builder()
				.productResponse(dasProduct)
				.orderResponse(dasOrder)
				.customerResponse(dasCustomer)
				.productSell(dasProductSell)
				.build();
		return ApiResponse.<DashboardTop>builder()
				.result(result)
				.build();
	}
	@PostMapping("/bottom")
	ApiResponse<DashboardBottom> dashboardProductBottom(@RequestBody DashboardDayRequest request) {
		DashboardBottom result = paymentService.dashboardPayment(request);
		return ApiResponse.<DashboardBottom>builder()
				.result(result)
				.build();
	}
	
}
