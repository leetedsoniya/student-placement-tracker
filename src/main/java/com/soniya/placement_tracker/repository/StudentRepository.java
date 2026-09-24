package com.soniya.placement_tracker.repository;


import com.soniya.placement_tracker.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {

}