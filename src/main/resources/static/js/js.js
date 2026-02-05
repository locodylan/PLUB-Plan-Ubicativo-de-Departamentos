document.addEventListener("DOMContentLoaded", async () => {
    const carreraSelect = document.getElementById("carreraSelect");
    const tipoSelect = document.getElementById("tipoSelect");
    const espacioSelect = document.getElementById("espacioSelect");
    const btnConsultar = document.getElementById("btnConsultarEspacio");
    const modalAgregar = new bootstrap.Modal(
        document.getElementById("modalAgregarEspacio")
    );


    const planoPreview = document.getElementById("planoPreview");
    const plantaTexto = document.getElementById("plantaTexto");
    const planoImagen = document.getElementById("planoImagen");
    const marker = document.getElementById("marker");
    const modalEliminar = new bootstrap.Modal(document.getElementById("modalEliminar"));

    const btnEliminar = document.getElementById("btnEliminar");

    if (btnEliminar) {
        btnEliminar.addEventListener("click", (e) => {
            e.preventDefault();

            if (!carreraSelect.value || !tipoSelect.value || !espacioSelect.value) {
                mostrarAlerta("Seleccione carrera, tipo y espacio", "warning");
                return;
            }

            document.getElementById("espacioEliminarTexto").textContent =
                espacioSelect.selectedOptions[0].text;

            modalEliminar.show();
        });
    }

    document.getElementById("confirmarEliminar").addEventListener("click", async () => {
        try {
            await fetch(`/api/espacios/${espacioSelect.value}`, {
                method: "DELETE"
            });

            mostrarAlerta("Espacio eliminado correctamente", "success");
            modalEliminar.hide();
            cargarEspacios();

        } catch {
            mostrarAlerta("Error al eliminar el espacio", "danger");
        }
    });

    // ===== Limpiar selección si es recarga manual (F5 o botón del navegador) =====
    window.addEventListener("pageshow", (event) => {
        if (!event.persisted) {
            // Borrar localStorage para que la página se “reinicie”
            localStorage.removeItem("carreraSeleccionada");
            localStorage.removeItem("tipoSeleccionado");
            localStorage.removeItem("espacioSeleccionado");
            // Limpiar selects y plano
            carreraSelect.value = "";
            tipoSelect.innerHTML = `<option value="">Seleccione tipo</option>`;
            tipoSelect.disabled = true;
            espacioSelect.innerHTML = `<option value="">Seleccione espacio</option>`;
            espacioSelect.disabled = true;
            btnConsultar.disabled = true;
            planoPreview.classList.add("d-none");
            marker.classList.add("d-none");
        }
    });

    // ===== Helper para obtener planta =====
    function obtenerPlanta(codigo) {
        // Revisamos si es aula normal (termina en 003, 004, 101, etc.)
        const match = codigo.match(/\d{3}$/);
        if (match) {
            const n = parseInt(match[0]);
            if (n < 100) return { nombre: "PLANTA BAJA", img: "planta_baja.png" };
            if (n < 200) return { nombre: "PRIMER PISO", img: "primer_piso.png" };
            if (n < 300) return { nombre: "SEGUNDO PISO", img: "segundo_piso.png" };
        }

        // Espacios especiales (baños, oficinas, auditorio, etc.)
        const codigosEspeciales = {
            "BAN-PB-01": "PLANTA BAJA",
            "AUD-PB-01": "PLANTA BAJA",
            "BAN-P1-01": "PRIMER PISO",
            "OFI-SEC-01": "PRIMER PISO",
            "OFI-LSI-01": "PRIMER PISO",
            "AUD-P1-01": "PRIMER PISO",
            "BAN-P2-01": "SEGUNDO PISO"

        };

        if (codigosEspeciales[codigo]) {
            const piso = codigosEspeciales[codigo];
            return {
                nombre: piso,
                img: piso.includes("BAJA") ? "planta_baja.png" :
                    piso.includes("PRIMER") ? "primer_piso.png" :
                        "segundo_piso.png"
            };
        }

        return null; // si no coincide
    }


    const ubicaciones = {
        // PLANTA BAJA
        "AULA 14C - 002": { x: 767, y: 235 },
        "AULA 14C - 001": { x: 767, y: 280 },
        "AULA 14C - 003": { x: 930, y: 228 },
        "AULA 14C - 004": { x: 930, y: 165 },
        "AULA 14C - 005": { x: 930, y: 100 },
        "AULA 14C - 006": { x: 767, y: 100 },
        "AULA 14C - 007": { x: 767, y: 165 },
        "AULA 14C - 008": { x: 767, y: 165 },
        "FUEIIST ASO DE ESTUDIANTES": { x: 930, y: 280 },
        "BAÑOS PLANTA BAJA": { x: 930, y: 200 },
        "BAR": { x: 50, y: 70 },

        // PRIMER PISO
        "AULA 14C - 101": { x: 930, y: 171 },
        "AULA 14C - 102": { x: 767, y: 171 },
        "AULA 14C - 103": { x: 767, y: 242 },
        "LAB COMP 14C - 101": { x: 930, y: 100 },
        "LAB COMP 14C - 102": { x: 767, y: 100 },
        "LSI - SALA DE PROFESORES": { x: 767, y: 280 },
        "SECRETARIA": { x: 930, y: 241 },
        "VINCULACION Y BIENESTAR ESTUDIANTIL": { x: 930, y: 280 },
        "BAÑOS PRIMER PISO": { x: 930, y: 208 },
        "BIBLIOTECA": { x: 260, y: 280 },

        //SEGUNDO PISO
        "AULA 14C - 201": { x: 930, y: 182 },
        "AULA 14C - 202": { x: 767, y: 182 },
        "AULA 14C - 203": { x: 930, y: 123 },
        "AULA 14C - 204": { x: 767, y: 123 },
        "LAB COMP 14C - 201": { x: 767, y: 297 },
        "LAB COMP 14C - 202": { x: 930, y: 297 },
        "LAB COMP 14C - 203": { x: 930, y: 250 },
        "LAB COMP 14C - 204": { x: 767, y: 250 },
        "BAÑOS SEGUNDO PISO": { x: 925, y: 211 },
    };

    // ===== Cargar carreras =====
    const carreras = await fetch("/api/carreras").then(res => res.json());
    carreraSelect.innerHTML = `<option value="">Seleccione carrera</option>`;
    carreras.forEach(c => {
        carreraSelect.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
    });

    // ===== Función para cargar tipos de espacio =====
    async function cargarTipos() {
        tipoSelect.innerHTML = `<option value="">Seleccione tipo</option>`;
        tipoSelect.disabled = true;
        espacioSelect.innerHTML = `<option value="">Seleccione espacio</option>`;
        espacioSelect.disabled = true;
        btnConsultar.disabled = true;
        planoPreview.classList.add("d-none");

        if (!carreraSelect.value) return;

        const tipos = await fetch("/api/tipos-espacio").then(res => res.json());
        tipos.forEach(t => {
            tipoSelect.innerHTML += `<option value="${t.id}">${t.nombre}</option>`;
        });
        tipoSelect.disabled = false;
    }

    // ===== Función para cargar espacios =====
    async function cargarEspacios() {
        espacioSelect.innerHTML = `<option value="">Seleccione espacio</option>`;
        espacioSelect.disabled = true;
        btnConsultar.disabled = true;
        planoPreview.classList.add("d-none");

        if (!tipoSelect.value) return;

        const espacios = await fetch(`/api/espacios?carreraId=${carreraSelect.value}&tipoId=${tipoSelect.value}`)
            .then(res => res.json());

        espacios.forEach(e => {
            espacioSelect.innerHTML += `<option value="${e.id}" data-codigo="${e.codigo}">
    ${e.nombre}
</option>`;
        });
        espacioSelect.disabled = false;
    }

    // ===== Listeners =====
    carreraSelect.addEventListener("change", cargarTipos);
    tipoSelect.addEventListener("change", cargarEspacios);

    espacioSelect.addEventListener("change", () => {
        const opcion = espacioSelect.selectedOptions[0];
        const texto = opcion.text;   // Nombre del espacio
        const codigo = opcion.dataset.codigo; // Código único
        const planta = obtenerPlanta(codigo);

        if (!planta) {
            marker.classList.add("d-none");
            planoPreview.classList.add("d-none");
            return;
        }

        planoImagen.src = `/image/${planta.img}`;
        plantaTexto.textContent = `📍 ${texto} – ${planta.nombre}`;
        planoPreview.classList.remove("d-none");

        const u = ubicaciones[texto];
        if (u) {
            marker.style.left = u.x + "px";
            marker.style.top = u.y + "px";
            marker.setAttribute("data-text", texto);
            marker.classList.remove("d-none");
        } else {
            marker.classList.add("d-none");
        }

        btnConsultar.disabled = false;
    });


    btnConsultar.addEventListener("click", () => {
        localStorage.setItem("carreraSeleccionada", carreraSelect.value);
        localStorage.setItem("tipoSeleccionado", tipoSelect.value);
        const opcion = espacioSelect.selectedOptions[0];

        localStorage.setItem("espacioSeleccionado", opcion.text);        // "AULA 14C - 201"
        localStorage.setItem("codigoEspacio", opcion.dataset.codigo);    // "14C-201"
        window.location.href = "/espacio";
    });


    // ===== Restaurar selección si existe y no es recarga F5 =====
    const carreraGuardada = localStorage.getItem("carreraSeleccionada");
    const tipoGuardado = localStorage.getItem("tipoSeleccionado");
    const espacioGuardado = localStorage.getItem("espacioSeleccionado");

    if (carreraGuardada) {
        carreraSelect.value = carreraGuardada;
        await cargarTipos();
        if (tipoGuardado) tipoSelect.value = tipoGuardado;
        await cargarEspacios();
        if (espacioGuardado) {
            espacioSelect.value = espacioGuardado;
            espacioSelect.dispatchEvent(new Event('change'));
        }
    }

    // ===== Mostrar coordenadas al hacer clic en la imagen =====
    planoImagen.addEventListener("click", (e) => {
        const rect = planoImagen.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        console.log(`x: ${x}, y: ${y}`);
    });
    try {
        const resRol = await fetch("/rol");

        if (resRol.ok) {
            const rol = await resRol.json();

            if (rol.rol === "ADMIN") {
                document.getElementById("btnAgregar").classList.remove("d-none");
                document.getElementById("btnEliminar").classList.remove("d-none");
            }
        }
    } catch (e) {
        // Usuario NO ADMIN → no hacemos nada
    }
    const btnAgregar = document.getElementById("btnAgregar");
    if (btnAgregar) {
        btnAgregar.addEventListener("click", () => {
            if (!carreraSelect.value || !tipoSelect.value) {
                mostrarAlerta("Seleccione primero carrera y tipo de espacio", "warning");
                return;
            }
            modalAgregar.show();
        });
    }
    document.getElementById("btnGuardarEspacio").addEventListener("click", async () => {

        const data = {
            codigo: document.getElementById("nuevoCodigo").value,
            nombre: document.getElementById("nuevoNombre").value,
            piso: document.getElementById("nuevoPiso").value,
            responsable: null,
            carrera: { id: carreraSelect.value },
            tipoEspacio: { id: tipoSelect.value }
        };

        const res = await fetch("/api/espacios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            alert("Error al guardar");
            return;
        }

        modalAgregar.hide();
        await cargarEspacios(); // 🔄 refresca lista
    });

    function mostrarAlerta(mensaje, tipo = "success") {
        const alertas = document.getElementById("alertas");

        const div = document.createElement("div");
        div.className = `alert alert-${tipo} alert-dismissible fade show shadow`;
        div.innerHTML = `
        <strong>${tipo === "danger" ? "Error" : "Mensaje"}:</strong> ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

        alertas.appendChild(div);

        setTimeout(() => {
            div.classList.remove("show");
            div.remove();
        }, 4000);
    }
});
