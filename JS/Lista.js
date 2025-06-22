// Lista.js
$(document).ready(() => {
    // 1️⃣ Datos del usuario
    const UserData = JSON.parse(localStorage.getItem('userData'));
    const userId   = UserData.id;

    // Actualiza título y nombre en la UI
    $("title").text(`${UserData.name} | Lista`);
    $("span#NameUsuario").text(UserData.name);

    // 2️⃣ Obtiene los libros de la lista
    ObtenerElemtosEnLaLista(userId)
        .then((listBook) => {
            let cardHTML = "";

            // Si no hay nada en la lista
            if (listBook.length === 0) {
                $("#listaText").html(`
                    <h3 class="py-4 text-center">No tienes ningún libro en la lista</h3>
                    <h5 class="py-4 text-center">
                        Tal vez te interesen nuestras recomendaciones, 
                        o usa la barra de búsqueda para encontrar algo.
                    </h5>
                    <div class="container-fluid px-4">
                        <div class="row px-4">
                            <a href="../HTML/Recomendaciones.html" class="btn btn-primary w-100 px-4">
                                Recomendaciones
                            </a>
                        </div>
                    </div>
                `);
                return;
            }

            // 3️⃣ Construye el acordeón con barra de progreso
            listBook.forEach((L, i) => {
                const uniqueId   = `collapse${L.id}`;
                const progressId = `progress-bar-${L.id}`;

                cardHTML += `
                    <div class="accordion-item" data-book-id="${L.id}" data-order="${i}">
                        <h2 class="accordion-header">
                            <button 
                                class="accordion-button collapsed" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target="#${uniqueId}" 
                                aria-expanded="false" 
                                aria-controls="${uniqueId}"
                            >
                                <i class="fa-solid fa-grip-vertical me-2 handle"></i>
                                ${L.titulo}
                            </button>
                        </h2>
                        <div 
                            id="${uniqueId}" 
                            class="accordion-collapse collapse" 
                            data-bs-parent="#accordionExample"
                        >
                            <div class="accordion-body">
                                <div class="container-fluid px-0">
                                    <div class="row g-0 d-flex align-items-strech">
                                        <div class="col-sm-12 col-md-6 col-lg-3">
                                            <div
                                                class="portada mb-3"
                                                style="
                                                    background-image: url('${L.rutaPortada}');
                                                    background-size: cover;
                                                    background-position: center;
                                                    height: 30vh;
                                                "
                                                aria-label="Portada de ${L.titulo}"
                                            ></div>
                                        </div>
                                        <div class="col-sm-12 col-md-6 col-lg-9">
                                            <div class="row text-center">
                                                <div class="col-12">
                                                    <b>Autor:</b> ${L.autor}
                                                </div>
                                                <div class="col-12">
                                                    <b>Publicación:</b> ${L.diaDePublicacion}
                                                </div>
                                                <div class="col-12">
                                                    <b>Géneros:</b>
                                                    <ul class="d-inline-block p-0 m-0">
                                                        ${L.generos.map(g => `<li class="badge bg-primary me-1">${g}</li>`).join('')}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="row p-4">
                                                <!-- Barra de progreso -->
                                                <div class="progress mb-3">
                                                    <div
                                                        id="${progressId}"
                                                        class="progress-bar"
                                                        role="progressbar"
                                                        style="width: 0%;"
                                                        aria-valuenow="0"
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    >0%</div>
                                                </div>
                                                <!-- Botones Leer y Eliminar -->
                                                <div class="mt-auto d-flex justify-content-between">
                                                    <a id="IrALectura" value="${L.id}" class="btn btn-success w-75">
                                                        Leer
                                                    </a>
                                                    <a id="Guardar" value="${L.id}" class="btn btn-danger text-white">
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
            });

            // Inserta el acordeón y el encabezado
            $("#lista").html(cardHTML);
            $("#listaText").html(`
                <h4 class="text-center">Lista de libros hecha por ${UserData.name}</h4>
                <p class="text-center text-muted">Arrastra los libros para reordenarlos</p>
            `);

            // 4️⃣ Para cada libro, recupera el porcentaje y actualiza la barra
            listBook.forEach(L => {
                const progressId = `#progress-bar-${L.id}`;
                $.getJSON("../PHP/ObtenerProgreso.php", {
                    user_id: userId,
                    book_id: L.id
                })
                .done(resp => {
                    const pct = parseInt(resp.percent, 10) || 0;
                    $(progressId)
                        .css('width', pct + '%')
                        .attr('aria-valuenow', pct)
                        .text(pct > 0 ? pct + '%' : 'Sin leer');
                })
                .fail(() => {
                    $(progressId)
                        .addClass('bg-danger')
                        .text('Error');
                });
            });

            // 5️⃣ Implementar drag and drop
            setupDragAndDrop(userId);

            // 6️⃣ Manejadores de clic
            $("#lista")
                .on("click", "a#IrALectura", event => {
                    event.preventDefault();
                    const libroId = parseInt($(event.currentTarget).attr("value"), 10);
                    goToLeer(libroId);
                })
                .on("click", "a#Guardar", event => {
                    event.preventDefault();
                    const libroId = parseInt($(event.currentTarget).attr("value"), 10);
                    EliminarElementosLista(libroId);
                });

        })
        .catch(error => {
            console.error("Error al obtener la lista de libros:", error);
            $("#listaText").html(`
                <h3 class="py-4 text-center text-danger">
                    Error al cargar la lista—intenta de nuevo más tarde.
                </h3>
            `);
        });
});

function setupDragAndDrop(userId) {
    const lista = document.getElementById('lista');
    let draggedItem = null;

    // Eventos para los elementos arrastrables
    lista.querySelectorAll('.accordion-item').forEach(item => {
        item.setAttribute('draggable', 'true');

        item.addEventListener('dragstart', function() {
            draggedItem = this;
            setTimeout(() => {
                this.classList.add('dragging');
            }, 0);
        });

        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });

    // Eventos para el contenedor
    lista.addEventListener('dragover', function(e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(lista, e.clientY);
        const currentItem = document.querySelector('.dragging');
        
        if (!afterElement) {
            lista.appendChild(currentItem);
        } else {
            lista.insertBefore(currentItem, afterElement);
        }
    });

    // Evento para guardar el orden al soltar
    lista.addEventListener('dragend', function() {
        updateBookOrder(userId);
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.accordion-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

