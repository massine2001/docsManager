package org.massine.docsmanagerbackend.controllers;

import org.massine.docsmanagerbackend.config.CurrentUserProvider;
import org.massine.docsmanagerbackend.dto.InvitationRequest;
import org.massine.docsmanagerbackend.models.Access;
import org.massine.docsmanagerbackend.models.File;
import org.massine.docsmanagerbackend.models.Pool;
import org.massine.docsmanagerbackend.models.User;
import org.massine.docsmanagerbackend.repositories.AccessRepository;
import org.massine.docsmanagerbackend.repositories.UserRepository;
import org.massine.docsmanagerbackend.services.AccessService;
import org.massine.docsmanagerbackend.services.FileService;
import org.massine.docsmanagerbackend.services.PoolService;
import org.massine.docsmanagerbackend.services.UserService;
import org.massine.docsmanagerbackend.services.JwtService;
import org.massine.docsmanagerbackend.services.CookieService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pool/")
public class PoolController {
    private final PoolService poolService;
    private final AccessService accessService;
    private final FileService fileService;
    private final CurrentUserProvider currentUser;
    private final UserService userService;
    private final UserRepository userRepository;
    private final AccessRepository accessRepository;
    private final JwtService jwtService;


    public PoolController(
            PoolService poolService,
            AccessService accessService,
            FileService fileService,
            CurrentUserProvider currentUser, UserService userService,
            UserRepository userRepository,
            AccessRepository accessRepository,
            JwtService jwtService
    ) {
        this.poolService = poolService;
        this.accessService = accessService;
        this.fileService = fileService;
        this.currentUser = currentUser;
        this.userService = userService;
        this.userRepository = userRepository;
        this.accessRepository = accessRepository;
        this.jwtService = jwtService;
    }


