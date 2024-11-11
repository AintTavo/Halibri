CREATE DATABASE Halibri;
USE Halibri;

-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Tablas Principales o fuertes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- Esta tabla guarda los datos que pude llegar a tener el libro, el contenido del libro se guardara en un json para una mas facil manipulacion
CREATE TABLE Libro(
    IdLibro INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Titulo VARCHAR(255) NOT NULL,
    RutaEPUB VARCHAR(255) NOT NULL,
    Autor VARCHAR(100) NOT NULL DEFAULT 'Anonimo',
    DiaDePublicacion DATE
);


-- Esta tabla guarda los datos de los usuarios
CREATE TABLE Usuario(
    IdUsuario MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Sexo ENUM('F', 'M', 'N') NOT NULL,         -- F es para mujeres, M es para hombres, y N es para si prefieren no decirlo
    Password_MD5 VARCHAR(32) NOT NULL,
    TamañoDeLetra ENUM('S', 'M', 'L') NOT NULL DEFAULT 'M',
    Racha SMALLINT UNSIGNED DEFAULT 0,
    UltimoLibro INT UNSIGNED,
    FOREIGN KEY (UltimoLibro) REFERENCES Libro(IdLibro) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Esta tabla los tipos de genero que hay
CREATE TABLE Genero(
    IdGenero SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NombreGenero VARCHAR(255) NOT NULL
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
CREATE TABLE LibrosFavoritos(
    IdUsuario MEDIUMINT UNSIGNED,
    IdLibro INT UNSIGNED,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (IdLibro) REFERENCES Libro(IdLibro) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Esta tabla almacena la lista de libros por leer de cada usuario
CREATE TABLE ListaLibros(
    IdUsuario MEDIUMINT UNSIGNED,
    IdLibro INT UNSIGNED,
    IdLista INT UNSIGNED NOT NULL UNIQUE,
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
CREATE TABLE GeneroFavUsr(
    IdUsuario MEDIUMINT UNSIGNED,
    IdGenero SMALLINT UNSIGNED,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (IdGenero) REFERENCES Genero(IdGenero) ON DELETE CASCADE ON UPDATE CASCADE
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
    Libro (Titulo, RutaEPUB, Autor, DiaDePublicacion)
    VALUES
        ('Pedro Páramo', '../ePUBs/Pedro Paramo.epub','Juan Rulfo','1955-07-18'),
        ('2001: Una odisea espacial', '../ePUBs/2001OdiseaEspacial.epub', 'Arthur C. Clarke', '1968-01-01');