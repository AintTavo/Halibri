const profilePictures = [
    "../IMG/UserProfile/profilePicture1.jpg",
    "../IMG/UserProfile/profilePicture2.jpg",
    "../IMG/UserProfile/profilePicture3.jpg",
    "../IMG/UserProfile/profilePicture4.jpg",
    "../IMG/UserProfile/profilePicture5.jpg",
    "../IMG/UserProfile/profilePicture6.jpg",
    "../IMG/UserProfile/profilePicture7.jpg",
    "../IMG/UserProfile/profilePicture8.jpg",
    "../IMG/UserProfile/profilePicture9.jpg",
    "../IMG/UserProfile/profilePicture10.jpg"
];

const misionBanner = [
    "../IMG/MisionBanner/MisionBanner1.jpg",
    "../IMG/MisionBanner/MisionBanner2.jpg",
    "../IMG/MisionBanner/MisionBanner3.jpg",
    "../IMG/MisionBanner/MisionBanner4.jpg",
    "../IMG/MisionBanner/MisionBanner5.jpg",
    "../IMG/MisionBanner/MisionBanner6.jpg",
    "../IMG/MisionBanner/MisionBanner7.jpg",
    "../IMG/MisionBanner/MisionBanner8.jpg",
    "../IMG/MisionBanner/MisionBanner9.jpg",
    "../IMG/MisionBanner/MisionBanner10.jpg"
];

const randomIndexProfile = Math.floor(Math.random() * profilePictures.length);
const randomIndexBanner = Math.floor(Math.random() * misionBanner.length);
const selectedImage = profilePictures[randomIndexProfile];
const selectedBanner = misionBanner[randomIndexBanner];

$(document).ready(() => {
    // Validación del arreglo de imágenes
    if (profilePictures.length > 0) {
        
        $("#profileBanner").css("background-image", `url('${selectedImage}')`);
        $("#misionBanner").css("background-image", `url('${selectedBanner}')`);
        console.log("hola");
    } else {
        console.error("No hay imágenes disponibles para el banner.");
    }

    // Datos del usuario desplegados con valores predeterminados
    const userName = UserData?.name || "Usuario Anónimo";
    const email = UserData?.email || "Sin correo";
    const sexo = UserData?.sexo || "N";
    const racha = UserData?.racha || "0";

    $("#NameUsuario").text(userName);
    $("title").text(userName + " | Halibri");
    $("#userName").text(userName);
    $("#email").text(email);

    switch (sexo) {
        case 'M':
            $("#sexo").text("Masculino");
            break;
        case 'F':
            $("#sexo").text("Femenino");
            break;
        case 'N':
            $("#sexo").text("No definido");
            break;
        default:
            $("#sexo").text("Valor fuera de rango");
    }

    $("#racha").text(racha);

    // Parte de cerrar sesión
    $("#logoutButton").on("click", () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Estás a punto de cerrar sesión.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    localStorage.removeItem("userData");
                    localStorage.removeItem("SesionIniciada");
                    Swal.fire(
                        'Cerrando sesión',
                        'Has cerrado sesión con éxito.',
                        'success'
                    );

                    setTimeout(() => {
                        window.location.href = "../index.html";
                    }, 1500);
                } catch (error) {
                    console.error("Error al cerrar sesión:", error);
                    Swal.fire(
                        'Error',
                        'No se pudo cerrar la sesión.',
                        'error'
                    );
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Acción cancelada',
                    'No cerraste sesión.',
                    'info'
                );
            }
        });
    });
});
