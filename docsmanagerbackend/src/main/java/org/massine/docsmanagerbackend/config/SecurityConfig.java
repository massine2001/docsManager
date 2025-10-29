package org.massine.docsmanagerbackend.config;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.massine.docsmanagerbackend.services.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.*;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${oidc.issuer}") String issuer;
    @Value("${oidc.jwks}") String jwkSetUri;
    @Value("${security.cors.allowed-origins}") List<String> allowedOrigins;

    private final UserService userService;
    public SecurityConfig(UserService userService) {
        this.userService = userService;
    }
    @Bean
    SecurityFilterChain api(HttpSecurity http) throws Exception {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new ScopeAuthorityConverter());

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/health").permitAll()
                        .requestMatchers("/api/pool/invitations/**").permitAll()
                        .requestMatchers("/api/pools/public").permitAll()
                        .requestMatchers("/api/pools/*/public").permitAll()
                        .requestMatchers("/api/files/pool/*/public").permitAll()
                        .requestMatchers("/api/files/download/*/public").permitAll()
                        .requestMatchers("/api/files/preview/*/public").permitAll()
                        .requestMatchers("/public/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth -> oauth
                        .jwt(jwt -> jwt
                                .jwkSetUri(jwkSetUri)
                                .jwtAuthenticationConverter(converter)
                        )
                )
                .cors(cors -> {});
        http.addFilterAfter(new UserSyncFilter(userService), BearerTokenAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public OncePerRequestFilter logAuthHeader() {

        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
                    throws IOException, ServletException {
                String uri = req.getRequestURI();
                if (uri.startsWith("/public/")) {
                    chain.doFilter(req, res);
                    return;
                }
                if (req.getRequestURI().startsWith("/me") || req.getRequestURI().startsWith("/secure")) {
                    String auth = req.getHeader("Authorization");
                }
                chain.doFilter(req, res);
            }
        };
    }


    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        var c = new CorsConfiguration();
        c.setAllowedOrigins(allowedOrigins);
        c.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        c.setAllowedHeaders(List.of("Authorization","Content-Type","Accept"));
        c.setAllowCredentials(false);
        var s = new UrlBasedCorsConfigurationSource();
        s.registerCorsConfiguration("/**", c);
        return s;
    }
}
