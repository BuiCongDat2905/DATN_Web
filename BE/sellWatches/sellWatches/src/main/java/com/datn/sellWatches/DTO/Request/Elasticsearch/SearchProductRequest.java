package com.datn.sellWatches.DTO.Request.Elasticsearch;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class SearchProductRequest {
    String keyword;

    int gia;
    String loai;
    String loaiMay;
    String matKinh;
    String chatLieuVo;
    String chatLieuDay;
    String mauMat;
    String xuatXu;
    String kieuDang;
    String phongCach;
    float duongKinh;
    float doDay;
    String khangNuoc;
    String thuongHieu;
    String gioiTinh;
    String khac;

    private String sortBy;
    private String sortDirection;

    @Builder.Default
    private Boolean fuzzy = true;

    @Builder.Default
    private int page = 0;

    @Builder.Default
    private int size = 20;
}
