const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Points directly to your database subfolder required by the assessment
const dbPath = path.resolve(__dirname, 'database/portfolio.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database 5:', err.message);
    } else {
        console.log('Connected to the SQLite portfolio database.');
    }
});

module.exports = db;