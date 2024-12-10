CREATE DATABASE Halibri;
USE Halibri;

-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Tablas Principales o fuertes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- Esta tabla guarda los datos que pude llegar a tener el libro, el contenido del libro se guardara en un json para una mas facil manipulacion
CREATE TABLE Libro(
    IdLibro INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Titulo VARCHAR(255) NOT NULL,
    RutaEPUB VARCHAR(255) NOT NULL,
    RutaPortada VARCHAR(255) NOT NULL,
    Autor VARCHAR(100) NOT NULL DEFAULT 'Anonimo',
    DiaDePublicacion DATE
);


-- Esta tabla guarda los datos de los usuarios
CREATE TABLE Usuario(
    IdUsuario MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Sexo ENUM('F', 'M', 'N') NOT NULL,         -- F es para mujeres, M es para hombres, y N es para si prefieren no decirlo
    Password_Bcrypt VARCHAR(60) NOT NULL,
    DificultadMisiones ENUM('E','N','H','X') DEFAULT 'E', -- E es para facil, N es para normal, H es para dificil, X es para Extrema
    Racha SMALLINT UNSIGNED DEFAULT 0,
    UltimoLibro INT UNSIGNED,
    FOREIGN KEY (UltimoLibro) REFERENCES Libro(IdLibro) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Esta tabla los tipos de genero que hay
CREATE TABLE Genero(
    IdGenero SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NombreGenero VARCHAR(255) NOT NULL
);

CREATE TABLE MisionesDiarias(
    Dificultad ENUM('E','N','H','X'),
    Tipo ENUM('T','P','G'),
    Cantidad SMALLINT
);


-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Tablas secundarias o debiles>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- Esta tabla esta hecha para almacenar la ultima pagina a la que accedio el usuario 
CREATE TABLE UltimaPagina(
    IdUsuario MEDIUMINT UNSIGNED,
    IdLibro INT UNSIGNED,
    UltimaPag INT UNSIGNED,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (IdLibro) REFERENCES Libro(IdLibro) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Esta tabla almacena la lista de libros fdvoritos de cada usuario
CREATE TABLE HistorialLibroUsr(
    IdHistorial INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    IdUsuario MEDIUMINT UNSIGNED,
    IdLibro INT UNSIGNED,
    dia DATE,
    hora TIME,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (IdLibro) REFERENCES Libro(IdLibro) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Esta tabla almacena la lista de libros por leer de cada usuario
CREATE TABLE ListaLibros(
    IdUsuario MEDIUMINT UNSIGNED,
    IdLibro INT UNSIGNED,
    IdLista INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    PRIMARY KEY(IdUsuario, IdLibro),
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (IdLibro) REFERENCES Libro(IdLibro) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Esta tabla almacena el libro y los generos a los que pertenece
CREATE TABLE GeneroLibro(
    IdLibro INT UNSIGNED,
    IdGenero SMALLINT UNSIGNED,
    FOREIGN KEY (IdLibro) REFERENCES Libro(IdLibro) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (IdGenero) REFERENCES Genero(IdGenero) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Esta tabla guarda los generos favoritos de cada usuario
CREATE TABLE GeneroUsuario (
    IdUsuario MEDIUMINT UNSIGNED,
    IdGenero SMALLINT UNSIGNED,
    PRIMARY KEY (IdUsuario, IdGenero),
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (IdGenero) REFERENCES Genero (IdGenero) ON DELETE CASCADE ON UPDATE CASCADE
);

-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Inserts a la base de datos>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
INSERT INTO 
    Genero (NombreGenero)
    VALUES 
        ('Ficción'),
        ('No Ficción'),
        ('Ciencia Ficción'),
        ('Fantasía'),
        ('Misterio'),
        ('Suspenso'),
        ('Terror'),
        ('Romántico'),
        ('Aventura'),
        ('Biografía'),
        ('Historia'),
        ('Drama'),
        ('Comedia'),
        ('Poesía'),
        ('Ensayo'),
        ('Literatura Clásica'),
        ('Ciencia'),
        ('Psicología'),
        ('Filosofía'),
        ('Política'),
        ('Arte'),
        ('Tecnología'),
        ('Espionaje'),
        ('Juvenil'),
        ('Infantil'),
        ('Thriller');


INSERT INTO
    Libro (Titulo, RutaEPUB, RutaPortada, Autor, DiaDePublicacion)
    VALUES
        (
            '2001: Una odisea espacial', 
            '../ePUBs/2001OdiseaEspacial.epub',
            '../IMG/Portada_2001OdiseaEspacial.jpg',
            'Arthur Charles Clarke',
            '1968-07-11'
        ),
        (
            'Corazón de Tinta', 
            '../ePUBs/CorazonDeTinta.epub',
            '../IMG/Portada_CorazonDeTinta.jpg',
            'Cornelia Funke',
            '2003-09-23'
        ),
        (
            'Crimen y Castigo', 
            '../ePUBs/CrimenYCastigo.epub',
            '../IMG/Portada_Crimenycastigo.jpg',
            'Fiódor Dostoyevski',
            '1866-01-01'
        ),
        (
            'Cuentos de Navidad', 
            '../ePUBs/CuentosDeNavidad.epub',
            '../IMG/Portada_CuentosDeNavidad.jpg',
            'Charles Dickens',
            '1843-12-19'
        ),
        (
            'El horror de Dunwich', 
            '../ePUBs/ElHorrorDeDunwich.epub',
            '../IMG/Portada_ElHorrorDeDunwich.jpg',
            'Howard Phillips Lovecraft',
            '1924-04-01'
        ),
        (
            'El principito', 
            '../ePUBs/ElPrincipito.epub',
            '../IMG/Portada_ElPrincipito.jpg',
            'Antoine de Saint-Exupéry',
            '1943-04-06'
        ),
        (
            'Eureka', 
            '../ePUBs/Eureka.epub',
            '../IMG/Portada_Eureka.jpg',
            'Edgar Allan Poe',
            '1848-07-01'
        ),
        (
            'Harry  Potter: La orden del Fenix', 
            '../ePUBs/HPLaOrdenDelFenix.epub',
            '../IMG/Portada_HPLaOrdenDelFenix.jpg',
            'J. K. Rowling',
            '2003-06-21'
        ),
        (
            'Las Olas', 
            '../ePUBs/LasOlas.epub',
            '../IMG/Portada_LasOlas.jpg',
            'Virginia Woolf',
            '1931-10-08'
        ),
        (
            'Moby Dick', 
            '../ePUBs/MobyDick.epub',
            '../IMG/Portada_Mobydick.jpg',
            'Herman Melville',
            '1851-10-18'
        ),
        (
            'Pedro Páramo', 
            '../ePUBs/PedroParamo.epub',
            '../IMG/Portada_PedroParamo.jpg',
            'Juan Rulfo',
            '1955-01-19'
        );

INSERT INTO
    GeneroLibro (IdLibro, IdGenero)
VALUES
    -- 2001: Una odisea espacial
    (1, 3), -- Ciencia Ficción
    (1, 22), -- Tecnología
    (1, 19), -- Filosofía
    -- Corazón de Tinta
    (2, 4), -- Fantasía
    (2, 24), -- Juvenil
    (2, 9), -- Aventura
    -- Crimen y Castigo
    (3, 12), -- Drama
    (3, 19), -- Filosofía
    (3, 16), -- Literatura Clásica
    -- Cuentos de Navidad
    (4, 11), -- Historia
    (4, 12), -- Drama
    (4, 13), -- Comedia
    -- El horror de Dunwich
    (5, 7), -- Terror
    (5, 5), -- Misterio
    (5, 16), -- Literatura Clásica
    -- El Principito
    (6, 25), -- Infantil
    (6, 19), -- Filosofía
    (6, 9), -- Aventura
    -- Eureka
    (7, 15), -- Ensayo
    (7, 17), -- Ciencia
    (7, 19), -- Filosofía
    -- Harry Potter: La orden del Fénix
    (8, 4), -- Fantasía
    (8, 24), -- Juvenil
    (8, 9), -- Aventura
    -- Las Olas
    (9, 12), -- Drama
    (9, 16), -- Literatura Clásica
    (9, 14), -- Poesía
    -- Moby Dick
    (10, 9), -- Aventura
    (10, 16), -- Literatura Clásica
    (10, 19), -- Filosofía
    -- Pedro Páramo
    (11, 12), -- Drama
    (11, 11), -- Historia
    (11, 16); -- Literatura Clásica