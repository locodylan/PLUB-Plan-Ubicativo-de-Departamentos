package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpSession;

@Controller
public class mainController {

    @GetMapping("/inicio")
    public String mostrarIndex(HttpSession session) {
        if (session.getAttribute("usuario") == null) {
            return "redirect:/login"; // si no hay sesión, manda al login
        }
        return "index"; // templates/index.html
    }
}