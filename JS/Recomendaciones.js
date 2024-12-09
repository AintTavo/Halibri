$(document).ready(() => {
    $("title").text(UserData.name + " | Recomendaciones");
    $("span#NameUsuario").text(UserData.name);

    obtenerLibrosRecomendados().then((librosRec) => {
        console.log(librosRec)

        let selectedIndices = new Set(); // Usamos un Set para evitar duplicados
        let selectedBooks = []; // Opcional, para guardar los libros seleccionados
        let cardHTML = "";

        while (selectedIndices.size < Math.min(3, librosRec.length)) { // Nos aseguramos de no exceder el número de libros disponibles
            const randomIndex = Math.floor(Math.random() * librosRec.length);
            if (!selectedIndices.has(randomIndex)) { // Verificamos que el índice no esté repetido
                selectedIndices.add(randomIndex); // Añadimos el índice al Set
                selectedBooks.push(librosRec[randomIndex]); // Opcional: Guardamos el libro seleccionado
                const libro = librosRec[randomIndex]; // Obtenemos el libro actual
                // Determinar si el libro está en la lista
                const iconClass = libro.enLista === "Sí" ? "fa-solid" : "fa-regular"; // Si está en la lista, ícono sólido

                cardHTML += `
                    <div class="col-sm-12 col-md-12 col-lg-4 d-flex align-items-stretch">
                        <div class="card w-100">
                            <img src="${libro.rutaPortada}" class="card-img-top" alt="${libro.titulo} Portada">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${libro.titulo}</h5>
                                <p class="card-text">
                                    <ul>
                                        <li><b>Autor: </b> ${libro.autor}</li>
                                        <li><b>Día de publicación: </b> ${libro.diaDePublicacion}</li>
                                        <li>
                                            <b>Géneros:</b><br>
                                            <ul>
                                                <li id="genero1" class="badge bg-primary text-white">${libro.generos[0]}</li>
                                                <li id="genero2" class="badge bg-primary text-white">${libro.generos[1]}</li>
                                                <li id="genero3" class="badge bg-primary text-white">${libro.generos[2]}</li>
                                            </ul>
                                        </li>
                                    </ul>
                                </p>
                                <div class="mt-auto d-flex justify-content-between">
                                    <a id="IrALectura" value="${libro.id}" class="btn btn-success w-75">Leer</a>
                                    <a id="Guardar" value="${libro.id}" class="btn btn-danger text-white">
                                        <i id="marcado" class="fa-bookmark ${iconClass}"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        $("#librosRecomendados").html(cardHTML);

        // Delegación de eventos para los enlaces "Leer" (IrALectura)
        $("#librosRecomendados").on("click", "a#IrALectura", function () {
            var libroIdString = $(this).attr("value");
            var libroId = parseInt(libroIdString);
            goToLeer(libroId);
        });

        // Delegación de eventos para el ícono "Guardar" (fa-bookmark)
        $("#librosRecomendados").on("click", "a#Guardar", function () {
            var icono = $(this).find("i#marcado"); // Obtener el ícono dentro del enlace

            // Alternar la clase del ícono entre fa-solid y fa-regular
            if (icono.hasClass("fa-solid")) {
                console.log("Si");
                icono.removeClass("fa-solid");
                icono.addClass("fa-regular");
                console.log("El libro con ID " + libroId + " se ha eliminado de la lista.");
            } else {
                icono.removeClass("fa-regular");
                icono.addClass("fa-solid");
                console.log("El libro con ID " + libroId + " se ha agregado a la lista.");
            }

            var libroIdString = $(this).attr("value");
            var libroId = parseInt(libroIdString);
            console.log(libroId);
            markBooks(libroId);

            // Aquí puedes agregar lógica adicional para manejar la actualización de la lista, como hacer una petición al servidor si es necesario.
        });

        console.log(selectedBooks); // Libros seleccionados

    }).catch((error) => {
        console.error("Error al cargar los libros:", error);
    });
});
