<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "halibri";

$conn = new mysqli($host, $user, $password, $database);

if($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Conexion fallida: " . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    $book_input = filter_var($_POST['idBook']);

    if (!$book_input) {
        echo json_encode(["success" => false, "message" => "Invalid book ID"]);
        exit;
    }

    $sql = "SELECT * FROM Libro WHERE IdLibro = ?;";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $book_input);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows > 0){
        $lastBook = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'message' => 'Ultimo libro leido obtenido correctamente',
            'lastBook' => [
                "id" => $lastBook['IdLibro'],
                "titulo" => $lastBook['Titulo'],
                "rutaEPUB" => $lastBook['RutaEPUB'],
                "rutaPortada" => $lastBook['RutaPortada'],
                "autor" => $lastBook['Autor'],
                "diaDePublicacion" => $lastBook['DiaDePublicacion'],
            ]
            ]);
    }
    else{
        echo json_encode(['success' => false, 'message' => 'Libro no encontrado']);
    }
    $stmt->close();
}
else{
    echo json_encode(['success' => false, 'message' => 'Sin peticion POST encontrado']);
}

$conn->close();
exit;

?>