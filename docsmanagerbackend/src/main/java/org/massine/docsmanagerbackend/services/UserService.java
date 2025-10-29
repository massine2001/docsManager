package org.massine.docsmanagerbackend.services;

import org.massine.docsmanagerbackend.models.User;
import org.massine.docsmanagerbackend.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.oauth2.jwt.Jwt;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }
    public User findById(int id){
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User with id : "+id+" not found"));
    }
    public long getUsersCount() {
        return userRepository.count();
    }
    public User findByLastName(String lastName){
        return userRepository.findByLastName(lastName)
                .orElseThrow(() -> new RuntimeException("User with lastname : "+lastName+" not found"));
    }
    public User findByFirstName(String firstName){
        return userRepository.findByFirstName(firstName)
                .orElseThrow(() -> new RuntimeException("User with firstname : "+firstName+" not found"));
    }
    public User findByEmail(String email){
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User with email : "+email+" not found"));
    }
    
 
    public User findByEmailSafe(String email){
        return userRepository.findByEmail(email).orElse(null);
    }
    
    public List<User> findByRole(String role){
        return userRepository.findByRole(role);
    }
    public List<User> getAllUser(){
        return userRepository.findAll();
    }

    public User createUser(User user){
        return userRepository.save(user);
    }

    public User updateUser(int id, User user){
        User modifiedUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User with id : "+id+" not found"));
        if(user.getFirstName() != null){
            modifiedUser.setFirstName(user.getFirstName());
        }
        if(user.getLastName() != null){
            modifiedUser.setLastName(user.getLastName());
        }
        if(user.getEmail() != null){
            modifiedUser.setEmail(user.getEmail());
        }
        if(user.getRole() != null){
            modifiedUser.setRole(user.getRole());
        }
        return userRepository.save(modifiedUser);
    }

    public void deleteUser(int id){
        userRepository.deleteById(id);
    }
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    public  User findBySub(String sub){
        return userRepository.findBySub(sub)
                .orElseThrow(() -> new RuntimeException("User with sub : "+sub+" not found"));
    }

    @Transactional
    public User upsertFromJwt(Jwt jwt) {
        String sub   = jwt.getClaimAsString("sub");
        String email = jwt.getClaimAsString("email");
        String given = jwt.getClaimAsString("given_name");
        String family= jwt.getClaimAsString("family_name");

        if (sub == null || sub.isBlank()) {
            throw new IllegalArgumentException("JWT sans 'sub' – impossible de lier l’utilisateur");
        }

        var bySub = userRepository.findBySub(sub);
        if (bySub.isPresent()) {
            User u = bySub.get();
            if (email != null && !email.isBlank() && !email.equalsIgnoreCase(u.getEmail())) {
                u.setEmail(email);
            }
            if (given != null && !given.isBlank() && (u.getFirstName() == null || u.getFirstName().isBlank())) {
                u.setFirstName(given);
            }
            if (family != null && !family.isBlank() && (u.getLastName() == null || u.getLastName().isBlank())) {
                u.setLastName(family);
            }
            return userRepository.save(u);
        }

        if (email != null && !email.isBlank()) {
            var byEmail = userRepository.findByEmail(email);
            if (byEmail.isPresent()) {
                User u = byEmail.get();
                u.setSub(sub);
                if (given != null && !given.isBlank() && (u.getFirstName() == null || u.getFirstName().isBlank())) {
                    u.setFirstName(given);
                }
                if (family != null && !family.isBlank() && (u.getLastName() == null || u.getLastName().isBlank())) {
                    u.setLastName(family);
                }
                return userRepository.save(u);
            }
        }

        User u = new User();
        u.setSub(sub);
        if (email != null && !email.isBlank()) u.setEmail(email);
        if (given != null && !given.isBlank()) u.setFirstName(given);
        if (family != null && !family.isBlank()) u.setLastName(family);
        u.setRole("USER");
        return userRepository.save(u);
    }

}
