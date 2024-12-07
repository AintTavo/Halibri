window.onload = () => {
    var SesionStatus = localStorage.getItem("SesionIniciada");
    if (SesionStatus === "false") {
        localStorage.setItem("SesionIniciada","false");
    }
    if (SesionStatus === "true") {
        window.location.href =  '../HTML/PaginaPrincipal.html';
    }
}