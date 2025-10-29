package org.massine.docsmanagerbackend.controllers;

import org.massine.docsmanagerbackend.config.CurrentUserProvider;
import org.massine.docsmanagerbackend.models.Pool;
import org.massine.docsmanagerbackend.models.User;
import org.massine.docsmanagerbackend.services.AccessService;
import org.massine.docsmanagerbackend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/")
public class UserController {
    private final UserService userService;
    private final AccessService accessService;
    private final CurrentUserProvider currentUser;


    public UserController(UserService userService, AccessService accessService, CurrentUserProvider currentUser) {
        this.userService = userService;
        this.accessService = accessService;
        this.currentUser = currentUser;
    }



    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/")
    public ResponseEntity<List<User>> getAllUsers() {
        User u = currentUser.get();


        if (!currentUser.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<User> users = userService.getAllUser();

        if (users.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(users);
    }


    @GetMapping("/count")
    public ResponseEntity<Long> getUsersCount() {
        User u = currentUser.get();


        if (!currentUser.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        long count = userService.getUsersCount();
        return ResponseEntity.ok(count);
    }


    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        User u = currentUser.get();

        User user = userService.findById(id);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        boolean isSelf = u.getId().equals(id);
        boolean hasCommonPool = hasCommonPool(u.getId(), id);

        if (!isSelf && !currentUser.isAdmin() && !hasCommonPool) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        System.out.println("Current user chiiiiii: " + user);

        User u = currentUser.get();
        System.out.println("Current user chiiiiii: " + u);
        if (!currentUser.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        User createdUser = userService.createUser(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable int id, @RequestBody User user) {
        User u = currentUser.get();

        boolean isSelf = u.getId().equals(id);

        if (!isSelf && !currentUser.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (isSelf && !currentUser.isAdmin() && user.getRole() != null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        User modifiedUser = userService.updateUser(id, user);

        return ResponseEntity.ok(modifiedUser);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        User u = currentUser.get();

        if (!currentUser.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (userService.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }

        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User u = currentUser.get();

        User user = userService.findByEmail(email);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        boolean isSelf = u.getEmail().equals(email);
        boolean isAdmin = "ADMIN".equalsIgnoreCase(u.getRole());

        if (!isSelf && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }


        return ResponseEntity.ok(user);
    }


    @GetMapping("/lastname/{lastname}")
    public ResponseEntity<User> getUserByLastName(@PathVariable String lastname) {
        User u = currentUser.get();

        if (!currentUser.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        User user = userService.findByLastName(lastname);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }


    @GetMapping("/firstname/{firstname}")
    public ResponseEntity<User> getUserByFirstName(@PathVariable String firstname) {
        User u = currentUser.get();

        if (!currentUser.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        User user = userService.findByFirstName(firstname);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }


    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUserByRole(@PathVariable String role) {
        User u = currentUser.get();

        if (!currentUser.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<User> users = userService.findByRole(role);

        if (users.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(users);
    }


    @GetMapping("/pools/{id}")
    public ResponseEntity<List<Pool>> getPoolsFromUser(@PathVariable int id) {
        User u = currentUser.get();

        boolean isSelf = u.getId().equals(id);

        if (!isSelf && !currentUser.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Pool> pools = accessService.getPoolsFromUser(id);
        if (pools.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(pools);
    }


    @GetMapping("/pools/count/{id}")
    public ResponseEntity<Integer> countPoolsByUser(@PathVariable int id) {
        User u = currentUser.get();

        boolean isSelf = u.getId().equals(id);

        if (!isSelf && !currentUser.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        int count = accessService.countPoolsByUser(id);
        return ResponseEntity.ok(count);
    }


    @GetMapping("/me")
    public ResponseEntity<User> getu() {
        User u = currentUser.get();
        User user = userService.findById(u.getId());
        return ResponseEntity.ok(user);
    }

    private boolean hasCommonPool(int userId1, int userId2) {
        List<Pool> pools1 = accessService.getPoolsFromUser(userId1);
        List<Pool> pools2 = accessService.getPoolsFromUser(userId2);

        return pools1.stream()
                .anyMatch(pool1 -> pools2.stream()
                        .anyMatch(pool2 -> pool1.getId().equals(pool2.getId())));
    }
}



