function markBooks(idLibro){
    const userData = localStorage.getItem("userData");
    if (!userData) {
        return Promise.reject("No se encontró información del usuario");
    }
    const tmpUserdata = JSON.parse(userData);

    return new Promise((resolve, reject) => {
        $.ajax({
            url: '../PHP/insertIntoLista.php',
            type: 'POST',
            data: {idUser: tmpUserdata.id, idBook: idLibro},
            success: (response) => {
                try{
                    const result = JSON.parse(response);
                    if(result.success) {
                        console.log(result.message);
                        Swal.fire({
                            title: 'Añadido a lista',
                            text: 'Libro agregado correctamente a la lista',
                            icon: 'success', // Tipo de alerta: success, error, warning, info, question
                            confirmButtonText: 'Continuar',
                            confirmButtonColor: '#3085d6',
                        });
                    }
                } catch (e){
                    console.error("Error parsing JSON: ", response);
                    reject("Respuesta no valida del servidor");
                }
            },
            error: (xhr, status, error) => {
                console.error("AJAX Error:", error, xhr.responseText);
                reject("Error en la solicitud AJAX: " + xhr.responseText);
            }
        })
    })
}