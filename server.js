//Servidor Express. 
const express = require('express');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
const expressFileUpload = require("express-fileupload");
// const exphbs  = require('express-handlebars');
const { registrarSkater, autenticarSkater, obtenerSkaterPorId, consultar, editarSkater, eliminarSkater, editarEstado} = require("./consultas");

//Clave secreta.
const secretKey = "Mi Llave Ultra Secreta";

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));;
//Middleware para manejar la carga de archivos.
app.use(expressFileUpload());

// //Configuración de Handlebars.
// app.set("view engine", "handlebars");

// app.engine(
//   "handlebars",
//   exphbs.engine({
//     // Directorio de layouts
//     layoutsDir: __dirname + "/views", })
// );

//Activar el servidor.
app.listen(3000 , console.log("Servidor arriba. ✌️"))

//Ruta por defecto.
app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
//Ruta fromulario de registro.
app.get("/Registro.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/Registro.html"));
});
//Ruta fromulario de Login.
app.get("/Login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/Login.html"));
});

//ruta para modificar datos 
app.get("/Datos.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/Datos.html"));
})
// Ruta para la vista del administrador
app.get("/Admin.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/Admin.html"));
});

// Ruta para manejar el registro de skaters.
app.post("/registro", async (req, res) => {
    try {
        // Llamar a la función registrarSkater desde consultas.js
        const mensaje = await registrarSkater(req);
        // Devolver el mensaje como respuesta
        res.send(mensaje);
    } catch (error) {
        console.error("Error al registrar skater:", error.message);
        res.status(500).send(error.message);
    }
});

//Ruta login y generación de token.
app.get("/login", async (req, res) => {
    try {
        const { email, password } = req.query;

        const { skater, authenticated } = await autenticarSkater(email, password);

        if (authenticated) {
            //Aquí se genera el token JWT con expiración de 2 minutos.
            const token = jwt.sign({ userId: skater.id }, secretKey, { expiresIn: '2m' });
            //Redirigir al usuario a la ruta /datos con el token como parámetro de consulta.
            res.redirect(`/datos?token=${token}`);
        } else {
            //Si la autenticación falla, redirigir al usuario a la página de inicio de sesión con un mensaje de error.
            res.redirect("/login?error=authentication_failed");
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error.message);
        res.status(401).json({ error: 'Unauthorized', message: error.message });
    }
});


//Ruta de consultas.
app.get("/skaters", async (req, res) => {
    try {
        const registros = await consultar();
        res.json(registros);
    } catch (error) {
        res.status(500).send("Algo salió mal ")
    }
});

//Ruta Datos.
app.get('/datos', (req, res) => {
    //Asegurar que token sea válido
    jwt.verify(req.query.token, secretKey, (err, decoded) => {
        if (err) {
            //Control de errores.
            res.status(401).send({
                error: '401 Unauthorized!!!',
                message: err.message,
            });
        } else {
            //Adjuntar el ID de usuario al objeto req
            req.userId = decoded.userId;
            //Si todo va bien, mostar página.
            res.sendFile(path.join(__dirname, "/Datos.html"));
        }
    });
});

//Ruta para obtener los datos del skater por el id.
app.get("/skater", async (req, res) => {
    try {
        //Obtener el token del encabezado de autorización
        const token = req.headers.authorization.split(' ')[1];     
        if (!token) {
            throw new Error('Token JWT no proporcionado');
        }   
        //Decodificar el token para obtener el ID de usuario
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userId;
        //Consultar los datos del skater usando el ID de usuario
        const skaterData = await obtenerSkaterPorId(userId);
        if (skaterData.length === 0) {
            throw new Error('Skater no encontrado');
        }
        const skater = skaterData[0];
         res.json(skater);
    } catch (error) {
        console.error("Error al obtener los datos del skater:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// //Ruta para editar los datos de un skater
app.put("/editardatos/:id", async(req, res) =>{
    try {
        const id = req.params.id;
        const { nombre, password, anos_experiencia, especialidad } = req.body;
        const resultado = await editarSkater(id, req, nombre, password, anos_experiencia, especialidad)
        res.json(resultado)
    } catch (error) {
        console.error("Error al editar skater:", error);
        res.status(500).json("Error al editar datos ");
    }
});

//Ruta para borrar los datos de un skater
app.delete("/eliminardatos", async (req, res) => {
    try {
        const { id } = req.query
        const respuesta = await eliminarSkater(id)
        res.json(respuesta)
    } catch (error) {
        console.error("Error al borrar skater:", error);
        res.status(500).json("Error al borrar la cancion");
    }
})

// Ruta para actualizar el estado adicional del skater
app.put("/actualizarEstado/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { estadoAdicional } = req.body;
       await editarEstado(id, estadoAdicional);
        res.status(200).send("Estado adicional del skater actualizado correctamente.");
        console.log("Estado adicional del skater actualizado correctamente.");
    } catch (error) {
        console.error("Error al actualizar el estado adicional del skater:", error.message);
        res.status(500).send("Error al actualizar el estado adicional del skater.");
    }
});

app.get("*", (req, res) => {
    //
    res.send("Esta página no existe");
  });
  