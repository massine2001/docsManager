package org.massine.docsmanagerbackend.controllers;

import org.massine.docsmanagerbackend.services.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class MeController {

    private final UserService users;

    public MeController(UserService users) {
        this.users = users;
    }

    @GetMapping("/public/ping")
    public Map<String,String> ping() { return Map.of("status","ok"); }

    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal Jwt jwt) {
        var u = users.upsertFromJwt(jwt);
        return Map.of(
                "sub", jwt.getSubject(),
                "scopes", jwt.getClaimAsString("scope"),
                "userId", u.getId(),
                "email", u.getEmail()
        );
    }

    @PreAuthorize("hasAuthority('SCOPE_api.read')")
    @GetMapping("/secure")
    public Map<String,String> secure() { return Map.of("ok","true"); }
}

