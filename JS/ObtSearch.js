function Search() {
    const SearchQuery = sessionStorage.getItem('searchQuery');
    if (!SearchQuery || SearchQuery.trim() === "") {

        return Promise.reject("No se encontró información sobre la búsqueda");
    }

    return new Promise((resolve, reject) => {
        $.ajax({
            url: '../PHP/ObtSearchedBooks.php',
            type: 'POST',
            data: { searchQuery: SearchQuery },
            success: (response) => {
                try {
                    const result = JSON.parse(response);
                    if (result.success) {
                        resolve(result.SearchResult);
                    } else {
                        reject(result.message || "Búsqueda no encontrada");
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
