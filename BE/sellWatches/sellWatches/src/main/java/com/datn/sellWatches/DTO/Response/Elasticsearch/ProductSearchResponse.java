package com.datn.sellWatches.DTO.Response.Elasticsearch;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductSearchResponse {
    String id;
    String ma_san_pham;
    String ten_san_pham;
    String loai;
    int gia;
    String mo_ta;
    String loai_may;
    String mat_kinh;
    String chat_lieu_vo;
    String chat_lieu_day;
    String mau_mat;
    String xuat_xu;
    String kieu_dang;
    String phong_cach;
    float duong_kinh;
    float do_day;
    String khang_nuoc;
    String bao_hanh_hang;
    String bao_hanh_shop;
    LocalDate ngay_tao;
    String khac;
    String thuong_hieu;
    String gioi_tinh;
    int da_ban;
    int ton_kho;
    int gia_nhap;
    LocalDate ngay_nhap;
    String ghi_chu;
}
