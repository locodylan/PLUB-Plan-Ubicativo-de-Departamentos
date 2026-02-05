document.addEventListener("DOMContentLoaded", () => {

    const progresoContainer = document.getElementById("progresoContainer");
    const progresoTexto = document.getElementById("progresoTexto");
    const progresoBar = document.getElementById("progresoBar");
    const marker = document.getElementById("userMarker");
    const titulo = document.getElementById("tituloEspacio");
    const carousel = document.getElementById("carousel");
    const img = document.getElementById("carouselImg");
    const indicacion = document.getElementById("indicacion");
    const indicacionBox = document.getElementById("indicacion-box");
    const mensaje = document.getElementById("mensaje");

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    // ===== Leer datos guardados desde la página anterior =====
    const espacio = localStorage.getItem("espacioSeleccionado");   // ej: "BAÑOS" o "AULA 14C - 003"
    const codigoEspacio = localStorage.getItem("codigoEspacio");   // ej: "BAN-PB-01" o "14C-003"
    const plantaEspacio = localStorage.getItem("plantaEspacio");   // ej: "PLANTA BAJA", "PRIMER PISO", etc.
    const gpsBtn = document.getElementById("gpsPlayBtn");
    let gpsInterval = null;
    let gpsActivo = false;
    /* ===============================
   CONFIGURACIÓN DE NAVEGACIÓN
   =============================== */

    let autoplayActivo = false;
    let autoplayDelay = 4000; // ⏱️ 4 segundos entre pasos (ajústalo)
    let autoplayInterval = null;
    // ===== VOZ TIPO GPS =====
    let vozActiva = false;
    let utterance = null;
    function iniciarAutoplay() {
        if (autoplayActivo) return;

        autoplayActivo = true;
        autoplayInterval = setInterval(() => {
            if (indice < pasos.length - 1) {
                indice++;
                mostrarPaso();
            } else {
                detenerAutoplay();
            }
        }, autoplayDelay);
    }

    function detenerAutoplay() {
        autoplayActivo = false;
        clearInterval(autoplayInterval);
    }
    function hablar(texto) {
        if (!vozActiva) return;

        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            const mensaje = new SpeechSynthesisUtterance(texto);
            mensaje.lang = 'es-ES';
            mensaje.rate = 0.95; // natural tipo Google Maps
            speechSynthesis.speak(mensaje);
        }
    }

    function detenerVoz() {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
    }
    if (!espacio) {
        mensaje.textContent = "No se seleccionó ningún espacio.";
        return;
    }

    titulo.textContent = espacio;

    img.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            img.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    function actualizarProgreso() {
        const total = pasos.length;
        const pasoActual = indice + 1;
        progresoTexto.textContent = `Paso ${pasoActual} de ${total}`;
        progresoBar.style.width = `${(pasoActual / total) * 100}%`;
        progresoContainer.classList.remove("d-none");
    }

    function normalizar(nombre) {
        return nombre
            .trim()
            .toUpperCase()
            .replace(/\s*-\s*/g, "_")
            .replace(/\s+/g, "_");
    }

    /* ===============================
    # PASOS FIJOS POR AULA Y BAÑOS
    =============================== */
    const pasosPorAula = {

        // PLANTA BAJA
        "AULA_14C_001": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "1.0.jpg", texto: "Al llegar a las puertas, avance por el pasillo hasta el fondo.", coords: { x: 65, y: 70 } },
            { img: "1.1.jpg", texto: "Gire a la derecha hasta llegar final del pasillo, a mano derecha.", coords: { x: 78, y: 70 } },
            { img: "1.2.jpg", texto: "Has encontrado el aula 14C - 001.", coords: { x: 82, y: 68 } }
        ],

        "AULA_14C_002": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "2.0.jpg", texto: "Al llegar a las puertas, avance por el pasillo hasta el fondo.", coords: { x: 65, y: 70 } },
            { img: "2.1.jpg", texto: "Gire a la derecha, a mano derecha.", coords: { x: 78, y: 70 } },
            { img: "2.2.jpg", texto: "El aula 14C - 002 está frente a ti.", coords: { x: 84, y: 70 } }
        ],

        "AULA_14C_003": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "1.0.jpg", texto: "Avanza por el pasillo hasta el fondo.", coords: { x: 65, y: 70 } },
            { img: "1.1.jpg", texto: "Al llegar al fondo, gira a la derecha y a mano izquierda.", coords: { x: 78, y: 65 } },
            { img: "1.2.jpg", texto: "Has encontrado el aula 14C - 003.", coords: { x: 74, y: 63 } }
        ],

        "AULA_14C_004": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "2.0.jpg", texto: "Camina recto por el pasillo principal.", coords: { x: 65, y: 70 } },
            { img: "2.1.jpg", texto: "Gira a la izquierda al final del pasillo y a mano derecha.", coords: { x: 80, y: 70 } },
            { img: "2.2.jpg", texto: "El aula 14C - 004 está frente a ti.", coords: { x: 90, y: 70 } }
        ],

        "AULA_14C_005": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "3.0.jpg", texto: "Avanza por el pasillo hasta el fondo.", coords: { x: 65, y: 70 } },
            { img: "3.1.jpg", texto: "Al llegar al fondo, gira a la derecha.", coords: { x: 78, y: 70 } },
            { img: "3.2.jpg", texto: "en el fondo, al girar a la derecha.", coords: { x: 82, y: 68 } },
            { img: "3.3.jpg", texto: "Has encontrado el aula 14C - 005.", coords: { x: 85, y: 66 } }
        ],

        "AULA_14C_006": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "4.0.jpg", texto: "Avanza por el pasillo hasta el fondo.", coords: { x: 65, y: 70 } },
            { img: "4.1.jpg", texto: "Al llegar al fondo, gira a la izquierda.", coords: { x: 79, y: 70 } },
            { img: "4.2.jpg", texto: "en el fondo, al girar a la izquierda.", coords: { x: 79, y: 55 } },
            { img: "4.3.jpg", texto: "Has encontrado el aula 14C - 006.", coords: { x: 72, y: 55 } }
        ],
        "AULA_14C_007": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "5.0.jpg", texto: "Avanza por el pasillo hasta el fondo." },
            { img: "5.1.jpg", texto: "Al llegar al fondo, gira a la izquierda." },
            { img: "5.2.jpg", texto: "Has encontrado el aula 14C - 007." },
        ],
        "BAR": [
            { img: "bar1.jpg", texto: "En el pasillo central, gire a la izquierda.", coords: { x: 47, y: 80 } },
            { img: "bar2.jpg", texto: "Avance por el pasillo al fondo.", coords: { x: 37, y: 80 } },
            { img: "bar3.jpg", texto: "Al llegar al fondo, gira a la derecha.", coords: { x: 21, y: 80 } },
            { img: "bar4.jpg", texto: "Has encontrado el aula 14C - 007.", coords: { x: -2, y: 60 } },
        ],
        "FUEIIST_ASO_DE_ESTUDIANTES": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "7.0.jpg", texto: "Al llegar a las puertas, avance por el pasillo hasta el fondo." },
            { img: "7.1.jpg", texto: "Al llegar al fondo, gira a la derecha." },
            { img: "7.2.jpg", texto: "Vaya al fondo y gire a la izquierda." },
            { img: "7.3.jpg", texto: "Has encontrado la sala de FUEIIST ASO DE ESTUDIANTES." }
        ],
        "BAÑOS_PLANTA_BAJA": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "6.1.jpg", texto: "Al llegar a las puetas, avance hasta el fondo.", coords: { x: 70, y: 70 } },
            { img: "6.2.jpg", texto: "Al llegar al fondo encontrará los baños.", coords: { x: 90, y: 70 } }
        ],
        //PRIMER PISO
        "AULA_14C_101": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "18.0.jpg", texto: "Al llegar a las puertas, avance hasta el fondo, a mano izquierda.", coords: { x: 64, y: 33 } },
            { img: "18.2.jpg", texto: "Has encontrado el aula 14C - 101.", coords: { x: 87, y: 27 } }
        ],

        "AULA_14C_102": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "19.0.jpg", texto: "Suba las escaleras y gire a la izquierda, a mano izquierda." },
            { img: "19.2.jpg", texto: "Has encontrado el aula 14C - 102." }

        ],
        "AULA_14C_103": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "20.0.jpg", texto: "Al llegar a las puertas, avance hasta el fondo." },
            { img: "20.1.jpg", texto: "Al llegar al fondo, gire a la derecha, a mano derecha." },
            { img: "20.2.jpg", texto: "Has encontrado el aula 14C - 103." }

        ],
        "LAB_COMP_14C_101": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "21.0.jpg", texto: "Al llegar a las puertas, avance hasta el fondo a mano izquierda." },
            { img: "21.2.jpg", texto: "Has encontrado el LAB-COMP-14C-101." },
        ],

        "LAB_COMP_14C_102": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "21.0.jpg", texto: "Al llegar a las puertas, avance hasta el fondo a mano izquierda." },
            { img: "21.2.jpg", texto: "Has encontrado el LAB-COMP-14C-102." },
        ],

        "VINCULACION_Y_BIENESTAR_ESTUDIANTIL": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "vin1.jpg", texto: "Al llegar a las puertas, avance por el pasillo hasta el fondo." },
            { img: "vin2.jpg", texto: "Al llegar al fondo, gire a la derecha, a mano izquierda." },
            { img: "vin3.jpg", texto: "Has encontrado VINCULACION Y BIENESTAR ESTUDIANTIL." }
        ],
        "SECRETARIA": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "sec1.jpg", texto: "Al llegar a las puertas, avance hasta el fondo." },
            { img: "sec2.jpg", texto: "A medio pasillo, gira a la izquierda." },
            { img: "sec3.jpg", texto: "Has encontrado SECRETARIA." }
        ],
        "LSI_SALA_DE_PROFESORES": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "24.0.jpg", texto: "Al llegar a las puertas, avance hasta el fondo." },
            { img: "24.1.jpg", texto: "Al llegar al fondo, gira a la derecha." },
            { img: "24.2.jpg", texto: "Has encontrado LSI SALA DE PROFESORES." }
        ],
        "BAÑOS_PRIMER_PISO": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "ba1.jpg", texto: "Al llegar a las puertas, avance hasta el fondo.", coords: { x: 64, y: 33 } },
            { img: "ba2.jpg", texto: "Al llegar al fondo encontrará los baños.", coords: { x: 90, y: 33 } }
        ],

        //SEGUNDO PISO
        "AULA_14C_201": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "EscaleraP2.jpg", texto: "Al subir las escaleras, Avanza a la izquierda hasta llegar a las puertas.", coords: { x: 64, y: 20 } },
            { img: "10.0.jpg", texto: "Al llegar a las puertas, avance hasta al fondo.", coords: { x: 64, y: -10 } },
            { img: "pue1.jpg", texto: "Gire a la izquierda, a mano derecha.", coords: { x: 80, y: -10 } },
            { img: "10.2.jpg", texto: "Has encontrado AULA-14C-201.", coords: { x: 88, y: -12 } },
        ],
        "AULA_14C_202": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "EscaleraP2.jpg", texto: "Al subir las escaleras, Avanza a la izquierda hasta llegar a las puertas.", coords: { x: 64, y: 20 } },
            { img: "9.0.jpg", texto: "Al llegar a las puertas, avance hasta al fondo." },
            { img: "pue1.jpg", texto: "Gire a la izquierda, a mano izquierda." },
            { img: "9.2.jpg", texto: "Has encontrado AULA-14C-202." },
        ],
        "AULA_14C_203": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo." },
            { img: "pas2.jpg", texto: "Al llegar al fondo del pasillo central gire a la derecha." },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las escaleras." },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la derecha, de nuevo a las escaleras." },
            { img: "EscaleraP2.jpg", texto: "Al subir las escaleras, Avanza a la izquierda hasta llegar a las puertas." },
            { img: "13.0.jpg", texto: "Al llegar a las puertas, avance hasta al fondo." },
            { img: "pue1.jpg", texto: "Gire a la izquierda y avance al fondo, a mano derecha." },
            { img: "13.2.jpg", texto: "Has encontrado AULA-14C-203." },
        ],
        "AULA_14C_204": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "EscaleraP2.jpg", texto: "Al subir las escaleras, Avanza a la izquierda hasta llegar a las puertas.", coords: { x: 64, y: 20 } },
            { img: "14.0.jpg", texto: "Al llegar a las puertas, avance hasta al fondo." },
            { img: "pue1.jpg", texto: "Gire a la izquierda y avance al fondo, a mano izquierda." },
            { img: "14.2.jpg", texto: "Has encontrado AULA-14C-204." },
        ],
        "LAB_COMP_14C_201": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "EscaleraP2.jpg", texto: "Al subir las escaleras, Avanza a la izquierda hasta llegar a las puertas.", coords: { x: 64, y: 20 } },
            { img: "11.0.jpg", texto: "Al llegar a las puertas, avance hasta al fondo." },
            { img: "pue2.jpg", texto: "Gire a la izquierda hasta llegar final del pasillo, a mano derecha." },
            { img: "11.2.jpg", texto: "Has encontrado LAB-COMP-14C-201." },
        ],
        "LAB_COMP_14C_202": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "EscaleraP2.jpg", texto: "Al subir las escaleras, Avanza a la izquierda hasta llegar a las puertas.", coords: { x: 64, y: 20 } },
            { img: "12.0.jpg", texto: "Al llegar a las puertas, avance hasta al fondo." },
            { img: "pue2.jpg", texto: "Gire a la izquierda hasta llegar final del pasillo, a mano izquierda." },
            { img: "12.2.jpg", texto: "Has encontrado LAB-COMP-14C-202." },
        ],
        "LAB_COMP_14C_203": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "EscaleraP2.jpg", texto: "Al subir las escaleras, Avanza a la izquierda hasta llegar a las puertas.", coords: { x: 64, y: 20 } },
            { img: "15.0.jpg", texto: "Al llegar a las puertas, avance hasta al fondo." },
            { img: "pue2.jpg", texto: "Gire a la izquierda, a mano izquierda." },
            { img: "15.2.jpg", texto: "Has encontrado LAB-COMP-14C-203." },
        ],
        "LAB_COMP_14C_204": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "EscaleraP2.jpg", texto: "Al subir las escaleras, Avanza a la izquierda hasta llegar a las puertas.", coords: { x: 64, y: 20 } },
            { img: "16.0.jpg", texto: "Al llegar a las puertas, avance hasta al fondo." },
            { img: "pue2.jpg", texto: "Gire a la izquierda, a mano izquierda." },
            { img: "16.2.jpg", texto: "Has encontrado LAB-COMP-14C-204." },
        ],
        "BAÑOS_SEGUNDO_PISO": [
            { img: "pas1.jpg", texto: "Avanza por el pasillo central hasta al fondo.", coords: { x: 47, y: 80 } },
            { img: "pas2.jpg", texto: "Al llegar al fondo, del pasillo central gire a la derecha.", coords: { x: 47, y: 70 } },
            { img: "pas3.jpg", texto: "Avance hasta llegar a las puertas", coords: { x: 57, y: 70 } },
            { img: "EscaleraP1.jpg", texto: "Suba las escaleras y gire a la izquierda, hacia las puertas.", coords: { x: 64, y: 55 } },
            { img: "EscaleraP2.jpg", texto: "Al subir las escaleras, Avanza a la izquierda hasta llegar a las puertas.", coords: { x: 64, y: 20 } },
            { img: "ba1.jpg", texto: "Al llegar a las puertas, avance hasta el fondo.", coords: { x: 70, y: -10 } },
            { img: "ba2.jpg", texto: "Al llegar al fondo encontrará los baños.", coords: { x: 90, y: -10 } }
        ],

    };

    // ===== Determinar clave de pasos y carpeta =====
    let clavePasos = normalizar(espacio);
    let carpetaBase = normalizar(espacio);

    // Si es un baño, usar el piso para seleccionar pasos
    if (codigoEspacio && codigoEspacio.startsWith("BAN")) {  // es un baño
        if (plantaEspacio === "PLANTA BAJA") {
            clavePasos = "BAÑOS_PLANTA_BAJA";
            carpetaBase = "BAÑOS_PLANTA_BAJA";
        } else if (plantaEspacio === "PRIMER PISO") {
            clavePasos = "BAÑOS_PRIMER_PISO";
            carpetaBase = "BAÑOS_PRIMER_PISO";
        } else if (plantaEspacio === "SEGUNDO PISO") {
            clavePasos = "BAÑOS_SEGUNDO_PISO";
            carpetaBase = "BAÑOS_SEGUNDO_PISO";
        }
    }

    const base = `/image/espacios/${carpetaBase}/`;
    const pasos = pasosPorAula[clavePasos];

    if (!pasos) {
        mensaje.textContent = `No hay indicaciones configuradas para este espacio: ${clavePasos}`;
        console.log("Claves disponibles:", Object.keys(pasosPorAula));
        return;
    }

    let indice = 0;
    let direccion = "next"; // controla el sentido
    if (indice === pasos.length - 1) {
        img.classList.add("route-end");
    }

    function mostrarPaso() {
        // limpiar animaciones anteriores
        img.classList.remove("route-next", "route-prev");

        // forzar reflow para reiniciar animación
        void img.offsetWidth;

        // asignar animación según dirección
        img.classList.add(direccion === "next" ? "route-next" : "route-prev");

        img.style.backgroundImage = `url('${base}${pasos[indice].img}')`;

        // animación del texto
        indicacionBox.classList.add("indicacion-enter");
        indicacion.textContent = pasos[indice].texto;
        // Mover el "muñequito"
        const pasoActual = pasos[indice];
        if (pasoActual.coords) {
            marker.style.left = `${pasoActual.coords.x}%`;
            marker.style.top = `${pasoActual.coords.y}%`;

            // Animación de rebote al llegar al punto
            marker.animate([
                { transform: 'scale(1) translateY(0)' },
                { transform: 'scale(1.2) translateY(-5px)' },
                { transform: 'scale(1) translateY(0)' }
            ], { duration: 500 });
        }
        setTimeout(() => {
            indicacionBox.classList.remove("indicacion-enter");
        }, 120);

        carousel.classList.remove("d-none");
        indicacionBox.classList.remove("d-none");

        prevBtn.disabled = indice === 0;
        nextBtn.disabled = indice === pasos.length - 1;
        crearMiniMapa();
        // 🔊 VOZ GPS
        hablar(pasos[indice].texto);
    }
    nextBtn.addEventListener("click", () => {
        detenerAutoplay();
        detenerVoz();
        if (indice < pasos.length - 1) {
            direccion = "next";
            indice++;
            mostrarPaso();
        }
    });

    prevBtn.addEventListener("click", () => {
        detenerAutoplay();
        detenerVoz();
        if (indice > 0) {
            direccion = "prev";
            indice--;
            mostrarPaso();
        }
    });

    const dotsContainer = document.getElementById("carouselDots");

    function crearDots() {
        dotsContainer.innerHTML = "";

        pasos.forEach((_, i) => {
            const dot = document.createElement("span");
            dot.classList.add("dot");

            if (i === indice) dot.classList.add("active");

            dot.addEventListener("click", () => {
                indice = i;
                mostrarPaso();
            });

            dotsContainer.appendChild(dot);
        });
    }

    const miniMap = document.getElementById("miniMap");

    function crearMiniMapa() {
        miniMap.innerHTML = "";

        pasos.forEach((_, i) => {
            const step = document.createElement("div");
            step.classList.add("mini-step");

            if (i < indice) step.classList.add("done");
            if (i === indice) step.classList.add("active");

            miniMap.appendChild(step);
        });
    }
    detenerVoz(); // 🔇 asegura silencio al cargar
    mostrarPaso();

    gpsBtn.addEventListener("click", () => {
        gpsActivo = !gpsActivo;

        gpsBtn.innerHTML = gpsActivo
            ? '<i class="bi bi-pause-fill"></i>'
            : '<i class="bi bi-play-fill"></i>';

        if (gpsActivo) {
            gpsInterval = setInterval(() => {
                if (indice < pasos.length - 1) {
                    direccion = "next";
                    indice++;
                    mostrarPaso();
                } else {
                    detenerGPS();
                }
            }, 2500); // ⏱️ velocidad GPS
        } else {
            detenerGPS();
        }
    });

    function detenerGPS() {
        clearInterval(gpsInterval);
        gpsActivo = false;
        gpsBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
        hablar("");
    }
    const vozBtn = document.getElementById("vozBtn");

    vozBtn.addEventListener("click", () => {
        vozActiva = !vozActiva;

        vozBtn.innerHTML = vozActiva
            ? '<i class="bi bi-volume-up-fill"></i>'
            : '<i class="bi bi-volume-mute-fill"></i>';

        if (!vozActiva) detenerVoz();
    });
});
