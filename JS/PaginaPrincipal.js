$(document).ready(() => {
    if (!libros || !Array.isArray(libros) || !UserData || !UserData.name) {
        console.error("Error: Variables 'libros' o 'UserData' no están definidas correctamente.");
        return;
    }

    const imagenes = libros.map(libro => libro.rutaPortada);
    $("#NameUsuario").text(UserData.name);
    $("title").text(`${UserData.name} | Halibri`);

    if (UserData.lastBook === null) {
        $("div#lastBook").text("Empieza a leer uno de nuestros libros recomendados");

        function cambiarFondo() {
            const nuevaImagen = imagenes[Math.floor(Math.random() * imagenes.length)];

            $("div#lastBook .overlay").remove(); // Evita duplicados
            $("div#lastBook").css({
                "background-image": `url(${nuevaImagen})`,
                "background-size": "cover",
                "background-position": "center",
                "transition": "background-image 2s ease-in-out",
            }).append('<div class="overlay"></div>');

            $(".overlay").css({
                "position": "absolute",
                "top": "0",
                "left": "0",
                "width": "100%",
                "height": "100%",
                "background": "rgba(0, 0, 0, 0.5)",
                "z-index": "1",
                "transition": "background 2s ease-in-out"
            });
        }

        cambiarFondo();
        setInterval(cambiarFondo, 5000);
    } else {
        $("div#lastBook").text("Continúa con tu último libro");
        $("div#lastBook").css("background-image", `url(${imagenes[0]})`);
    }
});
