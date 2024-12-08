function obtenerLibrosRecomendados() {
    const userData = localStorage.getItem("userData");
    if (!userData) {
        return Promise.reject("No se encontró información del usuario");
    }
    const tmpUserdata = JSON.parse(userData);

    return new Promise((resolve, reject) => {
        $.ajax({
            url: '../PHP/ObtLibroReco.php',
            type: 'POST',
            data: { id: tmpUserdata.id },
            success: (response) => {
                try {
                    const result = JSON.parse(response);
                    if (result.success) {
                        librosRec = result.libros;
                        console.log(librosRec);
                        resolve(librosRec);
                    } else {
                        reject(result.message || "Sin libros en la base de datos");
                    }
                } catch (e) {
                    console.error("Error parsing JSON:", response);
                    reject("Respuesta no válida del servidor");
                }
            },
            error: (xhr, status, error) => {
                console.error("AJAX Error:", error, xhr.responseText);
                reject("Error en la solicitud AJAX: " + xhr.responseText);
            }
        });
    });
}
