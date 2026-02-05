package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.entity.Carrera;
import com.example.demo.entity.TipoEspacio;
import com.example.demo.entity.Espacio;
import com.example.demo.repository.CarreraRepository;
import com.example.demo.repository.TipoEspacioRepository;

import jakarta.servlet.http.HttpSession;

import com.example.demo.repository.EspacioRepository;

@RestController
@RequestMapping("/api")
public class ApiUbicacionController {

    private final CarreraRepository carreraRepo;
    private final TipoEspacioRepository tipoRepo;
    private final EspacioRepository espacioRepo;

    public ApiUbicacionController(
            CarreraRepository carreraRepo,
            TipoEspacioRepository tipoRepo,
            EspacioRepository espacioRepo) {
        this.carreraRepo = carreraRepo;
        this.tipoRepo = tipoRepo;
        this.espacioRepo = espacioRepo;
    }

    // 1️⃣ Listar carreras
    @GetMapping("/carreras")
    public List<Carrera> listarCarreras() {
        return carreraRepo.findAll();
    }

    // 2️⃣ Listar tipos de espacios
    @GetMapping("/tipos-espacio")
    public List<TipoEspacio> listarTipos() {
        return tipoRepo.findAll();
    }

    // 3️⃣ Listar espacios por carrera y tipo
    @GetMapping("/espacios")
    public List<Espacio> listarEspacios(
            @RequestParam Long carreraId,
            @RequestParam Long tipoId) {

        return espacioRepo.findByCarreraIdAndTipoEspacioId(carreraId, tipoId);
    }
    @PostMapping("/tipos-espacio")
public TipoEspacio crearTipo(@RequestBody TipoEspacio tipo, HttpSession session) {

    String rol = (String) session.getAttribute("rol");

    if (!"ADMIN".equals(rol)) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No autorizado");
    }

    return tipoRepo.save(tipo);
}
@DeleteMapping("/tipos-espacio/{id}")
public void eliminarTipo(@PathVariable Long id, HttpSession session) {

    String rol = (String) session.getAttribute("rol");

    if (!"ADMIN".equals(rol)) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No autorizado");
    }

    tipoRepo.deleteById(id);
}
@PostMapping("/espacios")
public Espacio crearEspacio(@RequestBody Espacio espacio, HttpSession session) {

    String rol = (String) session.getAttribute("rol");

    if (!"ADMIN".equals(rol)) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No autorizado");
    }

    return espacioRepo.save(espacio);
}
@DeleteMapping("/espacios/{id}")
public void eliminarEspacio(@PathVariable Long id, HttpSession session) {

    String rol = (String) session.getAttribute("rol");

    if (!"ADMIN".equals(rol)) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No autorizado");
    }

    if (!espacioRepo.existsById(id)) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Espacio no existe");
    }

    espacioRepo.deleteById(id);
}
}
