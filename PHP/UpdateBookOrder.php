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
    $userId = filter_var($_POST['userId'], FILTER_VALIDATE_INT);
    $orderData = json_decode($_POST['orderData'], true);

    if (!$userId || !$orderData) {
        echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
        exit;
    }

    $conn->begin_transaction();
    try {
        foreach ($orderData as $item) {
            $bookId = filter_var($item['bookId'], FILTER_VALIDATE_INT);
            $newOrder = filter_var($item['newOrder'], FILTER_VALIDATE_INT);
            
            if (!$bookId || $newOrder === false) {
                throw new Exception("Datos de orden inválidos");
            }

            $stmt = $conn->prepare("UPDATE ListaLibros SET Orden = ? WHERE IdUsuario = ? AND IdLibro = ?");
            $stmt->bind_param("iii", $newOrder, $userId, $bookId);
            $stmt->execute();
            $stmt->close();
        }
        
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Orden actualizado correctamente']);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}

$conn->close();
exit;
?>