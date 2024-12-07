<?php
// Variables para conexión con la base de datos
$host = 'localhost';
$db = 'halibri';
$user = 'root';
$pass = '';

try {
    // Conectar a la base de datos
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Recibir datos del formulario
    $nombre = $_POST['nombre'] ?? '';
    $email = $_POST['email'] ?? '';
    $sexo = $_POST['sexo'] ?? '';
    $password = $_POST['password'] ?? '';

    // Validaciones adicionales
    if (empty($nombre) || empty($email) || empty($sexo) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Todos los campos son obligatorios.']);
        exit;
    }

    // Validar formato del correo (por seguridad adicional)
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'El correo electrónico no es válido.']);
        exit;
    }

    // Encriptar la contraseña
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Preparar y ejecutar la consulta
    $stmt = $pdo->prepare("
        INSERT INTO Usuario (Nombre, Email, Sexo, Password_Bcrypt)
        VALUES (:nombre, :email, :sexo, :password)
    ");

    $stmt->execute([
        ':nombre' => $nombre,
        ':email' => $email,
        ':sexo' => $sexo,
        ':password' => $hashedPassword,
    ]);

    // Respuesta en caso de éxito
    echo json_encode(['status' => 'success', 'message' => 'Usuario creado exitosamente.']);
} catch (PDOException $e) {
    // Manejo específico de errores de clave única
    if ($e->getCode() == 23000) {
        echo json_encode(['status' => 'error', 'message' => 'El nombre o correo ya está registrado.']);
    } else {
        // Mensaje genérico para otros errores
        echo json_encode(['status' => 'error', 'message' => 'Error al crear el usuario. Por favor, inténtalo más tarde.']);
    }
}
