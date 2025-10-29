package org.massine.docsmanagerbackend.controllers;

import org.massine.docsmanagerbackend.config.CurrentUserProvider;
import org.massine.docsmanagerbackend.models.Access;
import org.massine.docsmanagerbackend.models.User;
import org.massine.docsmanagerbackend.services.AccessService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/access")
public class AccessController {
    private final AccessService accessService;
    private final CurrentUserProvider currentUser;

    public AccessController(AccessService accessService, CurrentUserProvider currentUser) {
        this.accessService = accessService;
        this.currentUser = currentUser;
    }

    @GetMapping
    public ResponseEntity<List<Access>> getAccess() {
        User u = currentUser.get();

        if (!currentUser.isAdmin()) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        return ResponseEntity.ok(accessService.getAllAccess());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Access> getAccessById(@PathVariable int id) {

        User u = currentUser.get();

        Optional<Access> accessOpt = accessService.getAccessById(id);

        if (accessOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Access access = accessOpt.get();

        if (isNotPoolOwner(u, access)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

        return ResponseEntity.ok(access);
    }

    private boolean isNotPoolOwner(User u, Access access) {
        boolean isOwner = access.getUser().getId().equals(u.getId());
        boolean isPoolAdmin = accessService.userIsOwnerOrAdmin(u.getId(), access.getPool().getId());

        if (!isOwner && !isPoolAdmin && !currentUser.isAdmin()) {
            return true;
        }
        return false;
    }


    @PostMapping
    public ResponseEntity<Access> createAccess(@RequestBody Access access) {
        User u = currentUser.get();

        if (access.getPool() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (!accessService.userIsOwnerOrAdmin(u.getId(), access.getPool().getId())
            && !currentUser.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if ("owner".equalsIgnoreCase(access.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(null); 
        }

        Access createdAccess = accessService.saveAccess(access);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccess);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Access> updateAccess(@PathVariable int id, @RequestBody Access access) {
        User u = currentUser.get();

        
        Optional<Access> existingAccessOpt = accessService.getAccessById(id);

        if (existingAccessOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Access existingAccess = existingAccessOpt.get();

        if (!accessService.userIsOwnerOrAdmin(u.getId(), existingAccess.getPool().getId())
            && !currentUser.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if ("owner".equalsIgnoreCase(existingAccess.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (access.getRole() != null && "owner".equalsIgnoreCase(access.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Access modifiedAccess = accessService.updateAccess(id, access);
        return ResponseEntity.ok(modifiedAccess);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccess(@PathVariable int id) {
        User u = currentUser.get();

        Optional<Access> accessOpt = accessService.getAccessById(id);

        if (accessOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Access access = accessOpt.get();

        if ("owner".equalsIgnoreCase(access.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (isNotPoolOwner(u, access)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

        accessService.deleteAccess(id);
        return ResponseEntity.noContent().build();
    }
}

