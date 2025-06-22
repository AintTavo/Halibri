//########################################## Obterner elemetos en la lista
function ObtenerElemtosEnLaLista(){
    const userData = localStorage.getItem('userData');
    if (!userData) {
        return Promise.reject("No se encontró información del usuario");
    }
    const tmpUserdata = JSON.parse(userData);

    return new Promise((resolve, reject) => {
        $.ajax({
            url: '../PHP/ObtLibroList.php',
            type: 'POST',
            data: {idUser: tmpUserdata.id},
            success: (response) => {
                try{
                    const result = JSON.parse(response);
                    if(result.success){
                        listBook = result.librosLista;
                        resolve(listBook);
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

    });
}


//############################################### Agregar libros a la lista #########################################################
function AgregarElementoALista(idLibro) {
    const userData = localStorage.getItem("userData");
    if (!userData) {
        return Promise.reject("No se encontró información del usuario");
    }
    const tmpUserdata = JSON.parse(userData);

    return new Promise((resolve, reject) => {
        $.ajax({
            url: '../PHP/insertIntoLista.php',
            type: 'POST',
            data: { idUser: tmpUserdata.id, idBook: idLibro },
            success: (response) => {
                try {
                    const result = JSON.parse(response);
                    if (result.success) {
                        console.log(result.message);
                    }
                } catch (e) {
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

//############################# Eliminar elementos de la lista ###############################
function EliminarElementosLista(IdLibro) {
    const userData = localStorage.getItem('userData');
    if (!userData) {
        return Promise.reject("No se encontró información del usuario");
    }
    if(!IdLibro) {
        return Promise.reject("No se encontro Id de libro");
    }
    const tmpUserdata = JSON.parse(userData);

    return new Promise((resolve, reject) => {
        $.ajax({
            url: '../PHP/RemElemList.php',
            type: 'POST',
            data: { idUser: tmpUserdata.id, idBook: IdLibro},
            success: (response) => {
                try {
                    const result = JSON.parse(response);
                    if (result.success) {
                        location.reload();
                    }
                    else {
                        reject(result.message || "Sin ultimo libro en la base de datos");
                    }
                }
                catch (e) {
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

function updateBookOrder(userId) {
    const bookItems = document.querySelectorAll('#lista .accordion-item');
    const orderData = Array.from(bookItems).map((item, index) => ({
        bookId: parseInt(item.getAttribute('data-book-id')),
        newOrder: index
    }));

    // Actualizar números de orden en la interfaz
    bookItems.forEach((item, index) => {
        const header = item.querySelector('.accordion-button');
        header.innerHTML = header.innerHTML.replace(/^\d+/, index + 1);
        item.setAttribute('data-order', index);
    });

    // Enviar al servidor
    $.ajax({
        url: '../PHP/UpdateBookOrder.php',
        type: 'POST',
        data: {
            userId: userId,
            orderData: JSON.stringify(orderData)
        },
        success: function(response) {
            console.log('Orden actualizado:', response);
        },
        error: function(xhr, status, error) {
            console.error('Error al actualizar el orden:', error);
        }
    });
}