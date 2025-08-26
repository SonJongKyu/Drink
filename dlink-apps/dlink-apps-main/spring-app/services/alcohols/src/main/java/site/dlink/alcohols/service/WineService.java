package site.dlink.alcohols.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import site.dlink.alcohols.constants.MongoConstants;
import site.dlink.alcohols.document.es.WineEs;
import site.dlink.alcohols.repository.mongo.WineMongoRepository;
import site.dlink.common.document.mongo.WineMongo;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class WineService {

        private final ElasticsearchOperations elasticsearchOperations;
        private final WineMongoRepository wineMongoRepository;
        private final MongoTemplate mongoTemplate;

        public WineMongo findById(String id) {
                return wineMongoRepository.findById(id).orElse(null);
        }

        public Document findDocumentById(String id) {
                ObjectId objectId = new ObjectId(id);

                Document result = mongoTemplate.getDb().getCollection("wine")
                                .find(new Document("_id", objectId)).first();
                return result;
        }

        public Page<WineEs> searchWinesByKeyword(String keyword, int page, int size) {
                IndexCoordinates indexCoordinates = IndexCoordinates.of(MongoConstants.DATABASE + ".wine");

                boolean isKorean = keyword.chars().anyMatch(ch -> Character.UnicodeBlock
                                .of(ch) == Character.UnicodeBlock.HANGUL_SYLLABLES ||
                                Character.UnicodeBlock.of(ch) == Character.UnicodeBlock.HANGUL_JAMO ||
                                Character.UnicodeBlock.of(ch) == Character.UnicodeBlock.HANGUL_COMPATIBILITY_JAMO);

                String searchField = isKorean ? "korName" : "engName";

                NativeQuery query = NativeQuery.builder()
                                .withQuery(q -> q.multiMatch(m -> m
                                                .query(keyword)
                                                .fuzziness("AUTO")
                                                .fields(searchField)))
                                .withPageable(PageRequest.of(page, size))
                                .build();

                SearchHits<WineEs> searchHits = elasticsearchOperations.search(query, WineEs.class, indexCoordinates);

                List<WineEs> results = searchHits.stream()
                                .map(hit -> hit.getContent())
                                .collect(Collectors.toList());

                return new PageImpl<>(results, PageRequest.of(page, size), searchHits.getTotalHits());
        }

        public Page<WineEs> findAllWines(int page, int size) {
                IndexCoordinates indexCoordinates = IndexCoordinates.of(MongoConstants.DATABASE+ ".wine");

                NativeQuery query = NativeQuery.builder()
                                .withQuery(q -> q.matchAll(m -> m))
                                .withPageable(PageRequest.of(page, size))
                                .build();

                SearchHits<WineEs> searchHits = elasticsearchOperations.search(query, WineEs.class, indexCoordinates);
                log.info("📜 전체 와인 목록 조회: {}", searchHits.getTotalHits());

                List<WineEs> results = searchHits.stream()
                                .map(hit -> hit.getContent())
                                .collect(Collectors.toList());

                return new PageImpl<>(results, PageRequest.of(page, size), searchHits.getTotalHits());
        }
}
