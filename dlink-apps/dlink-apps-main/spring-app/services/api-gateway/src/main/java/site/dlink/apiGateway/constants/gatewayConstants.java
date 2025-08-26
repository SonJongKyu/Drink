package site.dlink.apiGateway.constants;

import java.util.List;

public class gatewayConstants {
       public static final List<String> EXCLUDED_PATHS = List.of(
            "/api/v1/alcohols/",
            "/api/v1/review/",
            "/api/v1/highball/",
            "/api/v1/pairing/"
    );
}
