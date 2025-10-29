package org.massine.docsmanagerbackend.config;

import org.massine.docsmanagerbackend.models.User;
import org.massine.docsmanagerbackend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class CurrentUserProvider {

    private final UserService userService;

    public CurrentUserProvider(UserService userService) {
        this.userService = userService;
    }

    public User get() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof Jwt jwt)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié");
        }

        User user = userService.findBySub(jwt.getSubject());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur inconnu");
        }

        return user;
    }

    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(get().getRole());
    }

    public String getSub() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof Jwt jwt)) return null;
        return jwt.getSubject();
    }
}
