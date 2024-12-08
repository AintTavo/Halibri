function markBooks(idLibro){
    const userData = localStorage.getItem("userData");
    if (!userData) {
        return Promise.reject("No se encontró información del usuario");
    }
    const tmpUserdata = JSON.parse(userData);
}