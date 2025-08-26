package site.dlink.pairing.props;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class AwsProps {

    @Value("${spring.ai.bedrock.aws.access-key}")
    private String accessKey;

    @Value("${spring.ai.bedrock.aws.secret-key}")
    private String secretKey;

    @Value("${spring.ai.bedrock.aws.region}")
    private String region;

    @Value("${spring.ai.bedrock.converse.chat.options.model}")
    private String modelId;
}
