let fontSize = 100; // Porcentaje inicial

document.getElementById("zoom-in").addEventListener("click", () => {
    fontSize += 10;
    rendition.themes.fontSize(`${fontSize}%`);
});

document.getElementById("zoom-out").addEventListener("click", () => {
    fontSize = Math.max(50, fontSize - 10); // Límite mínimo de 50%
    rendition.themes.fontSize(`${fontSize}%`);
});

const pageInput = document.getElementById("page-input");
const totalPagesSpan = document.getElementById("total-pages");

rendition.on("relocated", (location) => {
    const currentPage = location.start.index + 1;
    pageInput.value = currentPage;
    book.locations.generate().then(() => {
        totalPagesSpan.textContent = `/ ${book.locations.length()}`;
    });
});

pageInput.addEventListener("change", (e) => {
    const pageNumber = parseInt(e.target.value, 10) - 1;
    rendition.display(book.locations.cfiFromIndex(pageNumber));
});

const tocToggle = document.getElementById("toc-toggle");
const toc = document.getElementById("toc");
const tocList = document.getElementById("toc-list");

tocToggle.addEventListener("click", () => {
    toc.style.display = toc.style.display === "none" ? "block" : "none";
});

book.loaded.navigation.then((toc) => {
    toc.forEach((chapter) => {
        const li = document.createElement("li");
        li.textContent = chapter.label;
        li.style.cursor = "pointer";
        li.addEventListener("click", () => {
            rendition.display(chapter.href);
        });
        tocList.appendChild(li);
    });
});
