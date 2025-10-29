 package org.massine.docsmanagerbackend.config;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.filter.OncePerRequestFilter;
import org.massine.docsmanagerbackend.services.UserService;

@Component
public class UserSyncFilter extends OncePerRequestFilter {

    private final UserService users;

    public UserSyncFilter(UserService users) {
        this.users = users;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws java.io.IOException, ServletException {

        String uri = req.getRequestURI();
        if (uri.startsWith("/public/")) {
            chain.doFilter(req, res);
            return;
        }

        if (req.getAttribute("user-sync-done") == null) {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
                try {
                    users.upsertFromJwt(jwt);
                } catch (Exception ignored) {
                }
            }
            req.setAttribute("user-sync-done", Boolean.TRUE);
        }

        chain.doFilter(req, res);
    }
}
