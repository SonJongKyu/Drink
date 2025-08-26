package site.dlink.apiGateway.filter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GlobalFilter;

import java.net.InetSocketAddress;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import site.dlink.apiGateway.constants.gatewayConstants;
import site.dlink.apiGateway.validator.JwtValidator;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtGlobalFilter implements GlobalFilter, Ordered {

    private final JwtValidator jwtValidator;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        String method = request.getMethod().name();
        String clientIp = getClientIp(request);
        String userAgent = request.getHeaders().getFirst("User-Agent");

        log.info("요청 정보: [Method: {}] [Path: {}] [Client IP: {}] [User-Agent: {}]", 
                 method, path, clientIp, userAgent);
        if (gatewayConstants.EXCLUDED_PATHS.stream().anyMatch(path::startsWith)) {
            return chain.filter(exchange);
        }

        String header = request.getHeaders().getFirst("Authorization");

        if (header == null) {
            log.info("❌ 토큰 없음");
            return chain.filter(exchange);
        }

        if (!header.startsWith("Bearer ")) {
            log.info("❌ 잘못된 형식의 JWT");
            return chain.filter(exchange);
        }

        String jwt = header.replace("Bearer ", "");

        if (!jwtValidator.validateToken(jwt)) {
            log.info("❌ JWT 검증 실패");
            return chain.filter(exchange);
        }

        return chain.filter(exchange);
    }

    private String getClientIp(ServerHttpRequest request) {
        String clientIp = request.getHeaders().getFirst("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty()) {
            InetSocketAddress remoteAddress = request.getRemoteAddress();
            clientIp = (remoteAddress != null) ? remoteAddress.getAddress().getHostAddress() : "UNKNOWN";
        }
        return clientIp;
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
