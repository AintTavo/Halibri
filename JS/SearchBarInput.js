$(document).ready(() => {
    const handleSearch = () => {
        const searchQuery = $("#searchInput").val().trim();

        if (searchQuery === "") {
            Swal.fire({
                icon: 'warning',
                title: 'Campo vacío',
                text: 'Por favor, ingresa algo para buscar.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        sessionStorage.setItem('searchQuery', searchQuery);
        window.location.href = "../HTML/Busqueda.html";
    };

    // Evento para el botón de búsqueda
    $('#searchButton').on('click', handleSearch);

    // Evento para presionar Enter en el campo de entrada
    $('#searchInput').on('keydown', (e) => {
        if (e.key === 'Enter') { // Verificar si la tecla es Enter
            e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
            handleSearch();
        }
    });
});
