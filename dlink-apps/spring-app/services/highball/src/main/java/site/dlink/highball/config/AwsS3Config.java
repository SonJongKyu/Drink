package site.dlink.highball.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.dlink.highball.props.AwsProps;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AwsS3Config {
    private final AwsProps awsProps;

    @Bean
    public AmazonS3Client amazonS3Client() {
        BasicAWSCredentials awsCreds = new BasicAWSCredentials(awsProps.getAccessKey(), awsProps.getSecretKey());
        return (AmazonS3Client) AmazonS3ClientBuilder.standard()
                .withRegion(awsProps.getRegion())
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .build();
    }
}
