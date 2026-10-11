const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Importa el paquete cors

const app = express();
const PORT = 5000; // Elige un puerto diferente al de React (ej. 3000)

// Middlewares
app.use(cors()); // Habilita CORS para permitir peticiones desde React
app.use(express.json()); // Permite a Express manejar datos JSON en las peticiones

// Conexión MySQL
const db = mysql.createConnection({
    host: 'localhost', // Tu host de MySQL
    user: 'root', // Tu usuario de MySQL
    password: 'P4ssw0rd*2026', // Tu contraseña de MySQL
    database: 'world' // El nombre de tu base de datos
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error de conexión a MySQL:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta API de ejemplo para obtener datos
app.get('/api/paises', (req, res) => {
    const query = 'SELECT * FROM country';
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener datos' });
            return;
        }
        res.json(result); // Envía los datos como respuesta JSON a React
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});