package com.soniya.placement_tracker.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email")
    private String email;

    @NotBlank(message = "Branch is required")
    private String branch;

    @NotNull(message = "CGPA is required")
    @Min(value = 0, message = "CGPA cannot be less than 0")
    @Max(value = 10, message = "CGPA cannot be greater than 10")
    private Double cgpa;

    @NotBlank(message = "Placement status is required")
    private String placementStatus;

    private String company;

    @Min(value = 0, message = "Package cannot be negative")
    private Double packageAmount;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getBranch() {
        return branch;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public String getPlacementStatus() {
        return placementStatus;
    }

    public String getCompany() {
        return company;
    }

    public Double getPackageAmount() {
        return packageAmount;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public void setPlacementStatus(String placementStatus) {
        this.placementStatus = placementStatus;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public void setPackageAmount(Double packageAmount) {
        this.packageAmount = packageAmount;
    }
}