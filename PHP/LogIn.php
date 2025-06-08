<?php
// login.php
$servername = "localhost";
$username = "root"; // Cambia según tu configuración
$password = ""; // Cambia según tu configuración
$dbname = "Halibri";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Comprobar la conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_input = $_POST['username'];
    $user_password = $_POST['password'];

    // Buscar el usuario en la base de datos (puede ser por nombre o correo)
    $sql = "SELECT * FROM Usuario WHERE Nombre = ? OR Email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $user_input, $user_input);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Verificar la contraseña
        if (password_verify($user_password, $user['Password_Bcrypt'])) {

            // Iniciar sesión
            session_start();
            $_SESSION['user_id'] = $user['IdUsuario'];

            // Devuelve datos del usuario en formato JSON
            echo json_encode([
                'success' => true,
                'message' => 'Iniciado sesión correctamente',
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
            echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
    }

    $stmt->close();
}
$conn->close();
