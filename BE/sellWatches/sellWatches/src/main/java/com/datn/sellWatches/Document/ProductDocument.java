package com.datn.sellWatches.Document;

import lombok.*;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;

@Document(indexName = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDocument {
    @Id
    String id;
    @Field(type = FieldType.Keyword)
    String ma_san_pham;
    @Field(type = FieldType.Text, analyzer = "standard")
    String ten_san_pham;
    @Field(type = FieldType.Keyword)
    String loai;
    @Field(type = FieldType.Integer)
    int gia;
    @Field(type = FieldType.Text, analyzer = "standard")
    String mo_ta;
    @Field(type = FieldType.Keyword)
    String loai_may;
    @Field(type = FieldType.Keyword)
    String mat_kinh;
    @Field(type = FieldType.Keyword)
    String chat_lieu_vo;
    @Field(type = FieldType.Keyword)
    String chat_lieu_day;
    @Field(type = FieldType.Keyword)
    String mau_mat;
    @Field(type = FieldType.Keyword)
    String xuat_xu;
    @Field(type = FieldType.Keyword)
    String kieu_dang;
    @Field(type = FieldType.Keyword)
    String phong_cach;
    @Field(type = FieldType.Float)
    float duong_kinh;
    @Field(type = FieldType.Float)
    float do_day;
    @Field(type = FieldType.Keyword)
    String khang_nuoc;
    @Field(type = FieldType.Keyword)
    String bao_hanh_hang;
    @Field(type = FieldType.Keyword)
    String bao_hanh_shop;
    @Field(type = FieldType.Date, pattern = "uuuu-MM-dd")
    LocalDate ngay_tao;
    @Field(type = FieldType.Keyword)
    String khac;
    @Field(type = FieldType.Keyword)
    String thuong_hieu;
    @Field(type = FieldType.Keyword)
    String gioi_tinh;
    @Field(type = FieldType.Integer)
    int da_ban;
    @Field(type = FieldType.Integer)
    int ton_kho;
    @Field(type = FieldType.Integer)
    int gia_nhap;
    @Field(type = FieldType.Date, pattern = "uuuu-MM-dd")
    LocalDate ngay_nhap;
    @Field(type = FieldType.Text, analyzer = "standard")
    String ghi_chu;
    @Field(type = FieldType.Keyword)
    String hinh_anh;
}
