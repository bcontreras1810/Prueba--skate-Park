const pool = require("./dbConfig.js"); // Importar pool de conexiones

// Esta función se encarga de realizar la inserción de un nuevo skater en la base de datos
const registrarSkater = async (req) => {
    try {
        const { email, nombre, password, anos_experiencia, especialidad} = req.body;
        const foto = req.files && req.files.foto; //Obtiene el archivo de la solicitud.

        if (!foto) {
            throw new Error('No se ha encontrado ningún archivo');
        }
        //Verificación de archivos recibidos desde el formulario.
        console.log('Archivos recibidos:', req.files);
        console.log('Datos del formulario:', req.body);
        console.log('Archivo recibido:', foto);

        const filePath = 'public/assets/img/' + foto.name; //Ruta donde se guarda la imagen.
        await foto.mv(filePath); //Mueve el archivo al servidor

        //Se insertan los datos en la tabla skaters.
        const query = `
            INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado)
            VALUES ($1, $2, $3, $4, $5, $6, 'En revision')
            RETURNING *;`;

        const result = await pool.query(query, [email, nombre, password, anos_experiencia, especialidad, filePath]);

        //Registro exitoso del skater boy.
        console.log("Nuevo skater registrado:", result.rows[0]);
        return `Skater registrado exitosamente. <a href='http://localhost:3000/'">Ir a la página principal</button> <img style="width: 80%;" src="assets/img/descarga.png" alt="">`;
    } catch (error) {
        console.error("Error al registrar skater:", error);
        throw new Error("Error al registrar skater.");
    }
};

//Función para autenticar skater.
async function autenticarSkater(email, password) {
    try {
        const query = `
            SELECT * FROM skaters
            WHERE email = $1 AND password = $2;
        `;
        const result = await pool.query(query, [email, password]);

        if (result.rows.length === 0) {
            throw new Error('Credenciales incorrectas. Por favor, verifica tu nombre de Skater y contraseña.');
        }

        // Devolver los datos del skater junto con el resultado de la autenticación
        return { skater: result.rows[0], authenticated: true };
    } catch (error) {
        throw new Error('Error al autenticar Skater: ' + error.message);
    }
};

const obtenerSkaterPorId = async (userId) => {
    const query = ` SELECT * FROM skaters WHERE id = $1;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
}

 //Consultas.
 const consultar = async () => {
    const result = await pool.query("SELECT * FROM skaters");
    return result.rows;
};


//Crear una función asíncrona llamada editar que reciba como parámetros los datos.
const editarSkater = async (id, req) => {
    try {
        if (!req.body) {
            throw new Error("No hay datos para editar.");
        }
        const {nombre, password, anos_experiencia, especialidad} = req.body;
        const query = `UPDATE skaters SET nombre = $2, password = $3, anos_experiencia = $4, especialidad = $5 WHERE id = $1 RETURNING *`;
        const result = await pool.query(query, [id, nombre, password, anos_experiencia, especialidad]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al editar skater:", error);
        throw new Error("Error al editar skater.");
    }

};
// Crear una función asíncrona llamada “eliminar” que reciba un parámetro llamado “nombre”.
const eliminarSkater = async (id) => {
    try {
        // Paso 2: Realizar una consulta SQL que tenga por interpolación el parámetro nombre para Skater el registro de un ejercicio.
    const result = await pool.query(`DELETE FROM skaters WHERE id = $1`, [id]);
    return result.rows;
    } catch (error) {
       console.error("Error al eliminar skater:", error);
       throw new Error("Error al eliminar skater."); 
    }
    
};

const editarEstado = async (id, estado) => {
    try {
        const query = `UPDATE skaters SET estado = $2 WHERE id = $1 RETURNING *`;
        const result = await pool.query(query, [id, estado]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al editar el estado:", error);
        throw new Error("Error al editar el estado.");
    }
}
//Exportar la función registrarSkater
module.exports = { registrarSkater, autenticarSkater, obtenerSkaterPorId, consultar, editarSkater, eliminarSkater, editarEstado};