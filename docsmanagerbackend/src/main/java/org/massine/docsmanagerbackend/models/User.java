package org.massine.docsmanagerbackend.models;


import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_users_sub", columnList = "sub", unique = true)
})
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 255)
    private String sub;

    @Column(unique = true, length = 255)
    private String email;

    @Column
    private String lastName;

    @Column
    private String firstName;

    @Column
    private String role;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public User() {}
    public User(String sub) { this.sub = sub; }

    public String getLastName() {
        return lastName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setLastName(String last_name) {this.lastName = last_name;}
    public String getFirstName() {return firstName;}
    public void setFirstName(String first_name) {this.firstName = first_name;}
    public Integer getId() { return id; }
    public String getSub() { return sub; }
    public void setSub(String sub) { this.sub = sub; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
