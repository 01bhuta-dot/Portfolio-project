const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve index.html on the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});
// Initialize Database Table and Seed Data from schema.sql
const schemaPath = path.join(__dirname, 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

db.exec(schemaSql, (err) => {
    if (err) {
        console.error('Error executing schema:', err.message);
    } else {
        console.log('Database tables and seed data initialized successfully.');
    }
});

// =======================
// CRUD API ROUTES
// =======================

// 1. READ: Get all portfolio items
app.get('/api/portfolio', (req, res) => {
    const query = 'SELECT * FROM portfolio';
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// 2. CREATE: Add a new portfolio item
app.post('/api/portfolio', (req, res) => {
    const { title, description, technologies, link } = req.body;
    if (!title || !description || !technologies) {
        res.status(400).json({ error: 'Title, description, and technologies are required.' });
        return;
    }

    const query = 'INSERT INTO portfolio (title, description, technologies, link) VALUES (?, ?, ?, ?)';
    const params = [title, description, technologies, link || ''];

    db.run(query, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success',
            data: { id: this.lastID, title, description, technologies, link }
        });
    });
});

// 3. UPDATE: Edit an existing portfolio item
app.put('/api/portfolio/:id', (req, res) => {
    const { title, description, technologies, link } = req.body;
    const query = 'UPDATE portfolio SET title = ?, description = ?, technologies = ?, link = ? WHERE id = ?';
    const params = [title, description, technologies, link, req.params.id];

    db.run(query, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success',
            changes: this.changes
        });
    });
});

// 4. DELETE: Remove a portfolio item
app.delete('/api/portfolio/:id', (req, res) => {
    const query = 'DELETE FROM portfolio WHERE id = ?';
    db.run(query, req.params.id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Deleted', changes: this.changes });
    });
});



const path = require('path');

// Serve all static web files from the frontend folder
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve index.html when visiting the main root link
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Start Server (Keep this at the very bottom)
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});