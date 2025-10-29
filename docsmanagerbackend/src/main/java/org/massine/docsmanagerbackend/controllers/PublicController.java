package org.massine.docsmanagerbackend.controllers;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import org.massine.docsmanagerbackend.dto.AcceptInvitationRequest;
import org.massine.docsmanagerbackend.models.Access;
import org.massine.docsmanagerbackend.models.File;
import org.massine.docsmanagerbackend.models.Pool;
import org.massine.docsmanagerbackend.repositories.AccessRepository;
import org.massine.docsmanagerbackend.services.FileService;
import org.massine.docsmanagerbackend.services.JwtService;
import org.massine.docsmanagerbackend.services.PoolService;
import org.massine.docsmanagerbackend.services.UserService;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/public")
public class PublicController {


    private final PoolService poolService;
    private final FileService fileService;

    private final UserService userService;
    private final AccessRepository accessRepository;
    private final JwtService jwtService;

    public PublicController(PoolService poolService, FileService fileService, UserService userService, AccessRepository accessRepository, JwtService jwtService) {
        this.poolService = poolService;
        this.fileService = fileService;
        this.userService = userService;
        this.accessRepository = accessRepository;
        this.jwtService = jwtService;
    }


    @GetMapping("/pools")
    public ResponseEntity<List<Map<String, Object>>> getPublicPools() {
        System.out.println("Fetching public pools...");
        List<Pool> publicPools = poolService.getAllPools().stream()
                .filter(pool -> pool.getPublicAccess() != null && pool.getPublicAccess())
                .collect(Collectors.toList());

        List<Map<String, Object>> poolsWithFileCount = publicPools.stream()
                .map(pool -> {
                    Map<String, Object> poolData = Map.of(
                            "id", pool.getId(),
                            "name", pool.getName(),
                            "description", pool.getDescription() != null ? pool.getDescription() : "",
                            "createdAt", pool.getCreatedAt(),
                            "fileCount", fileService.findByPoolId(pool.getId()).size(),
                            "isPublic", true
                    );
                    return poolData;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(poolsWithFileCount);
    }


    @GetMapping("/pools/{poolId}")
    public ResponseEntity<?> getPublicPoolDetails(@PathVariable int poolId) {
        Pool pool = poolService.getPoolById(poolId);

        if (pool == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Pool non trouve"));
        }

        if (pool.getPublicAccess() == null || !pool.getPublicAccess()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Ce pool n'est pas public"));
        }

        Map<String, Object> poolDetails = Map.of(
                "id", pool.getId(),
                "name", pool.getName(),
                "description", pool.getDescription() != null ? pool.getDescription() : "",
                "createdAt", pool.getCreatedAt(),
                "isPublic", true
        );

        return ResponseEntity.ok(poolDetails);
    }


    @GetMapping("/files/pool/{poolId}")
    public ResponseEntity<?> getPublicPoolFiles(@PathVariable int poolId) {
        Pool pool = poolService.getPoolById(poolId);

        if (pool == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Pool non trouve"));
        }

        if (pool.getPublicAccess() == null || !pool.getPublicAccess()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Ce pool n'est pas public"));
        }

        List<File> files = fileService.findByPoolId(poolId);

        List<Map<String, Object>> filesData = files.stream()
                .map(file -> {
                    Map<String, Object> fileData = new java.util.HashMap<>();
                    fileData.put("id", file.getId());
                    fileData.put("name", file.getName());
                    fileData.put("path", file.getPath());
                    fileData.put("createdAt", file.getCreatedAt());
                    fileData.put("pool", Map.of("id", file.getPool().getId()));
                    if (file.getUserUploader() != null) {
                        fileData.put("userUploader", Map.of(
                                "id", file.getUserUploader().getId(),
                                "firstName", file.getUserUploader().getFirstName(),
                                "lastName", file.getUserUploader().getLastName(),
                                "email", file.getUserUploader().getEmail()
                        ));
                    }
                    return fileData;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(filesData);
    }


    @GetMapping("/files/download/{fileId}")
    public ResponseEntity<Resource> downloadPublicFile(@PathVariable int fileId) {
        File file = fileService.getFileById(fileId);

        if (file == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }

        Pool pool = file.getPool();
        if (pool.getPublicAccess() == null || !pool.getPublicAccess()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(null);
        }

        try {
            FileService.RemoteStream rs = fileService.getRemoteStream(file.getPath());
            HttpHeaders headers = new HttpHeaders();
            String filename = file.getName();
            if (filename == null || filename.isBlank()) {
                filename = "download";
            }
            headers.setContentDisposition(ContentDisposition.attachment().filename(filename).build());
            if (rs.length() >= 0) headers.setContentLength(rs.length());

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(rs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/files/preview/{fileId}")
    public ResponseEntity<Resource> previewPublicFile(@PathVariable int fileId) {
        File file = fileService.getFileById(fileId);

        if (file == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }

        Pool pool = file.getPool();
        if (pool.getPublicAccess() == null || !pool.getPublicAccess()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(null);
        }

        try {
            FileService.RemoteStream rs = fileService.getRemoteStream(file.getPath());
            String fileName = file.getName();
            if (fileName == null || fileName.isBlank()) {
                fileName = "preview";
            }
            String lowerFileName = fileName.toLowerCase();
            MediaType contentType;

            if (lowerFileName.endsWith(".pdf")) contentType = MediaType.APPLICATION_PDF;
            else if (lowerFileName.endsWith(".jpg") || lowerFileName.endsWith(".jpeg")) contentType = MediaType.IMAGE_JPEG;
            else if (lowerFileName.endsWith(".png")) contentType = MediaType.IMAGE_PNG;
            else if (lowerFileName.endsWith(".gif")) contentType = MediaType.IMAGE_GIF;
            else if (lowerFileName.endsWith(".svg")) contentType = MediaType.valueOf("image/svg+xml");
            else if (lowerFileName.endsWith(".mp4")) contentType = MediaType.valueOf("video/mp4");
            else if (lowerFileName.endsWith(".webm")) contentType = MediaType.valueOf("video/webm");
            else if (lowerFileName.endsWith(".mp3")) contentType = MediaType.valueOf("audio/mpeg");
            else if (lowerFileName.endsWith(".wav")) contentType = MediaType.valueOf("audio/wav");
            else if (lowerFileName.endsWith(".txt")) contentType = MediaType.TEXT_PLAIN;
            else if (lowerFileName.endsWith(".json")) contentType = MediaType.APPLICATION_JSON;
            else contentType = MediaType.APPLICATION_OCTET_STREAM;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentDisposition(ContentDisposition.inline().filename(fileName).build());
            headers.add(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Content-Type, Content-Disposition");
            headers.add(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate");
            if (rs.length() >= 0) headers.setContentLength(rs.length());

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(contentType)
                    .body(rs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/invitations/validate/{token}")
    public ResponseEntity<?> validateInvitationToken(@PathVariable String token) {
        try {
            Claims claims = jwtService.validateToken(token);

            if (!"invitation".equals(claims.get("type"))) {
                return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Ce token n'est pas une invitation"));
            }

            Integer poolId = claims.get("poolId", Integer.class);
            Pool pool = poolService.getPoolById(poolId);
            if (pool == null) {
                return ResponseEntity.status(404).body(Map.of("valid", false, "message", "Ce pool n'existe plus"));
            }

            String email = claims.get("email", String.class);
            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "email", email,
                    "poolId", poolId,
                    "poolName", pool.getName(),
                    "expiresAt", claims.getExpiration()
            ));
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(410).body(Map.of("valid", false, "message", "Ce lien d'invitation a expiré"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Token d'invitation invalide"));
        }
    }

    @PostMapping("/public/invitations/accept")
    public ResponseEntity<?> acceptInvitation(@RequestBody AcceptInvitationRequest request,
                                              @AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        try {
            var claims = jwtService.validateToken(request.getToken());
            if (!jwtService.isInvitationToken(claims)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Token invalide"));
            }

            Integer poolId = asInteger(claims.get("poolId"));
            String invitedEmail = claims.get("email", String.class); // peut être null = invitation ouverte
            String userEmail = jwt.getClaimAsString("email");

            if (invitedEmail != null && !invitedEmail.equalsIgnoreCase(userEmail)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                        "success", false, "message", "Cette invitation est destinée à une adresse différente"
                ));
            }

            var user = userService.upsertFromJwt(jwt); // crée/MAJ l’utilisateur côté backend à partir du JWT IdP

            var pool = poolService.getPoolById(poolId);
            if (pool == null) return ResponseEntity.status(404).body(Map.of("success", false, "message", "Le pool n'existe plus"));
            if (accessRepository.findByUserIdAndPoolId(user.getId(), poolId).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("success", false, "message", "Déjà membre"));
            }

            String role = Optional.ofNullable((String) claims.get("role")).orElse("member");
            var access = new Access();
            access.setUser(user);
            access.setPool(pool);
            access.setRole(role);
            accessRepository.save(access);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Vous avez rejoint le pool avec succès !",
                    "poolId", poolId,
                    "poolName", pool.getName()
            ));

        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(410).body(Map.of("success", false, "message", "Ce lien d'invitation a expiré"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Erreur lors de l'acceptation de l'invitation"));
        }
    }


    private Integer asInteger(Object value) {
        if (value instanceof Integer i) return i;
        if (value instanceof Long l) return Math.toIntExact(l);
        if (value instanceof Number n) return n.intValue();
        return null;
    }
}
