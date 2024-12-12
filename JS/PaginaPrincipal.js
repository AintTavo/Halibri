$(document).ready(() => {
    const tmpUserData = localStorage.getItem('userData');
    const tmpJSONData = JSON.parse(tmpUserData);
    $("#NameUsuario").text(UserData.name);
    $("title").text(`${UserData.name} | Halibri`);
    const IdLastBook = tmpJSONData.lastBook;
    if(IdLastBook === null){
        obtenerLibros().then(libros => {
            const imagenes = libros.map(libro => libro.rutaPortada); // Array con las portadas
            // Función para cambiar el fondo de manera periódica con imágenes de los libros
            function cambiarFondo() {
                const nuevaImagen = imagenes[Math.floor(Math.random() * imagenes.length)];

                $("div#lastBook .overlay").remove(); // Evita duplicados
                $("div#lastBook").css({
                    "background-image": `url(${nuevaImagen})`,
                    "background-size": "cover",
                    "background-position": "center",
                    "transition": "background-image 2s ease-in-out",
                    "position": "relative",
                    "filter": "contrast(0.7)"
                }).append('<div class="overlay"></div>');

                $(".overlay").css({
                    "position": "absolute",
                    "top": "0",
                    "left": "0",
                    "width": "100%",
                    "height": "100%",
                    "background": "rgba(0, 0, 0, 0.7)",  // Oscurecer el fondo
                    "z-index": "-1",  // Ponerlo detrás del contenido
                    "transition": "background 2s ease-in-out"
                });
            }

            // Si el usuario no tiene un libro leído
            $("div#lastBook").html(`
            <a href="../HTML/Recomendaciones.html" class="box text-white w-100 h-100 d-flex fs-1 align-items-center justify-content-center">
                <h1 class="text-white">Empieza a leer uno de nuestros libros recomendados</h1>
            </a>
            `);

            cambiarFondo(); // Llamar a la función para cambiar el fondo
            setInterval(cambiarFondo, 5000); // Cambiar el fondo cada 5 segundos

        }).catch(error => {
            console.error("Error cargando los libros:", error);
        });
    }
    else{
        obtLibroUnico(IdLastBook).then((lastBook)=>{
            $("div#lastBook .overlay").remove();

            $("div#lastBook").css({
                "background-image": `url(${lastBook.rutaPortada})`,
                "background-size": "cover",
                "background-position": "center",
                "transition": "background-image 2s ease-in-out",
                "position": "relative",
                "filter": "contrast(0.7)"
            });

            $(".overlay").css({
                "position": "absolute",
                "top": "0",
                "left": "0",
                "width": "100%",
                "height": "100%",
                "background": "rgba(0, 0, 0, 0.7)",  // Oscurecer el fondo
                "z-index": "-1",  // Ponerlo detrás del contenido
                "transition": "background 2s ease-in-out"
            });

            $("div#lastBook").html(`
            <a id="aLastBook" value="${lastBook.id}" class="box text-white w-100 h-100 text-decoration-none">
                <div class="container h-100 d-flex flex-column justify-content-center">
                    <div class="row mb-3">
                        <h4 class="text-white text-center">Continúa con tu lectura de:</h4>
                    </div>
                    <!-- Fila para el título del libro -->
                    <div class="row mb-3">
                        <h1 class="text-white text-center">${lastBook.titulo}</h1>
                    </div>
                    <!-- Fila para el autor -->
                    <div class="row mb-3">
                        <h4 class="text-white text-center">${lastBook.autor}</h4>
                    </div>
                    <div class="row">
                        <h4 class="text-white text-center">${lastBook.diaDePublicacion}</h4>
                    </div>
                </div>
            </a>
            `);

            $("div#lastBook").on("click","a#aLastBook",function() {
                var libroIdString = $(this).attr("value");
                var libroId = parseInt(libroIdString);
                goToLeer(libroId);
            })
        }).catch((error) => {
            console.error("Error al cargar ultimo: ", error);
        });
    }

    



});
