//conexión con base de datos.
const { Pool } = require("pg");
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool ({
user: process.env.DB_USER,
host: process.env.DB_HOST,
database: "skatepark",
password: process.env.DB_PASSWORD,
port: 5432,
});

//Funcion para verificar la conexion a la base de datos
const conectarDB = async () => {
    try {
        const res = await pool.query(`SELECT NOW()`);
        console.log("Conexion exitosa a la base de datos, fecha y hora actuales:", res.rows[0]);
    } catch (error) {
        console.error("Error al conectar a la Base de datos", error);
    }
};
//Llamar a la funcion de conectarDB
conectarDB();

//Exportar módulo.
module.exports = pool;