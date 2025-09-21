package com.javaprogramming.javaproject03;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(
    origins = { "http://127.0.0.1:5500", "http://localhost:5500" },
    allowedHeaders = "*"
)
@RestController
@RequestMapping("/students")
public class StudentController {
    
    private final StudentRepository studentRepository;
    
    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }
    
    @GetMapping
    public List<Student> getAll() { 
        return studentRepository.findAll(); 
    }
      
    @GetMapping("/{id}")
    public ResponseEntity<Student> getOne(@PathVariable("id") Long id) {
        Optional<Student> student = studentRepository.findById(id);
        if (student.isPresent()) {
            return ResponseEntity.ok(student.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public Student create(@RequestBody Student s) {
        return studentRepository.save(s);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Student> update(@PathVariable("id") Long id, @RequestBody Student s) {
        Optional<Student> optionalStudent = studentRepository.findById(id);
        if (optionalStudent.isPresent()) {
            Student target = optionalStudent.get();
            target.setStudentName(s.getStudentName());
            target.setStudentNumber(s.getStudentNumber());
            target.setStudentMajor(s.getStudentMajor());
            target.setStudentYear(s.getStudentYear());
            return ResponseEntity.ok(studentRepository.save(target));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}