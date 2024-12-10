$(document).ready(() => {
    const UserData = JSON.parse(localStorage.getItem('userData'));
    $("title").text(`${UserData.name} | Lista`);
    $("span#NameUsuario").text(UserData.name);

    ObtenerElemtosEnLaLista(UserData.id).then((listBook) => {
        let cardHTML = "";
        let i = 0;

        while (i < listBook.length) {
            const uniqueId = `collapse${i}`; // ID único para cada acordeón.

            cardHTML += `
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${uniqueId}" aria-expanded="false" aria-controls="${uniqueId}">
                            ${listBook[i].titulo}
                        </button>
                    </h2>
                    <div id="${uniqueId}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <div class="container-fluid px-0">
                                <div class="row g-0 d-flex align-items-strech">
                                    <div class="col-sm-12 col-md-6 col-lg-3">
                                        <div
                                            class="portada"
                                            style="
                                                background-image: url('${listBook[i].rutaPortada}');
                                                background-size: cover;
                                                background-position: center;
                                                height: 30vh;
                                            "
                                            aria-label="Portada de ${listBook[i].titulo}">
                                        </div>
                                    </div>
                                    <div class="col-sm-12 col-md-6 col-lg-9">
                                        <div class="row text-center">
                                                <b>Autor: </b><p class="text-center">${listBook[i].autor}</p>
                                                <b>Día de publicación: </b><p class="text-center">${listBook[i].diaDePublicacion}</p>
                                                <b>Generos:</b>
                                                <ul>
                                                    <li class="badge bg-primary">${listBook[i].generos[0]}</li>
                                                    <li class="badge bg-primary">${listBook[i].generos[1]}</li>
                                                    <li class="badge bg-primary">${listBook[i].generos[2]}</li>
                                                </ul>
                                        </div>
                                        <div class="row p-4">
                                            <div class="mt-auto d-flex justify-content-between">
                                                <a id="IrALectura" value="${listBook[i].id}" class="btn btn-success w-75">Leer</a>
                                                <a id="Guardar" value="${listBook[i].id}" class="btn btn-danger text-white">
                                                    Eliminar de la lista
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            i++;
        }

        // Agregar el contenido generado al contenedor con ID "lista".
        $("#lista").html(cardHTML);

        // Manejar el evento de clic para "Leer"
        $("#lista").on("click", "a#IrALectura", (event) => {
            var libroIdString = $(event.currentTarget).attr("value");
            var libroId = parseInt(libroIdString);
            goToLeer(libroId);
        });

        // Manejar el evento de clic para "Eliminar de la lista"
        $("#lista").on("click", "a#Guardar", (event) => {
            var libroIdString = $(event.currentTarget).attr("value");
            var libroId = parseInt(libroIdString);
            EliminarElementosLista(libroId);
        });

    }).catch((error) => {
        console.error("Error al obtener la lista de libros:", error);
    });
});
