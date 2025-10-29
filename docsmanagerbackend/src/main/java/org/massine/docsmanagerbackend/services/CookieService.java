package org.massine.docsmanagerbackend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class CookieService {

    @Value("${cookie.secure:false}")
    private boolean cookieSecure;

    @Value("${cookie.domain:}")
    private String cookieDomain;


    public String createAuthCookie(String token) {
        StringBuilder cookie = new StringBuilder();

        cookie.append("auth_token=").append(token).append("; ");
        cookie.append("HttpOnly; ");

        if (cookieSecure) {
            cookie.append("Secure; ");
            cookie.append("SameSite=None; ");
        } else {
            cookie.append("SameSite=Lax; ");
        }

        cookie.append("Path=/; ");
        cookie.append("Max-Age=").append(24 * 60 * 60); // 24 heures

        if (cookieDomain != null && !cookieDomain.isEmpty()) {
            cookie.append("; Domain=").append(cookieDomain);
        }

        return cookie.toString();
    }


    public String deleteAuthCookie() {
        StringBuilder cookie = new StringBuilder();

        cookie.append("auth_token=; ");
        cookie.append("HttpOnly; ");

        if (cookieSecure) {
            cookie.append("Secure; ");
            cookie.append("SameSite=None; ");
        } else {
            cookie.append("SameSite=Lax; ");
        }

        cookie.append("Path=/; ");
        cookie.append("Max-Age=0");

        if (cookieDomain != null && !cookieDomain.isEmpty()) {
            cookie.append("; Domain=").append(cookieDomain);
        }

        return cookie.toString();
    }
}
