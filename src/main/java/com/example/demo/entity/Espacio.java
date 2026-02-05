package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "espacio")
public class Espacio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String codigo;

    private String nombre;
    private String piso;
    private String responsable;

    @ManyToOne
    @JoinColumn(name = "carrera_id", nullable = false)
    private Carrera carrera;

    @ManyToOne
    @JoinColumn(name = "tipo_espacio_id", nullable = false)
    private TipoEspacio tipoEspacio;

    public Espacio() {}

    public Long getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public String getPiso() {
        return piso;
    }

    public String getResponsable() {
        return responsable;
    }

    public Carrera getCarrera() {
        return carrera;
    }

    public TipoEspacio getTipoEspacio() {
        return tipoEspacio;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setPiso(String piso) {
        this.piso = piso;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public void setCarrera(Carrera carrera) {
        this.carrera = carrera;
    }

    public void setTipoEspacio(TipoEspacio tipoEspacio) {
        this.tipoEspacio = tipoEspacio;
    }
}
