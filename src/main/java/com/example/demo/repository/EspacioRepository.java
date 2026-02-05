package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Espacio;

public interface EspacioRepository extends JpaRepository<Espacio, Long> {

    // Espacios por carrera
    List<Espacio> findByCarreraId(Long carreraId);

    // Espacios por carrera y tipo
    List<Espacio> findByCarreraIdAndTipoEspacioId(Long carreraId, Long tipoEspacioId);
}
