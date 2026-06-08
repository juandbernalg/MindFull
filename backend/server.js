import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import { randomUUID } from 'crypto';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',             
    password: '', 
    database: 'mindfull'    
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('¡Conectado exitosamente a la base de datos de MindFull!');
});


app.get('/api/tareas', (req, res) => {
    const id_usuario = req.query.id_usuario;
    if (!id_usuario) {
        return res.status(400).json({ error: 'id_usuario es requerido' });
    }

    const query = 'SELECT * FROM tareas WHERE id_usuario = ? ORDER BY orden_prioridad ASC';
    db.query(query, [id_usuario], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


app.post('/api/tareas', (req, res) => {
    const { id_usuario, titulo, duracion_minutos, categoria, orden_prioridad, es_urgente, estado } = req.body;

    if (!id_usuario || !titulo) {
        return res.status(400).json({ error: 'Faltan campos requeridos: id_usuario y titulo' });
    }

    const allowedCategories = ['Trabajo', 'Personal', 'Estudio', 'Equipo'];
    const categoriaFinal = allowedCategories.includes(categoria)
        ? categoria
        : 'Personal';
    const duracionFinal = duracion_minutos ? parseInt(duracion_minutos, 10) : 30;

    const query = `INSERT INTO tareas (id_usuario, titulo, ` +
                   `duración_minutos, categoria, orden_prioridad, es_urgente, estado) ` +
                   `VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [
        id_usuario,
        titulo,
        duracionFinal,
        categoriaFinal,
        orden_prioridad || 0,
        es_urgente ? 1 : 0,
        estado || 'pendiente'
    ], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Tarea guardada', id_tarea: result.insertId });
    });
});


// Endpoint para crear un usuario
app.post('/api/usuarios', (req, res) => {
    const { id_usuario, nombre, email, fecha_nacimiento, limite_horas_productividad, estado_cuenta } = req.body;
    const userId = id_usuario || randomUUID();

    if (!nombre || !fecha_nacimiento) {
        return res.status(400).json({ error: 'Faltan campos requeridos: nombre y fecha_nacimiento' });
    }

    const userEmail = email || `${userId}@mindfull.local`;

    const query = `INSERT INTO usuarios (id_usuario, nombre, email, fecha_nacimiento, limite_horas_productividad, estado_cuenta) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [
        userId,
        nombre,
        userEmail,
        fecha_nacimiento,
        limite_horas_productividad || 1,
        estado_cuenta != null ? estado_cuenta : 1
    ], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Usuario creado', id_usuario: userId });
    });
});

// Obtener usuario por id (params)
app.get('/api/usuarios/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM usuarios WHERE id_usuario = ? LIMIT 1';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results || results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(results[0]);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor de MindFull corriendo en http://localhost:${PORT}`);
});