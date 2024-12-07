$.ajax({
    url: '../PHP/ObtLibro.php',
    type: 'POST',
    success: function (response) {
        const result = JSON.parse(response);
        if (result.success) {
            var libros = result.libros;
            console.log(libros);
        }
        else{
            console.error("Error en el ajax");
        }
    }
});