// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.API_PORT || 3000;

// === Middleware ===
// Enable Cross-Origin Resource Sharing for all routes
app.use(cors());
// Enable parsing of JSON request bodies
app.use(express.json());

// === PostgreSQL Connection Pool ===
// A connection pool is more efficient than creating a new client for every request.
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// === API Routes ===

// Root endpoint to confirm the API is running
app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Skyvex API!' });
});

// Endpoint to get all services from the database
app.get('/api/services', async (req, res) => {
    try {
        // Query the database for all services, ordered by their display_order
        const { rows } = await pool.query('SELECT * FROM services ORDER BY display_order ASC');
        // Send the retrieved rows as a JSON response
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching services:', error);
        // Send a generic error message if something goes wrong
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// === Start Server ===
app.listen(port, () => {
    console.log(`Skyvex API server is listening on http://localhost:${port}`);
    console.log('Database connection pool created.');
});