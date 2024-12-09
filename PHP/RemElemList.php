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
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_input = filter_var($_POST['idUser'], FILTER_VALIDATE_INT);
    $book_input = filter_var($_POST['idBook'], FILTER_VALIDATE_INT);

    if (!$user_input) {
        echo json_encode(['success' => false, 'message' => 'Invalid user ID']);
        exit;
    }

    if(!$book_input) {
        echo json_encode(['success' => false, 'message' => 'Invalid book ID']);
    }

    $sql = "
        DELETE FROM listaLibros WHERE IdUsuario = ? AND IdLibro = ?;
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $user_input, $book_input);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Eliminado de la Lista']);
    $stmt->close();
}
$conn->close();
exit;

?>


?>