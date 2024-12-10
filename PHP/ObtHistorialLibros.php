<?php
// Configuracion de la conexion
$host = "localhost";
$user = "root";
$password = "";
$database = "halibri";

$conn = new mysqli($host, $user, $password, $database);

//Verificar la conexion
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Connection failed' . $conn->connect_error]);
    exit;
}

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $user_input = filter_var($_POST['idUser'], FILTER_VALIDATE_INT);
    if(!$user_input){
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
        H.dia,
        H.hora,
        GROUP_CONCAT(DISTINCT g.NombreGenero SEPARATOR ', ') AS Generos
    FROM 
        HistorialLibroUsr H
    JOIN 
        Libro L ON H.IdLibro = L.IdLibro
    LEFT JOIN 
        GeneroLibro gl ON L.IdLibro = gl.IdLibro
    LEFT JOIN 
        Genero g ON g.IdGenero = gl.IdGenero -- Corregido: vinculación adecuada de la clave foránea
    WHERE
        H.IdUsuario = ?
    GROUP BY
        H.IdHistorial
    ORDER BY
        H.dia DESC, H.hora DESC;
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_input);
    $stmt->execute();
    $result = $stmt->get_result();

    $HistorialBooks = [];

    while ($row = $result->fetch_assoc()) {
        $HistorialBooks[] = [
            "id" => $row["IdLibro"],
            "titulo" => $row["Titulo"],
            "autor" => $row["Autor"],
            "rutaPortada" => $row["RutaPortada"],
            "diaDePublicacion" => $row["DiaDePublicacion"],
            "dia" => $row["dia"],
            "hora" => $row["hora"],
            "generos" => $row["Generos"] ? explode(",", $row["Generos"]) : [],
        ];
    }

    echo json_encode(['success' => true,'message' => "Consulta realizada correctamente", 'libros' => $HistorialBooks]);
    $stmt->close();
}
$conn->close();
exit;
?>