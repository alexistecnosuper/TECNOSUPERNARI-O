document.getElementById("btnRegister")
    .addEventListener("click", async () => {

        const nombre =
            document.getElementById("nombre").value;

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        try {

            const res = await fetch(
                "http://localhost:3000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        nombre,
                        email,
                        password
                    })
                }
            );

            const data = await res.json();

            alert(data.message);

            if (res.ok) {
                window.location.href = "login.html";
            }

        } catch (error) {

            console.error(error);
        }
    });