$(document).ready(() => {
    const UserData = JSON.parse(localStorage.getItem('userData'));
    $("title").text(`${UserData.name} | Resultado de busqueda con ${sessionStorage.getItem("searchQuery")}`);
    $("span#NameUsuario").text(UserData.name);

    $("#SearchName").text(sessionStorage.getItem('searchQuery'));
    Search().then((SearchResult)=>{
        if(SearchResult.length === 0){
            $("#auxSearchEQ0").html(`
                <h3 class="py-10 text-center">No se encontro nada que se parezca a ${sessionStorage.getItem("searchQuery") }</h3>
                <h5 class="py-4 text-center">Tal vez te puedan interesar nuestras recomendaciones</h5>
                <a href="../HTML/Recomendaciones.html" class="btn btn-primary w-100">Recomendaciones</a>
            `);
        }
        let i = 0;
        let j = 0;
        let k = 0;
        let cardHTML = "";
        let tmpCardHTML = "";
        
        listBadges = ``;
        
        while (i < SearchResult.length) {
            let listBadges = ""; // Reiniciar listBadges en cada iteración
            k = 0;

            // Construcción de las etiquetas de géneros
            while (k < SearchResult[i].generos.length) {
                listBadges += `<li id="${SearchResult[i].id + k}k" class="badge bg-primary text-white">${SearchResult[i].generos[k]}</li>`;
                k++;
            }

            // Crear HTML de la tarjeta
            tmpCardHTML = `
        <div class="col-sm-12 col-md-6 col-lg-4 d-flex justify-content-center py-2">
            <div class="card" style="width:90%;">
                <div class="portada card-img-top"
                    style="
                        background-image: url('${SearchResult[i].rutaPortada}');
                        background-size: cover;
                        background-position: center;
                        height: 30vh;
                    "
                    aria-label="Portada de ${SearchResult[i].titulo}">
                </div>
                <div class="card-header">
                    <b>${SearchResult[i].titulo}</b>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Autor: ${SearchResult[i].autor}</li>
                    <li class="list-group-item">
                        <ul class="text-center">
                            ${listBadges}
                        </ul>
                    </li>
                    <li class="list-group-item">
                        <a id="IrALectura" value="${SearchResult[i].id}" class="btn btn-success w-100">Leer</a>
                    </li>
                    <li class="list-group-item">
                        <a id="Guardar" value="${SearchResult[i].id}" class="btn btn-danger text-white w-100">
                            <i id="marcado" class="fa-bookmark fa-solid"></i>
                            Agregar a lista
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    `;

            // Organizar tarjetas en filas
            if (j == 0) {
                cardHTML += `<div class="row g-4 d-flex justify-content-center">`; // Usar g-4 para margen
                cardHTML += tmpCardHTML;
                i++;
                j++;
            } else if (j == 2) {
                cardHTML += tmpCardHTML;
                cardHTML += `</div>`;
                j = 0;
                i++;
            } else {
                cardHTML += tmpCardHTML;
                i++;
                j++;
            }
        }
        $("#SearchResults").html(cardHTML);

        $("#SearchResults").on("click", "a#IrALectura", function () {
            var libroIdString = $(this).attr("value");
            var libroId = parseInt(libroIdString);
            goToLeer(libroId);
        });
        $("#SearchResults").on("click", "a#Guardar", function () {
            var libroIdString = $(this).attr("value");
            var libroId = parseInt(libroIdString);
            markBooks(libroId);
            

            // Aquí puedes agregar lógica adicional para manejar la actualización de la lista, como hacer una petición al servidor si es necesario.
        });
        console.log(SearchResult);
    });
});