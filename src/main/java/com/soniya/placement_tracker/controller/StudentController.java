package com.soniya.placement_tracker.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import com.soniya.placement_tracker.entity.Student;
import com.soniya.placement_tracker.service.StudentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")


@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }

    @PutMapping("/{id}")
public Student updateStudent(@PathVariable Long id, @RequestBody Student student) {
    return studentService.updateStudent(id, student);
}
    @DeleteMapping("/{id}")
    public void 
    deleteStudent(@PathVariable long id){
        studentService.deleteStudent(id);
    }
}


