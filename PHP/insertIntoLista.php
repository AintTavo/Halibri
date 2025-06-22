<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "halibri";

$conn = new mysqli($host, $user, $password, $database);

if($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Connection Failed:" . $conn->connect_error]);
    exit;
}

if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_input = filter_var($_POST['idUser'], FILTER_VALIDATE_INT);
    $book_input = filter_var($_POST['idBook'], FILTER_VALIDATE_INT);

    if ((!$user_input) || (!$book_input)) {
        echo json_encode(['success' => false, 'message' => 'Invalid user ID or invalid book ID']);
        exit;
    }

    // Primero obtenemos el máximo orden actual para este usuario
    $getMaxOrder = "SELECT MAX(Orden) as max_order FROM ListaLibros WHERE IdUsuario = ?";
    $stmt = $conn->prepare($getMaxOrder);
    $stmt->bind_param("i", $user_input);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $newOrder = ($row['max_order'] === null) ? 0 : $row['max_order'] + 1;
    $stmt->close();

    // Insertamos el libro con el orden calculado
    $insertIntoList = "INSERT IGNORE INTO ListaLibros (IdUsuario, IdLibro, Orden) VALUES (?, ?, ?)";

    $stmt = $conn->prepare($insertIntoList);
    $stmt->bind_param("iii", $user_input, $book_input, $newOrder);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Libro agregado correctamente al final de la lista']);
} else {
    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
}

$stmt->close();
$conn->close();
exit;
?>