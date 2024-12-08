function goToLeer(idBook){
    const userData = localStorage.getItem("userData");
    if (!userData) {
        return Promise.reject("No se encontró información del usuario");
    }
    const tmpUserdata = JSON.parse(userData);

    return new Promise((resolve, reject) =>{
        $.ajax({
            url: '../PHP/updateLBook.php',
            type: 'POST',
            data: { idUser: tmpUserdata.id, idBook: idBook},
            success: (response) => {
                try {
                    const result = JSON.parse(response);
                    if (result.success) {
                        console.log(result.message);
                        var UserData = JSON.stringify(result.user);
                        localStorage.setItem("userData", UserData);
                        //window.location.href = "../HTML/Lectura.html"
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