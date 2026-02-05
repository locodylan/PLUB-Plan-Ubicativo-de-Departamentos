package com.example.demo.entity;

public class UsuarioData {
    private String password;
    private String nombre;
    private String rol; // ADMIN o USER

    public UsuarioData(String password, String nombre, String rol) {
        this.password = password;
        this.nombre = nombre;
        this.rol = rol;
    }

    public String getPassword() { return password; }
    public String getNombre() { return nombre; }
    public String getRol() { return rol; }
}