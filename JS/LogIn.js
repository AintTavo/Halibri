// AJAX para enviar los datos
$('#loginForm').on('submit', function (e) {
    e.preventDefault(); // Evita que se recargue la página

    const username = $('#username').val();
    const password = $('#password').val();

    // Validar si los campos están vacíos antes de enviar la petición
    if (username === '' || password === '') {
        Swal.fire({
            icon: 'error',
            title: 'Campos vacíos',
            text: 'Por favor, completa todos los campos.',
        });
        return;
    }

    // Enviar datos a PHP usando AJAX
    $.ajax({
        url: '../PHP/LogIn.php',
        type: 'POST',
        data: {
            username: username,
            password: password
        },
        success: function (response) {
            const result = JSON.parse(response);
            if (result.success) {
                // Guardar los datos del usuario en localStorage
                localStorage.setItem('SesionIniciada','true');
                localStorage.setItem('userData', JSON.stringify(result.user));
                Swal.fire({
                    icon: 'success',
                    title: 'Bienvenido',
                    text: 'Iniciaste sesión correctamente',
                }).then(() => {
                    window.location.href = '../index.html'; // Redirigir al inicio
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message,
                });
            }
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema con la conexión.',
            });
        }
    });
});
