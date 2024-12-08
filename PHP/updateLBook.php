<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "halibri";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_input = filter_var($_POST['idUser'], FILTER_VALIDATE_INT);
    $book_input = filter_var($_POST['idBook'], FILTER_VALIDATE_INT);

    if ((!$user_input) || (!$book_input)) {
        echo json_encode(["success" => false, "error" => "Invalid user ID or invalid book ID"]);
        exit;
    }

    $updateLastBook = "UPDATE Usuario SET UltimoLibro = ? WHERE IdUsuario = ?;";
    $insertToHistorial = "INSERT INTO HistorialLibroUsr (IdUsuario, IdLibro, dia, hora) VALUES (?, ?, CURDATE(), CURTIME());";
    $updateLocalStorageUser = "SELECT * FROM Usuario WHERE IdUsuario = ?"; // Define la consulta correctamente

    // Actualizar el último libro
    $stmt = $conn->prepare($updateLastBook);
    $stmt->bind_param("ii", $book_input, $user_input);
    $stmt->execute();

    // Insertar en el historial
    $stmt = $conn->prepare($insertToHistorial);
    $stmt->bind_param("ii", $user_input, $book_input);
    $stmt->execute();

    // Obtener los detalles del usuario
    $stmt = $conn->prepare($updateLocalStorageUser); // Usar la consulta correcta
    $stmt->bind_param("i", $user_input);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'message' => 'Libro agregado correctamente y último libro actualizado',
            'user' => [
                'id' => $user['IdUsuario'],
                'name' => $user['Nombre'],
                'email' => $user['Email'],
                'sexo' => $user['Sexo'],
                'dificultad' => $user['DificultadMisiones'],
                'racha' => $user['Racha'],
                'lastBook' => $user['UltimoLibro']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
    }
    $stmt->close();
}
$conn->close();
exit;
?>