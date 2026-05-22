document.addEventListener("DOMContentLoaded", () => {

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const btnLogin = document.getElementById("btnLogin");
    const loader = document.getElementById("loader");

    //Mostrar / ocultar contraseña
    const toggle = document.getElementById("togglePassword");
    if (toggle) {
        toggle.addEventListener("click", () => {
            passwordInput.type =
                passwordInput.type === "password" ? "text" : "password";
        });
    }

    //LOGIN
    async function login() {

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        //VALIDACIÓN
        if (!email || !password) {
            alert("Completa todos los campos");
            return;
        }

        try {
            loader.classList.remove("hidden");

            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            loader.classList.add("hidden");

            if (!res.ok) {
                alert(data.message);
                return;
            }

            //guardar sesión
            localStorage.setItem("token", data.token);
            localStorage.setItem("rol", data.rol);

            //REDIRECCIÓN
            if (data.rol === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "index.html";
            }

        } catch (error) {
            loader.classList.add("hidden");
            console.error("Error:", error);
            alert("Error de conexión");
        }
    }

    //BOTÓN LOGIN
    if (btnLogin) {
        btnLogin.addEventListener("click", login);
    }

    //ENTER PARA LOGIN
    document.addEventListener("keypress", e => {
        if (e.key === "Enter") login();
    });

});