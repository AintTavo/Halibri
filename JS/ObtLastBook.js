function obtLibroUnico(IdBook){
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '../PHP/ObtLastBook.php',
            type: 'POST',
            data: {idBook: IdBook},
            success: (response) => {
                try{
                    const result =JSON.parse(response);
                    if(result.success) {
                        lastBook = result.lastBook;
                        resolve(lastBook);
                    }
                    else{
                        reject(result.message || "Sin ultimo libro en la base de datos");
                    }
                }
                catch (e){
                    console.error("Error parsing JSON:", response);
                    reject("Respuesta no válida del servidor");
                }
            },
            error: (xhr, status, error) => {
                console.error("AJAX Error:", error, xhr.responseText);
                reject("Error en la solicitud AJAX: " + xhr.responseText);
            }
        });
    })
}