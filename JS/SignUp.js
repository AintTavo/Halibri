document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');

    // Inicializar JustValidate
    const validation = new JustValidate('#signup-form', {
        errorFieldCssClass: 'is-invalid',
        successFieldCssClass: 'is-valid',
        errorLabelCssClass: 'text-danger', // Opcional: estilos para mensajes de error
    });

    // Reglas de validación para cada campo
    validation
        .addField('#nombre', [
            {
                rule: 'required',
                errorMessage: 'El nombre de usuario es obligatorio.',
            },
            {
                rule: 'maxLength',
                value: 50,
                errorMessage: 'El nombre de usuario no puede tener más de 50 caracteres.',
            },
            {
                rule: 'customRegexp',
                value: /^[a-zA-Z0-9_-]+$/,
                errorMessage: 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos.',
            },
        ])
        .addField('#email', [
            {
                rule: 'required',
                errorMessage: 'El correo electrónico es obligatorio.',
            },
            {
                rule: 'email',
                errorMessage: 'Por favor, ingresa un correo electrónico válido.',
            },
        ])
        .addField('#sexo', [
            {
                rule: 'required',
                errorMessage: 'Por favor, selecciona una opción.',
            },
        ])
        .addField('#password', [
            {
                rule: 'required',
                errorMessage: 'La contraseña es obligatoria.',
            },
            {
                rule: 'minLength',
                value: 6,
                errorMessage: 'La contraseña debe tener al menos 6 caracteres.',
            },
            {
                rule: 'customRegexp',
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/,
                errorMessage: 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.',
            },
        ])
        .onSuccess((event) => {
            event.preventDefault();  // evita el submit normal
            const nombre   = $('#nombre').val();
            const email    = $('#email').val();
            const sexo     = $('#sexo').val();
            const password = $('#password').val();

            $.ajax({
                url: '../PHP/signup.php',
                type: 'POST',
                dataType: 'json',
                data: { nombre, email, sexo, password },
                success: (response) => {
                if (response.status === 'success') {
                    Swal.fire('¡Éxito!', response.message, 'success')
                    .then(() => window.location.href = './Login.html');
                } else {
                    Swal.fire('¡Error!', response.message, 'error');
                }
                },
                error: (xhr, status, error) => {
                Swal.fire('¡Error!', 'Error en el servidor. Intenta más tarde.', 'error');
                console.error(xhr.responseText, error);
                }
            });
        })

        // 4) Si FALLA, puedes mostrar tu alerta
        .onFail((fields) => {
        Swal.fire('¡Error!', 'Corrige los errores antes de continuar.', 'error');
        });
    });


    // // Manejo del evento submit del formulario
    // form.addEventListener('submit', async (e) => {
    //     e.preventDefault(); // Detener el comportamiento predeterminado del formulario

    //     // Validar los campos antes de enviar
    //     const isValid = await validation.validate();

    //     if (isValid) {
    //         const nombre = document.getElementById('nombre').value;
    //         const email = document.getElementById('email').value;
    //         const sexo = document.getElementById('sexo').value;
    //         const password = document.getElementById('password').value;

    //         // Enviar los datos a través de AJAX
    //         $.ajax({
    //             url: '../PHP/signup.php', // Cambia la ruta si es necesario
    //             type: 'POST',
    //             dataType: 'json',
    //             data: {
    //                 nombre: nombre,
    //                 email: email,
    //                 sexo: sexo,
    //                 password: password,
    //             },
    //             success: (response) => {
    //                 if (response.status === 'success') {
    //                     Swal.fire({
    //                         title: '¡Éxito!',
    //                         text: response.message,
    //                         icon: 'success',
    //                         confirmButtonText: 'OK',
    //                     }).then(() => {
    //                         // Redirigir al usuario a la página de inicio de sesión
    //                         window.location.href = './Login.html';
    //                     });
    //                 } else {
    //                     Swal.fire({
    //                         title: '¡Error!',
    //                         text: response.message,
    //                         icon: 'error',
    //                         confirmButtonText: 'OK',
    //                     });
    //                 }
    //             },
    //             error: (xhr, status, error) => {
    //                 Swal.fire({
    //                     title: '¡Error!',
    //                     text: 'Ocurrió un error en el servidor. Inténtalo más tarde.',
    //                     icon: 'error',
    //                     confirmButtonText: 'OK',
    //                 });
    //                 console.error('Detalles del error:', xhr.responseText, error);
    //             },
    //         });
    //     } else {
    //         // Mostrar alerta de errores de validación
    //         Swal.fire({
    //             title: '¡Error!',
    //             text: 'Por favor, corrige los errores en el formulario antes de continuar.',
    //             icon: 'error',
    //             confirmButtonText: 'OK',
    //         });
    //     }
    // });
// });
