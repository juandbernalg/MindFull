import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { exec } from 'child_process';

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

    const query = 'SELECT * FROM tareas WHERE id_usuario = ? AND estado = ? ORDER BY orden_prioridad ASC';
    db.query(query, [id_usuario, 'pendiente'], (err, results) => {
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

// Comparar dos tareas usando el predictor Python (ejecuta predict.py)
app.post('/api/compare-tasks', (req, res) => {
    const { a, b } = req.body;
    if (!a || !b) {
        return res.status(400).json({ error: 'Se requieren objetos `a` y `b` en el body' });
    }

    // serializar y escapar
    const aArg = JSON.stringify(a).replace(/"/g, '\\"');
    const bArg = JSON.stringify(b).replace(/"/g, '\\"');
    const cmd = `python backend/ai/predict.py --a "${aArg}" --b "${bArg}"`;

    exec(cmd, { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
        if (err) {
            console.error('Compare error exec:', err, stderr);
            // Fallback JS comparator when Python or model is not available
            try {
                const score = (t) => {
                    const dur = Number(t.duracion_minutos || t.duracion_minutos || 30) || 30;
                    const urgent = Number(t.es_urgente || 0) ? 1.5 : 1.0;
                    // simple heuristic: longer + urgent increases importance
                    return dur * urgent;
                };
                const sa = score(a);
                const sb = score(b);
                const winner = sa >= sb ? 'A' : 'B';
                const prob = Math.min(0.99, Math.max(0.01, Math.abs(sa - sb) / Math.max(sa, sb || 1)));
                return res.json({ winner, prob_A_more_important: winner === 'A' ? prob : 1 - prob, using_tf: false, fallback: true });
            } catch (fallbackErr) {
                console.error('Fallback comparator failed:', fallbackErr);
                return res.status(500).json({ error: 'Error ejecutando el predictor Python y fallback falló', details: (stderr || err.message) });
            }
        }

        try {
            const out = JSON.parse(stdout);
            return res.json(out);
        } catch (parseErr) {
            console.error('Parse error from predictor stdout:', parseErr, stdout);
            // attempt fallback parse if stdout contains json-like content
            try {
                const out = JSON.parse(stdout.trim());
                return res.json(out);
            } catch (_) {
                return res.status(500).json({ error: 'Respuesta inválida del predictor', raw: stdout });
            }
        }
    });
});

// Marcar tarea como completada
app.post('/api/tareas/:id/complete', (req, res) => {
    const id = req.params.id;
    const query = 'UPDATE tareas SET estado = ?, orden_prioridad = ? WHERE id_tarea = ?';
    db.query(query, ['hecha', 0, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
        res.json({ message: 'Tarea marcada como completada', id_tarea: id });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor de MindFull corriendo en http://localhost:${PORT}`);
});