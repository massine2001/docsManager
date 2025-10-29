package org.massine.docsmanagerbackend.services;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Duration;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretB64;

    @Value("${jwt.invitation.ttl:PT168H}")
    private Duration invitationTtl;

    @Value("${jwt.auth.ttl:PT24H}")
    private Duration authTtl;

    private Key key() {
        byte[] keyBytes = Decoders.BASE64.decode(secretB64);
        return Keys.hmacShaKeyFor(keyBytes);
    }


    public String generateInvitationToken(String email, int poolId, Integer invitedBy) {
        String jti = UUID.randomUUID().toString();
        Date now = new Date();
        Date exp = new Date(now.getTime() + invitationTtl.toMillis());

        JwtBuilder b = Jwts.builder()
                .setIssuedAt(now)
                .setExpiration(exp)
                .setId(jti)
                .claim("type", "invitation")
                .claim("poolId", poolId)
                .claim("invitedBy", invitedBy)
                .claim("role", "member");

        if (email != null && !email.isBlank()) {
            b.claim("email", email);
        }

        String token = b.signWith(key(), SignatureAlgorithm.HS256).compact();
        return token;
    }

    public Claims validateToken(String token) {
        try {
            Claims c = Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return c;
        } catch (ExpiredJwtException e) {
            throw e;
        } catch (JwtException e) {
            e.printStackTrace();
            throw e;
        }
    }



    public boolean isInvitationToken(Claims c) {
        return "invitation".equals(c.get("type"));
    }


    @Deprecated
    public String generateAuthToken(Integer userId, String email, String role) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + authTtl.toMillis());

        return Jwts.builder()
                .setClaims(Map.of(
                        "userId", userId,
                        "email", email,
                        "role", role
                ))
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    @Deprecated public String extractEmail(String token) { return validateToken(token).getSubject(); }
    @Deprecated public Integer extractUserId(String token) { return validateToken(token).get("userId", Integer.class); }
    @Deprecated public boolean isTokenValid(String token, String email) {
        try {
            Claims c = validateToken(token);
            return email != null && email.equals(c.getSubject());
        } catch (JwtException e) {
            return false;
        }
    }

    public Claims peekClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
