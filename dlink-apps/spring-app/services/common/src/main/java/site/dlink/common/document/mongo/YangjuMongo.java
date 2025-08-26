package site.dlink.common.document.mongo;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "alcohols")
public class YangjuMongo {

    @Id
    private String id;

    private String korName;
    private String origin;
    private float percent;
    private int volume;
    private int price;
    private String image;
    private String explanation;
}