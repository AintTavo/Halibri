// Historial.js
$(document).ready(() => {
  // 1️⃣ Datos de usuario
  const UserData = JSON.parse(localStorage.getItem('userData'));
  const userId   = UserData.userId;

  // Actualiza título y nombre en la UI
  $("title").text(`${UserData.name} | Historial`);
  $("span#NameUsuario").text(UserData.name);
  $("#historialName").text(UserData.name);

  // 2️⃣ Obtiene el historial de libros leídos
  ObtenerHistorial().then((libros) => {
    let cardHTML = "";

    // Si no hay historial, mostramos mensaje
    if (libros.length === 0) {
      $("#auxHistorialEQ0").html(`
        <p class="text-center">
          Todavía no has leído nada, si quieres saber qué leer ve a
        </p>
        <a href="../HTML/Recomendaciones.html" class="btn btn-primary w-100">
          Recomendaciones
        </a>
      `);
      return;
    }

    // 3️⃣ Construcción del acordeón con barra de progreso
    libros.forEach((L, i) => {
      const uniqueId   = `collapse${i}`;
      const progressId = `progress-bar-${L.id}`;

      cardHTML += `
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#${uniqueId}"
              aria-expanded="false"
              aria-controls="${uniqueId}"
            >
              ${L.titulo}
              <br>Dia de consulta: ${L.dia}
              <br>Hora de consulta: ${L.hora}
            </button>
          </h2>
          <div
            id="${uniqueId}"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <div class="container-fluid px-0">
                <div class="row g-0 d-flex align-items-stretch">
                  <!-- Portada -->
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
                  <!-- Detalles y progreso -->
                  <div class="col-sm-12 col-md-6 col-lg-9">
                    <div class="row text-center">
                      <div class="col-12">
                        <b>Autor:</b> <span>${L.autor}</span>
                      </div>
                      <div class="col-12">
                        <b>Día de publicación:</b> <span>${L.diaDePublicacion}</span>
                      </div>
                      <div class="col-12">
                        <b>Géneros:</b>
                        <ul class="d-inline-block p-0 m-0">
                          ${L.generos.map(g =>
                            `<li class="badge bg-primary me-1">${g}</li>`
                          ).join('')}
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
                      <!-- Botón Leer -->
                      <div class="mt-auto d-flex justify-content-between">
                        <a
                          id="IrALectura"
                          value="${L.id}"
                          class="btn btn-success w-100"
                        >Leer</a>
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

    // Inserta todo el HTML en el DOM
    $("div#historial").html(cardHTML);

    // 4️⃣ Para cada libro, consulta el progreso y actualiza la barra
    libros.forEach(L => {
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

    // 5️⃣ Handler del botón Leer
    $("#historial").on("click", "a#IrALectura", (event) => {
      event.preventDefault();
      const libroId = parseInt($(event.currentTarget).attr("value"), 10);
      goToLeer(libroId);
    });
  });
});


document.addEventListener('DOMContentLoaded', function() {
    function adjustSideImages() {
        const footer = document.querySelector('footer.bg-dark');
        const sideImages = document.querySelectorAll('.side-image');
        const navbar = document.querySelector('.navbar');
        
        if (!footer || !sideImages.length || !navbar) return;
        
        const navbarHeight = navbar.offsetHeight;
        const footerHeight = footer.offsetHeight;
        const windowHeight = window.innerHeight;
        const contentHeight = document.querySelector('.content-area').offsetHeight;
        
        // Calcular la altura mínima necesaria
        const minHeight = windowHeight - navbarHeight - footerHeight;
        
        sideImages.forEach(image => {
            // Ajustar altura para que llegue al footer
            if (contentHeight < minHeight) {
                image.style.minHeight = `${minHeight}px`;
            } else {
                image.style.minHeight = `${contentHeight + footerHeight}px`;
            }
            
            // Ajustar posición del background
            if (image.classList.contains('d-none')) {
                image.style.backgroundPosition = `center ${-navbarHeight}px`;
            }
        });
    }

    // Ejecutar al cargar y al redimensionar
    adjustSideImages();
    window.addEventListener('resize', adjustSideImages);
});