// Lectura.js
$(document).ready(function () {
  const tmpUserData = localStorage.getItem('userData');
  const tmpJSONData = JSON.parse(tmpUserData);
  const userId      = tmpJSONData.userId;
  const bookId      = tmpJSONData.lastBook;

  obtLibroUnico(bookId).then((libro) => {
    const book = ePub(libro.rutaEPUB);
    const rendition = book.renderTo("viewer", {
      spread:     "always",
      manager:    "continuous",
      flow:       "paginated",
      width:      "100%",
      height:     "600px"
    });

    // 1) Espera a que el libro esté listo y genere ubicaciones
    book.ready
      .then(() => book.locations.generate(1000))
      .then(() => {
        // 2) Recupera el progreso desde tu PHP
        return $.getJSON("../PHP/ObtenerProgreso.php", {
          user_id: userId,
          book_id: bookId
        });
      })
      .then(resp => {
        console.log("Progreso recuperado:", resp.page);
        const lastPage = parseInt(resp.page, 10) || 1;

        if (lastPage > 1) {
          // Convierte página → CFI y muestra desde ahí
          const cfi = book.locations.cfiFromLocation(lastPage - 1);
          rendition.display(cfi);
        } else {
          // Si no hay progreso, inicia al principio
          rendition.display();
        }
      })
      .catch(err => {
        // Si hay algún error (ubicaciones o AJAX), arranca al inicio
        console.warn("No se pudo reanudar: ", err);
        rendition.display();
      });

    // — Navegación manual, swipe y TOC —
    $('#next').click(e => { e.preventDefault(); rendition.next(); });
    $('#prev').click(e => { e.preventDefault(); rendition.prev(); });
    $("#viewer").swipe({
      swipeLeft:  () => rendition.next(),
      swipeRight: () => rendition.prev(),
      threshold:  0
    });
    book.loaded.navigation.then(toc => {
      const $toc = $('#toc');
      toc.forEach(chapter => {
        const $li = $(
          `<li><a class="dropdown-item" href="#" data-href="${chapter.href}">${chapter.label}</a></li>`
        );
        $li.find('a').click(e => {
          e.preventDefault();
          rendition.display($(e.currentTarget).data('href'));
        });
        $toc.append($li);
      });
    });
    book.loaded.metadata.then(meta => {
      document.title = meta.title;
      $('meta[name="description"]').attr("content", meta.description || meta.title);
    });
    rendition.on("selected", (cfiRange, contents) => {
      rendition.annotations.highlight(cfiRange, {}, e => console.log("highlight clicked", e.target));
      contents.window.getSelection().removeAllRanges();
    });

    // 3) Guarda cada cambio de posición
    rendition.on("relocated", location => {
      const cfi       = location.start.cfi;
      const pageIndex = book.locations.locationFromCfi(cfi);
      const page      = pageIndex + 1;
      const pct       = Math.round(book.locations.percentageFromCfi(cfi) * 100);

      saveProgress(userId, bookId, page, pct);
    });

    // Flechas del teclado
    $(document).keyup(e => {
      if (e.which === 37) rendition.prev();
      if (e.which === 39) rendition.next();
    });

    // Limpia al salir
    window.addEventListener("unload", () => book.destroy());
  });

  // Función para enviar el progreso al servidor
  function saveProgress(userId, bookId, page, percent) {
    $.ajax({
      url:    "../PHP/GuardarProgreso.php",
      method: "POST",
      data: {
        user_id: userId,
        book_id: bookId,
        page:    page,
        percent: percent
      },
      error: err => console.error("Error guardando progreso:", err)
    });
  }
});
