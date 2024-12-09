<?php
// Configuración de la conexión
$host = "localhost";
$user = "root";
$password = "";
$database = "halibri";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta SQL
    $sql = "
        SELECT 
            Libro.IdLibro,
            Libro.Titulo,
            Libro.RutaEPUB,
            Libro.RutaPortada,
            Libro.Autor,
            Libro.DiaDePublicacion,
            GROUP_CONCAT(Genero.NombreGenero) AS Generos
        FROM 
            Libro
        LEFT JOIN 
            GeneroLibro ON Libro.IdLibro = GeneroLibro.IdLibro
        LEFT JOIN 
            Genero ON GeneroLibro.IdGenero = Genero.IdGenero
        GROUP BY 
            Libro.IdLibro
        ;
    "; // La consulta SQL

    // Preparar y ejecutar la consulta
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Obtener resultados
    $libros = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $libros[] = [
            "id" => $row["IdLibro"],
            "titulo" => $row["Titulo"],
            "rutaEPUB" => $row["RutaEPUB"],
            "rutaPortada" => $row["RutaPortada"],
            "autor" => $row["Autor"],
            "diaDePublicacion" => $row["DiaDePublicacion"],
            "generos" => $row["Generos"] ? explode(",", $row["Generos"]) : []
        ];
    }

    // Responder con JSON
    echo json_encode(['success' => true, 'libros' => $libros]);
} catch (PDOException $e) {
    // Manejo de errores en PHP
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
