$(document).ready(() => {
    obtenerLibros().then(libros => {
        const imagenes = libros.map(libro => libro.rutaPortada); // Array con las portadas

        $("#NameUsuario").text(UserData.name);
        $("title").text(`${UserData.name} | Halibri`);

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
        if (UserData.lastBook === null) {
            $("div#lastBook").html(`
                <a href="../HTML/Recomendaciones.html" class="box text-white w-100 h-100 d-flex fs-1 align-items-center justify-content-center">
                    <h1 class="text-white">Empieza a leer uno de nuestros libros recomendados</h1>
                </a>
            `);

            cambiarFondo(); // Llamar a la función para cambiar el fondo
            setInterval(cambiarFondo, 5000); // Cambiar el fondo cada 5 segundos

        } else {
            // Si el usuario tiene un libro, mostrar la portada y el título
            const libro = libros.find(libro => libro.id === UserData.lastBook); // Buscar el libro por ID

            if (libro) {
                // Mostrar la portada del libro y el título
                $("div#lastBook").html(`
                    <div class="box text-white w-100 h-100 d-flex align-items-center justify-content-center">
                        <a href="../HTML/Lectura.html" class="box text-white w-100 h-100 d-flex fs-1 align-items-center justify-content-center">
                            <h1 class="text-white">${libro.titulo}</h1>
                        </a>
                    </div>
                `).css({
                    "background-image": `url(${libro.rutaPortada})`,
                    "background-size": "cover",
                    "background-position": "center",
                    "transition": "background-image 2s ease-in-out",
                    "position": "relative",
                    "filter": "contrast(0.7)"
                });

                // Cambiar el fondo de manera periódica, como en el caso de no tener libro
                cambiarFondo();
                setInterval(cambiarFondo, 5000);
            }
        }
    }).catch(error => {
        console.error("Error cargando los libros:", error);
    });
});
