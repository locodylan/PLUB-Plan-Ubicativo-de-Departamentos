// Mostrar / Ocultar contraseña con icono de ojo
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');

if (passwordInput && togglePassword && eyeIcon) {
    togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';

        passwordInput.type = isPassword ? 'text' : 'password';

        // Cambiar icono
        eyeIcon.classList.toggle('bi-eye', !isPassword);
        eyeIcon.classList.toggle('bi-eye-slash', isPassword);
    });
}

// Enviar con Enter
const form = document.getElementById('formLogin');

if (form) {
    form.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            form.submit();
        }
    });

    // Resaltar inputs al enfocar
    const inputs = form.querySelectorAll("input");
    inputs.forEach(input => {
        input.addEventListener("focus", () => {
            input.style.borderColor = "#007bff";
        });
        input.addEventListener("blur", () => {
            input.style.borderColor = "#ccc";
        });
    });
}
