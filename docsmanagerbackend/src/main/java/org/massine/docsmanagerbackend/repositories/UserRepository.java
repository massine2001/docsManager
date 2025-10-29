package org.massine.docsmanagerbackend.repositories;

import org.massine.docsmanagerbackend.models.User;
import jakarta.annotation.Nonnull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findById(int id);
    Optional<User> findByFirstName(String firstName);
    Optional<User> findByLastName(String lastName);
    Optional<User> findByEmail(String email);
    Optional<User> findBySub(String sub);
    @Nonnull
    List<User> findByRole(String role);
    @Nonnull
    List<User> findAll();
    boolean existsByEmail(String email);

}
