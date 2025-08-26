package site.dlink.alcohols.repository.es;

import org.springframework.stereotype.Repository;

import site.dlink.alcohols.document.es.YangjuEs;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

@Repository
public interface YangjuEsRepository extends ElasticsearchRepository<YangjuEs, String> {
}
