<?php
// /api/getProgress.php
header('Content-Type: application/json');
session_start();
try {
    $db = new PDO('mysql:host=localhost;dbname=Halibri;charset=utf8','root','',[
        PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION
    ]);
    $u = $_SESSION['user_id'] ?? 0;
    $b = intval($_GET['book_id'] ?? 0);
    if (!$u||!$b) { echo json_encode(['page'=>0,'percent'=>0]); exit; }

    $stmt = $db->prepare("
      SELECT UltimaPag, Porcentaje
        FROM UltimaPagina
       WHERE IdUsuario=:u AND IdLibro=:b
       LIMIT 1
    ");
    $stmt->execute([':u'=>$u,':b'=>$b]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: ['UltimaPag'=>0,'Porcentaje'=>0];

    echo json_encode([
      'page'    => (int)$row['UltimaPag'],
      'percent' => (int)$row['Porcentaje'],
      'book_id' => $b,
      'user_id' => $u
    ]);
} catch(PDOException $e) {
    echo json_encode(['page'=>0,'percent'=>0]);
}
