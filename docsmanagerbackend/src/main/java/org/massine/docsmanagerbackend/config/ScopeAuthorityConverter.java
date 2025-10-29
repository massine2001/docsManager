package org.massine.docsmanagerbackend.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.*;
import java.util.stream.Collectors;

public class ScopeAuthorityConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        var out = new ArrayList<String>();

        Object scp = jwt.getClaims().get("scp");
        if (scp instanceof Collection<?> coll) {
            for (Object o : coll) if (o != null) out.add(String.valueOf(o));
        }
        String scope = jwt.getClaimAsString("scope");
        if (scope != null && !scope.isBlank()) {
            out.addAll(Arrays.asList(scope.split("\\s+")));
        }

        return out.stream()
                .filter(s -> !s.isBlank())
                .map(s -> new SimpleGrantedAuthority("SCOPE_" + s))
                .collect(Collectors.toUnmodifiableSet());
    }
}
