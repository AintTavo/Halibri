var libros = [];

function obtenerLibros() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '../PHP/ObtLibro.php',
            type: 'POST',
            success: function (response) {
                const result = JSON.parse(response);
                if (result.success) {
                    libros = result.libros;
                    resolve(libros);  // Resolvemos la promesa con los libros
                } else {
                    reject("Error en la respuesta del servidor");
                }
            },
            error: function () {
                reject("Error en la solicitud AJAX");
            }
        });
    });
}
