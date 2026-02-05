package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class VistaController {

    @GetMapping("/espacio")
    public String espacio() {
        return "espacio"; // espacio.html
    }
}