    @GetMapping("/")
    public ResponseEntity<List<Pool>> getPools() {
        User u = currentUser.get();

        List<Pool> pools = poolService.getAllPoolsByUserId(u.getId());

        if(pools.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(pools);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getPoolsCount() {
        long count = poolService.getPoolsCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pool> getPoolById(@PathVariable("id") int id) {
        User u = currentUser.get();

        Pool pool = poolService.getPoolById(id);

        if(pool == null) {
            return ResponseEntity.notFound().build();
        }

        if (!accessService.userHasAccessToPool(u.getId(), id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(pool);
    }


    @PostMapping("/")
    public ResponseEntity<Pool> createPool(@RequestBody Pool pool) {
        User u = currentUser.get();

        pool.setCreatedBy(u.getId());

        Pool createdPool = poolService.savePool(pool);

        Access ownerAccess = new Access();
        ownerAccess.setUser(u);
        ownerAccess.setPool(createdPool);
        ownerAccess.setRole("owner");
        accessService.saveAccess(ownerAccess);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdPool);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Pool> updatePool(
            @PathVariable int id,
            @RequestBody Pool pool
    ) {
        User u = currentUser.get();
        Pool existingPool = poolService.getPoolById(id);

        if (existingPool == null) {
            return ResponseEntity.notFound().build();
        }

        if (!accessService.userIsOwnerOrAdmin(u.getId(), id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Pool updatedPool = poolService.updatePool(id, pool);
        return ResponseEntity.ok(updatedPool);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePool(@PathVariable("id") int id) {
        User u = currentUser.get();

        Pool pool = poolService.getPoolById(id);

        if (pool == null) {
            return ResponseEntity.notFound().build();
        }

        Access access = accessService.getUserAccessToPool(u.getId(), id);
        if (access == null || !"owner".equalsIgnoreCase(access.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        poolService.deletePoolById(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/users/{id}")
    public ResponseEntity<List<User>> getUsersFromPool(@PathVariable int id){
        User u = currentUser.get();

        if (!accessService.userHasAccessToPool(u.getId(), id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<User> users = accessService.getUsersFromPool(id);
        if(users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(users);
    }
    @GetMapping("/users/count/{id}")
    public int countUsersByPool(@PathVariable int id){
        return accessService.countUsersByPool(id);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Pool>> getAllPoolsByUserId(@PathVariable int userId) {
        List<Pool> pools = poolService.getAllPoolsByUserId(userId);
        if (pools.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(pools);
    }
    @GetMapping("/stats/{poolId}")
    public ResponseEntity<Map<String, Object>> getPoolStats(@PathVariable int poolId) {
        Pool pool = poolService.getPoolById(poolId);

        if (pool == null) {
            return ResponseEntity.notFound().build();
        }

        boolean isPublicPool = pool.getPublicAccess() != null && pool.getPublicAccess();

        if (!isPublicPool) {
            User u = currentUser.get();

            if (!accessService.userHasAccessToPool(u.getId(), poolId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        Map<String, Object> stats = new HashMap<>();


        stats.put("pool", pool);

        List<User> members = accessService.getUsersFromPool(poolId);
        List<Access> accesses = accessService.getAccessesByPool(poolId);

        stats.put("membersCount", members.size());
        stats.put("members", members);
        stats.put("accesses", accesses);

        Map<String, Long> roleDistribution = accesses.stream()
                .filter(access -> access.getRole() != null)
                .collect(Collectors.groupingBy(Access::getRole, Collectors.counting()));
        stats.put("roleDistribution", roleDistribution);

        Map<String, Long> userRoleDistribution = members.stream()
                .filter(user -> user.getRole() != null)
                .collect(Collectors.groupingBy(User::getRole, Collectors.counting()));
        stats.put("userRoleDistribution", userRoleDistribution);

        List<File> files = fileService.findByPoolId(poolId);

        stats.put("filesCount", files.size());
        stats.put("files", files);

        Map<User, Long> uploaderStats = files.stream()
                .filter(file -> file.getUserUploader() != null)
                .collect(Collectors.groupingBy(File::getUserUploader, Collectors.counting()));
        List<Map.Entry<User, Long>> topUploaders = uploaderStats.entrySet().stream()
                .sorted(Map.Entry.<User, Long>comparingByValue().reversed())
                .limit(5)
                .collect(Collectors.toList());
        stats.put("topUploaders", topUploaders);

        Map<String, Long> filesPerDay = files.stream()
                .filter(file -> file.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        file -> file.getCreatedAt().toString().substring(0, 10),
                        Collectors.counting()
                ));
        stats.put("filesPerDay", filesPerDay);

        Optional<File> lastFile = files.stream()
                .filter(file -> file.getCreatedAt() != null)
                .max(Comparator.comparing(File::getCreatedAt));
        stats.put("lastFile", lastFile.orElse(null));

        stats.put("mostActiveMembers", topUploaders);

        List<User> inactiveMembers = members.stream()
                .filter(user -> files.stream().noneMatch(f -> f.getUserUploader() != null && f.getUserUploader().getId().equals(user.getId())))
                .collect(Collectors.toList());
        stats.put("inactiveMembers", inactiveMembers);
        stats.put("inactiveMembersCount", inactiveMembers.size());

        stats.put("poolCreatedAt", pool.getCreatedAt());

        long poolAgeInDays = 0;
        if (pool.getCreatedAt() != null) {
            poolAgeInDays = ChronoUnit.DAYS.between(
                    pool.getCreatedAt(),
                    Instant.now()
            );
        }
        stats.put("poolAgeInDays", poolAgeInDays);

        Optional<User> newestMember = members.stream()
                .filter(user -> user.getCreatedAt() != null)
                .max(Comparator.comparing(User::getCreatedAt));
        stats.put("newestMember", newestMember.orElse(null));

        Optional<User> oldestMember = members.stream()
                .filter(user -> user.getCreatedAt() != null)
                .min(Comparator.comparing(User::getCreatedAt));
        stats.put("oldestMember", oldestMember.orElse(null));

        double avgFilesPerMember = members.isEmpty() ? 0 : (double) files.size() / members.size();
        stats.put("avgFilesPerMember", Math.round(avgFilesPerMember * 100.0) / 100.0);

        double activityRate = members.isEmpty() ? 0 :
                ((double) (members.size() - inactiveMembers.size()) / members.size() * 100);
        stats.put("activityRate", Math.round(activityRate * 100.0) / 100.0);

        Map<String, Long> fileExtensions = files.stream()
                .filter(f -> f.getName() != null)
                .map(f -> {
                    String name = f.getName();
                    int lastDot = name.lastIndexOf('.');
                    return lastDot > 0 ? name.substring(lastDot + 1).toLowerCase() : "sans extension";
                })
                .collect(Collectors.groupingBy(ext -> ext, Collectors.counting()));
        stats.put("fileExtensions", fileExtensions);

        if (pool.getCreatedBy() != null) {
            User creator = userService.findById(pool.getCreatedBy());
            stats.put("creator", creator);
        }

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/files/{poolId}")
    public ResponseEntity<List<File>> getFilesOfPool(@PathVariable int poolId) {
        User u = currentUser.get();

        Pool pool = poolService.getPoolById(poolId);

        if (pool == null) {
            return ResponseEntity.notFound().build();
        }

        if (!accessService.userHasAccessToPool(u.getId(), poolId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<File> files = fileService.findByPoolId(poolId);
        if (files.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(files);
    }

    @GetMapping("/files/count/{poolId}")
    public ResponseEntity<Long> getFilesCountOfPool(@PathVariable int poolId) {
        Pool pool = poolService.getPoolById(poolId);
        if (pool == null) {
            return ResponseEntity.notFound().build();
        }

        long count = fileService.findByPoolId(poolId).size();
        return ResponseEntity.ok(count);
    }



    @PostMapping("/invitations/generate-token")
    public ResponseEntity<?> generateInvitationToken(@RequestBody InvitationRequest request,
                                                     @AuthenticationPrincipal Jwt jwt) {
        var inviter = userService.upsertFromJwt(jwt);

        var access = accessRepository.findByUserIdAndPoolId(inviter.getId(), request.getPoolId().intValue())
                .orElse(null);
        if (access == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Seuls les membres de la pool peuvent inviter");
        }

        userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
            var a = accessRepository.findByUserIdAndPoolId(u.getId(), request.getPoolId().intValue());
            if (a.isPresent()) {
                throw new AlreadyMemberException();
            }
        });

        String token = jwtService.generateInvitationToken(
                request.getEmail(),
                request.getPoolId().intValue(),
                inviter.getId()
        );
        var claims = jwtService.peekClaims(token);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "token", token,
                "expiresAt", claims.getExpiration()
        ));
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    static class AlreadyMemberException extends RuntimeException {}


    private Integer asInteger(Object value) {
        if (value instanceof Integer i) return i;
        if (value instanceof Long l) return Math.toIntExact(l);
        if (value instanceof Number n) return n.intValue();
        return null;
    }

}
