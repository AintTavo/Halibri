<?php
// /api/saveProgress.php
header('Content-Type: application/json');
session_start();
try {
    $db = new PDO('mysql:host=localhost;dbname=Halibri;charset=utf8','root','',[
        PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION
    ]);
    $u = isset($_SESSION['user_id']) ? intval($_SESSION['user_id']) : 0;
    $b = intval($_POST['book_id'] ?? 0);
    $p = intval($_POST['page']    ?? 0);
    $t = intval($_POST['percent'] ?? 0);

    if (!$u || !$b || $p < 1) {
      http_response_code(400);
      echo json_encode(['status'=>'error','msg'=>'Datos inválidos']);
      exit;
    }

    $sql = "
      INSERT INTO UltimaPagina (IdUsuario, IdLibro, UltimaPag, Porcentaje)
      VALUES (:u,:b,:p,:t)
      ON DUPLICATE KEY UPDATE
        UltimaPag   = VALUES(UltimaPag),
        Porcentaje  = VALUES(Porcentaje)
    ";
    $stmt = $db->prepare($sql);
    $stmt->execute([
      ':u'=>$u,':b'=>$b,':p'=>$p,':t'=>$t
    ]);
    echo json_encode(['status'=>'ok']);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['status'=>'error','msg'=>$e->getMessage()]);
}
