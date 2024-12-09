<?php
// Configuracion de la conexion
$host = "localhost";
$user = "root";
$password = "";
$database = "halibri";

$conn = new mysqli($host, $user, $password, $database);

//Verificar la conexion
if($conn->connect_error){
    echo json_encode(['success' => false, 'error' => 'Connection failed' . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_input = filter_var($_POST['idUser'], FILTER_VALIDATE_INT);

    if (!$user_input) {
        echo json_encode(['success' => false, 'message' => 'Invalid user ID']);
        exit;
    }

    $sql = "
        SELECT 
            L.IdLibro,
            L.Titulo,
            L.Autor,
            L.RutaPortada,
            L.DiaDePublicacion,
            GROUP_CONCAT(DISTINCT Genero.NombreGenero SEPARATOR ', ') AS Generos
        FROM 
            ListaLibros LL
        JOIN 
            Libro L ON LL.IdLibro = L.IdLibro
        LEFT JOIN 
            GeneroLibro ON L.IdLibro = GeneroLibro.IdLibro
        LEFT JOIN 
            Genero ON GeneroLibro.IdGenero = Genero.IdGenero
        WHERE
            LL.IdUsuario = ?
        GROUP BY
            L.IdLibro
        ORDER BY
            LL.IdLista;
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_input);
    $stmt->execute();
    $result = $stmt->get_result();

    $ListBooks = [];
    while ($row = $result->fetch_assoc()) {
        $ListBooks[] = [
            "id" => $row["IdLibro"],
            "titulo" => $row["Titulo"],
            "autor" => $row["Autor"],
            "rutaPortada" => $row["RutaPortada"],
            "diaDePublicacion" => $row["DiaDePublicacion"],
            "generos" => $row["Generos"] ? explode(",", $row["Generos"]) : [],
        ];
    }

    if (count($ListBooks) > 0) {
        echo json_encode(['success' => true, 'librosLista' => $ListBooks]);
        exit;
    }

    echo json_encode(['success' => true, 'message' => 'SinLibros']);
    $stmt->close();
}
$conn->close();
exit;

?>