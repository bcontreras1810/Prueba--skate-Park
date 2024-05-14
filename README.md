 <h1>README - Skate Park</h1>
    <p>Este proyecto es una prueba práctica para desarrollar una plataforma web que permita a los participantes registrarse y revisar el estado de su solicitud para una competencia de Skate organizada por la Municipalidad de Santiago.</p>

  <h2>Habilidades Evaluadas</h2>
    <ul>
        <li>Crear una API REST con el Framework Express</li>
        <li>Ofrecer la funcionalidad de carga de archivos con express-fileupload</li>
        <li>Implementar seguridad y restricción de recursos o contenido con JWT</li>
    </ul>

   <h2>Descripción</h2>
    <p>El objetivo es desarrollar un sistema completo que consolide las competencias de un Full Stack Developer, utilizando las siguientes tecnologías y herramientas:</p>
    <ul>
        <li>Express</li>
        <li>PostgreSQL</li>
        <li>JWT</li>
        <li>Express-fileupload</li>
    </ul>

  <h2>Consideraciones</h2>
    <ul>
        <li>El sistema debe permitir registrar nuevos participantes.</li>
        <li>Crear una vista para que los participantes puedan iniciar sesión con su correo y contraseña.</li>
        <li>Permitir a los participantes modificar sus datos (excepto el correo electrónico y su foto) después de iniciar sesión. Esta vista debe estar protegida con JWT y los datos deben ser extraídos del token.</li>
        <li>La vista raíz debe mostrar todos los participantes registrados y su estado de revisión.</li>
        <li>La vista del administrador debe mostrar los participantes registrados y permitir aprobarlos para cambiar su estado.</li>
    </ul>

   <h2>Base de Datos</h2>
    <p>Se debe usar PostgreSQL para persistir la información de los usuarios. Utiliza las siguientes sentencias SQL para la creación de la base de datos y la tabla de participantes:</p>
    <pre><code>CREATE DATABASE skatepark;

CREATE TABLE skaters (
    id SERIAL PRIMARY KEY, 
    email VARCHAR(50) NOT NULL, 
    nombre VARCHAR(25) NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    anos_experiencia INT NOT NULL, 
    especialidad VARCHAR(50) NOT NULL, 
    foto VARCHAR(255) NOT NULL, 
    estado VARCHAR(20) NOT NULL
);</code></pre>

   <h2>Requerimientos</h2>
    <ol>
        <li>Crear una API REST con el Framework Express (3 Puntos)</li>
        <li>Ofrecer la funcionalidad Upload File con express-fileupload (2 Puntos)</li>
        <li>Implementar seguridad y restricción de recursos o contenido con JWT (2 Puntos)</li>
    </ol>

   <h2>Guía de Instalación y Uso</h2>
    <h3>Pre-requisitos</h3>
    <ul>
        <li>Node.js</li>
        <li>PostgreSQL</li>
    </ul>

  <h3>Instalación</h3>
    <ol>
        <li>Clona el repositorio</li>
        <pre><code>git clone https://github.com/bcontreras1810/Prueba--skate-Park.git</code></pre>
        <li>Instala las dependencias</li>
        <pre><code>cd skatepark
npm install</code></pre>
        <li>Crea la base de datos y la tabla ejecutando las sentencias SQL proporcionadas.</li>
        <li>Crea un archivo <code>.env</code> en la raíz del proyecto con las siguientes variables:</li>
        <pre><code>DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=skatepark
JWT_SECRET=tu_secreto_jwt</code></pre>
        <li>Inicia la aplicación</li>
        <pre><code>npm start</code></pre>
    </ol>

   <h3>Uso</h3>
    <p>Accede a la aplicación en <a href="http://localhost:3000">http://localhost:3000</a> para ver la lista de participantes registrados y su estado de revisión.</p>
</body>
</html>
