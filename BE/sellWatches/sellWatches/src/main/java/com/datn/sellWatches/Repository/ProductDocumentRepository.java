package com.datn.sellWatches.Repository;

import com.datn.sellWatches.Document.ProductDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDocumentRepository extends ElasticsearchRepository<ProductDocument, String> {

}
