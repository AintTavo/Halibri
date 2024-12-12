$(document).ready(()=>{
    const UserData = JSON.parse(localStorage.getItem('userData'));
    $("title").text(`${UserData.name} | Historial`);
    $("span#NameUsuario").text(UserData.name);
    $("#historialName").text(UserData.name);

    ObtenerHistorial().then((libros) => {
        let cardHTML = "";
        let i = 0;
        if(libros.length === 0){
            $("#auxHistorialEQ0").html(`
                <p class="text-center">Todavia no haz leido nada, si quieres saber que leer ve a</p>
                <a href="../HTML/Recomendaciones.html" class="btn btn-primary w-100">Recomendaciones</a>
            `);
        }
        else{
            while(i < libros.length){
                const uniqueId = `collapse${i}`;
                cardHTML += `
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${uniqueId}" aria-expanded="false" aria-controls="${uniqueId}">
                                ${libros[i].titulo}<br>Dia de consulta: ${libros[i].dia}<br>Hora de consulta: ${libros[i].hora}
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
                                                    background-image: url('${libros[i].rutaPortada}');
                                                    background-size: cover;
                                                    background-position: center;
                                                    height: 30vh;
                                                "
                                                aria-label="Portada de ${libros[i].titulo}">
                                            </div>
                                        </div>
                                        <div class="col-sm-12 col-md-6 col-lg-9">
                                            <div class="row text-center">
                                                    <b>Autor: </b><p class="text-center">${libros[i].autor}</p>
                                                    <b>Día de publicación: </b><p class="text-center">${libros[i].diaDePublicacion}</p>
                                                    <b>Generos:</b>
                                                    <ul>
                                                        <li class="badge bg-primary">${libros[i].generos[0]}</li>
                                                        <li class="badge bg-primary">${libros[i].generos[1]}</li>
                                                        <li class="badge bg-primary">${libros[i].generos[2]}</li>
                                                    </ul>
                                            </div>
                                            <div class="row p-4">
                                                <div class="mt-auto d-flex justify-content-between">
                                                    <a id="IrALectura" value="${libros[i].id}" class="btn btn-success w-100">Leer</a>
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
            $("div#historial").html(cardHTML);

            $("#historial").on("click", "a#IrALectura", (event) => {
                var libroIdString = $(event.currentTarget).attr("value");
                var libroId = parseInt(libroIdString);
                goToLeer(libroId);
            });
        }
    });
});