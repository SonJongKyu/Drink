package site.dlink.alcohols.repository.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import site.dlink.common.document.mongo.WineMongo;

@Repository
public interface WineMongoRepository extends MongoRepository<WineMongo, String> {

}