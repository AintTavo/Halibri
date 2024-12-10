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

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $queryInput = $_POST['searchQuery'];
    
    if (!$queryInput) {
        echo json_encode(['success' => false, 'message' => 'Invalid user ID']);
        exit;
    }

    $sql = "
    SELECT DISTINCT
        L.IdLibro,
        L.Titulo,
        L.RutaPortada,
        L.Autor,
        L.DiaDePublicacion,
        GROUP_CONCAT(DISTINCT G.NombreGenero ORDER BY G.NombreGenero ASC SEPARATOR ', ') AS 'Generos'
    FROM 
        Libro L
    LEFT JOIN 
        GeneroLibro GL ON L.IdLibro = GL.IdLibro
    LEFT JOIN 
        Genero G ON GL.IdGenero = G.IdGenero
    WHERE 
        CONCAT(
            L.Titulo, ' ', 
            L.Autor, ' ', 
            IFNULL(DATE_FORMAT(L.DiaDePublicacion, '%Y-%m-%d'), ''), ' ',
            IFNULL(DATE_FORMAT(L.DiaDePublicacion, '%d/%m/%Y'), ''), ' ',
            IFNULL(G.NombreGenero, '')
        ) LIKE CONCAT('%',?, '%')
    GROUP BY 
        L.IdLibro;
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s",$queryInput);
    $stmt->execute();
    $result = $stmt->get_result();

    $SearchResult = [];

    while($row = $result->fetch_assoc()){
        $SearchResult[] = [
            "id" => $row["IdLibro"],
            "titulo" => $row["Titulo"],
            "autor" => $row["Autor"],
            "rutaPortada" => $row["RutaPortada"],
            "diaDePublicacion" => $row["DiaDePublicacion"],
            "generos" => $row["Generos"] ? explode(",", $row["Generos"]) : [],
        ];
    }

    echo json_encode(['success' => true, 'SearchResult' => $SearchResult]);
    $stmt->close();
}
$conn->close();
exit;
?>