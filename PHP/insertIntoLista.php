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

    $insertIntoList = "INSERT IGNORE INTO listaLibros (IdUsuario, IdLibro) VALUES (?, ?)";

    $stmt = $conn->prepare($insertIntoList);
    $stmt->bind_param("ii",$user_input, $book_input);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Libro incresado correctamente']);
}
else{
    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
}

$stmt->close();
$conn->close();
exit;
?>