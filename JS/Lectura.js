$(document).ready(function () {
    const tmpUserData = localStorage.getItem('userData');
    const tmpJSONData = JSON.parse(tmpUserData);
    const IdLastBook = tmpJSONData.lastBook;

    obtLibroUnico(IdLastBook).then((libro) => {
        var book = ePub(libro.rutaEPUB);
        var rendition = book.renderTo("viewer", {
            spread: "always",
            manager: "continuous",
            flow: "paginated",
            width: "100%",
            height: "600px"
        });

        rendition.display();

        $('#next').click(function (e) {
            e.preventDefault();
            rendition.next();
        });

        $('#prev').click(function (e) {
            e.preventDefault();
            rendition.prev();
        });

        // Añadir funcionalidad de swipe
        $("#viewer").swipe({
            swipeLeft: function () {
                rendition.next();
            },
            swipeRight: function () {
                rendition.prev();
            },
            threshold: 0
        });

        book.loaded.navigation.then(function (toc) {
            var $tocDropdown = $('#toc');
            toc.forEach(function (chapter) {
                var $chapterLink = $('<li><a class="dropdown-item" href="#" data-href="' + chapter.href + '">' + chapter.label + '</a></li>');
                $chapterLink.find('a').click(function (e) {
                    e.preventDefault();
                    var href = $(this).data('href');
                    rendition.display(href);
                });
                $tocDropdown.append($chapterLink);
            });
        });

        book.loaded.metadata.then(function (meta) {
            document.title = meta.title;
            $('meta[name="description"]').attr("content", meta.description || meta.title);
        });

        rendition.on("selected", function (cfiRange, contents) {
            rendition.annotations.highlight(cfiRange, {}, (e) => {
                console.log("highlight clicked", e.target);
            });
            contents.window.getSelection().removeAllRanges();
        });

        rendition.on("relocated", function (location) {
            console.log(location);
        });

        $(document).keyup(function (e) {
            if (e.which == 37) rendition.prev(); // left arrow
            if (e.which == 39) rendition.next(); // right arrow
        });

        window.addEventListener("unload", function () {
            console.log("unloading");
            book.destroy();
        });
    });
});
