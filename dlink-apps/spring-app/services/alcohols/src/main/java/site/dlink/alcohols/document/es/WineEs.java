package site.dlink.alcohols.document.es;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Data;

@Data
@Document(indexName = "wines")
public class WineEs {
    @Id
    private String id;

    @Field(type = FieldType.Text)
    private String korName;

    @Field(type = FieldType.Text)
    private String engName;

    @Field(type = FieldType.Text)
    private String image;

    @Field(type = FieldType.Text)
    private String price;

    @Field(type = FieldType.Integer)
    private int volume;

    @Field(type = FieldType.Integer)
    private int sweetness;

    @Field(type = FieldType.Integer)
    private int acidity;

    @Field(type = FieldType.Integer)
    private int body;

    @Field(type = FieldType.Integer)
    private int tannin;

    @Field(type = FieldType.Text)
    private String origin;

    @Field(type = FieldType.Text)
    private String percent;

    @Field(type = FieldType.Text)
    private String category;

    @Field(type = FieldType.Text)
    private String details;
}
