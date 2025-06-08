<?php
// Configuración de la conexión
$host = "localhost";
$user = "root";
$password = "";
$database = "halibri";

$conn = new mysqli($host, $user, $password, $database);

// Verificar la conexión
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_input = filter_var($_POST['id'], FILTER_VALIDATE_INT);

    if (!$user_input) {
        echo json_encode(["success" => false, "error" => "Invalid user ID."]);
        exit;
    }

    // Consulta para obtener libros recomendados
    $sql = "
        SELECT
            l.IdLibro,
            l.Titulo,
            l.Autor,
            l.RutaPortada,
            l.DiaDePublicacion,
            GROUP_CONCAT(DISTINCT g.NombreGenero) AS Generos,
            CASE WHEN MAX(ll.IdUsuario) IS NOT NULL THEN 'Sí' ELSE 'No' END AS EnLista
        FROM
            GeneroUsuario gfu
        INNER JOIN GeneroLibro gl     ON gfu.IdGenero = gl.IdGenero
        INNER JOIN Libro l            ON gl.IdLibro = l.IdLibro
        LEFT JOIN GeneroLibro gl2     ON l.IdLibro = gl2.IdLibro
        LEFT JOIN Genero g            ON gl2.IdGenero = g.IdGenero
        LEFT JOIN ListaLibros ll      ON ll.IdUsuario = gfu.IdUsuario
                                    AND ll.IdLibro   = l.IdLibro
        WHERE
            gfu.IdUsuario = ?
        GROUP BY
            l.IdLibro,
            l.Titulo,
            l.Autor,
            l.RutaPortada,
            l.DiaDePublicacion
    ";


    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_input);
    $stmt->execute();
    $result = $stmt->get_result();

    // Arreglo para almacenar los libros recomendados
    $recomendedBooks = [];
    while ($row = $result->fetch_assoc()) {
        $recomendedBooks[] = [
            "id" => $row["IdLibro"],
            "titulo" => $row["Titulo"],
            "autor" => $row["Autor"],
            "rutaPortada" => $row["RutaPortada"],
            "diaDePublicacion" => $row["DiaDePublicacion"],
            "generos" => $row["Generos"] ? explode(",", $row["Generos"]) : [],
            "enLista" => $row["EnLista"]
        ];
    }

    // Si no hay recomendaciones, devolver todos los libros
    if (count($recomendedBooks) > 0) {
        echo json_encode(['success' => true, 'libros' => $recomendedBooks]);
    } else {
        $sql2 = "
            SELECT
                Libro.IdLibro,
                Libro.Titulo,
                Libro.RutaPortada,
                Libro.Autor,
                Libro.DiaDePublicacion,
                GROUP_CONCAT(DISTINCT Genero.NombreGenero) AS Generos,
                CASE WHEN MAX(ListaLibros.IdUsuario) IS NOT NULL THEN 'Sí' ELSE 'No' END AS EnLista
            FROM Libro
            LEFT JOIN GeneroLibro     ON Libro.IdLibro = GeneroLibro.IdLibro
            LEFT JOIN Genero          ON GeneroLibro.IdGenero = Genero.IdGenero
            LEFT JOIN ListaLibros     ON ListaLibros.IdLibro   = Libro.IdLibro
                                    AND ListaLibros.IdUsuario = ?
            GROUP BY
                Libro.IdLibro,
                Libro.Titulo,
                Libro.RutaPortada,
                Libro.Autor,
                Libro.DiaDePublicacion
        ";


        $stmt = $conn->prepare($sql2);
        $stmt->bind_param("i", $user_input);
        $stmt->execute();
        $result2 = $stmt->get_result();

        // Arreglo para almacenar todos los libros
        $allBooks = [];
        while ($row = $result2->fetch_assoc()) {
            $allBooks[] = [
                "id" => $row["IdLibro"],
                "titulo" => $row["Titulo"],
                "autor" => $row["Autor"],
                "rutaPortada" => $row["RutaPortada"],
                "diaDePublicacion" => $row["DiaDePublicacion"],
                "generos" => $row["Generos"] ? explode(",", $row["Generos"]) : [],
                "enLista" => $row["EnLista"]
            ];
        }

        if (count($allBooks) > 0) {
            echo json_encode(['success' => true, 'libros' => $allBooks]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No hay libros en la base de datos']);
        }
    }
}
$stmt->close();
$conn->close();
exit;
