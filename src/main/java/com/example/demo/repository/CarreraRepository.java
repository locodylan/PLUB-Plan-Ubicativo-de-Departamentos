package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.Carrera;

public interface CarreraRepository extends JpaRepository<Carrera, Long> {
}
