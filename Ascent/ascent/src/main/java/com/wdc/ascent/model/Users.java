package com.wdc.ascent.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.Objects;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "users")
public class Users {
    //how it appears in database
    //user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    //    first_name VARCHAR(45) NOT NULL,
    //    last_name VARCHAR(45) NOT NULL,
    //    email VARCHAR(45) NOT NULL,
    //    user_role VARCHAR(45) NOT NULL,
    //    manager_email VARCHAR(45) NOT NULL

    //variables
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int id;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Size(max = 45, message = "must be 45 characters or less")
    @Column(name = "first_name")
    private String firstName;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Size(max = 45, message = "must be 45 characters or less")
    @Column(name = "last_name")
    private String lastName;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Size(max = 45, message = "must be 45 characters or less")
    private String email;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Size(max = 45, message = "must be 45 characters or less")
    private String password;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Size(max = 45, message = "must be 45 characters or less")
    @Column(name = "user_role")
    private String userRole;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Size(max = 45, message = "must be 45 characters or less")
    @Column(name = "manager_email")
    private String managerEmail;

    //getters and setters

    public int getId() {
        return id;
    }


    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getManagerEmail() {
        return managerEmail;
    }

    public void setManagerEmail(String managerEmail) {
        this.managerEmail = managerEmail;
    }

    //object definition


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Users users)) return false;
        return getId() == users.getId() && Objects.equals(getFirstName(), users.getFirstName()) && Objects.equals(getLastName(), users.getLastName()) && Objects.equals(getEmail(), users.getEmail()) && Objects.equals(getPassword(), users.getPassword()) && Objects.equals(getUserRole(), users.getUserRole()) && Objects.equals(getManagerEmail(), users.getManagerEmail());
    }

    //hashcode
    @Override
    public int hashCode() {
        return Objects.hash(getId(), getFirstName(), getLastName(), getEmail(), getPassword(), getUserRole(), getManagerEmail());
    }
}// end class