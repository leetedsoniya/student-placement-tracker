package com.soniya.placement_tracker.service;



import com.soniya.placement_tracker.entity.Student;
import com.soniya.placement_tracker.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }
        public Student updateStudent(Long id, Student student) {
    Student existingStudent = studentRepository.findById(id).orElseThrow();

    existingStudent.setName(student.getName());
    existingStudent.setEmail(student.getEmail());
    existingStudent.setBranch(student.getBranch());
    existingStudent.setCgpa(student.getCgpa());

    return studentRepository.save(existingStudent);
}
 public void deleteStudent(Long id){
    studentRepository.deleteById(id);
 }
        
    }



