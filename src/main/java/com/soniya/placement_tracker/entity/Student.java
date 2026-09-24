package com.soniya.placement_tracker.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String branch;
    private double cgpa;

    private String placementStatus;
    private String company;
    private double packageAmount;

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

    public double getCgpa() {
        return cgpa;
    }

    public String getPlacementStatus() {
        return placementStatus;
    }

    public String getCompany() {
        return company;
    }

    public double getPackageAmount() {
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

    public void setCgpa(double cgpa) {
        this.cgpa = cgpa;
    }

    public void setPlacementStatus(String placementStatus) {
        this.placementStatus = placementStatus;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public void setPackageAmount(double packageAmount) {
        this.packageAmount = packageAmount;
    }
}