package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.TipoEspacio;

public interface TipoEspacioRepository extends JpaRepository<TipoEspacio, Long> {
}
