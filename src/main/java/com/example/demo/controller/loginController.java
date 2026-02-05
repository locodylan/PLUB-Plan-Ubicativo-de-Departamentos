package com.example.demo.controller;

import java.util.Collections;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.entity.UsuarioData;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Controller
public class loginController {

    private static final Map<String, UsuarioData> USUARIOS = Map.of(
            "0956036842", new UsuarioData("0956036842", "DYLAN DANIEL LARROSA BUSTAMANTE", "ADMIN"),
            "0932565658", new UsuarioData("0932565658", "ALFREDO VICENTE CERVANTES LIRIO", "ADMIN"),
            "0956897037", new UsuarioData("HectorPw26", "HÉCTOR GEAMPOOL VERA PIBAQUE", "USER"),
            "2026000000", new UsuarioData("Admin", "PROFESORES DE LA UNIVERSIDAD DE GUAYAQUIL", "ADMIN"),
            "1234567890", new UsuarioData("Estudiante", "ESTUDIANTES DE LA UNIVERSIDAD DE GUAYAQUIL", "USER"),
            "0954498838", new UsuarioData("0954498838", "DAYANA ROCIO BALDA PINCAY", "USER"),
            "0958254666", new UsuarioData("0958254666", "ROY ALEJANDRO ORTIZ ZUÑIGA", "ADMIN"));

    // Mostrar login
    @GetMapping({ "/", "/login" })
    public String mostrarLogin(HttpSession session, HttpServletResponse response) {

        // Evitar cache al retroceder
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);

        if (session.getAttribute("usuario") != null) {
            return "redirect:/inicio";
        }
        return "login";
    }

    // Procesar login
    @PostMapping("/login")
    public String procesarLogin(@RequestParam String usuario,
            @RequestParam String password,
            Model model,
            HttpSession session) {

        // validar cédula
        if (!usuario.matches("\\d{10}")) {
            model.addAttribute("error", "La cédula debe tener 10 dígitos");
            return "login";
        }

        if (USUARIOS.containsKey(usuario)) {
            UsuarioData data = USUARIOS.get(usuario);

            if (data.getPassword().equals(password)) {
                session.setAttribute("usuario", usuario);
                session.setAttribute("nombre", data.getNombre());
                session.setAttribute("rol", data.getRol()); // 👈 CLAVE
                return "redirect:/inicio";
            }
        }

        model.addAttribute("error", "Estimado(a) usuario, sus credenciales son incorrectas");
        return "login";
    }

    // Cerrar sesión
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }

    // Verificar sesión (AJAX)
    @GetMapping("/check-session")
    @ResponseBody
    public Map<String, Boolean> checkSession(HttpSession session) {
        boolean loggedIn = session.getAttribute("usuario") != null;
        return Collections.singletonMap("loggedIn", loggedIn);
    }
    
}
