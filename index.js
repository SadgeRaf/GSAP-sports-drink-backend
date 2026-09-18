const dotenv = require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const { Pool } = require('pg');

app.use(cors({
  origin: 'http://localhost:5173', // or whatever port your React app runs on
  credentials: true
}));
app.use(express.json());

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const pool = new Pool({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: {
        require: true,
    },
});

app.get("/", async (req, res) => {

    const client = await pool.connect();

    try {
        const result = await client.query('SELECT * FROM stuff');
        res.json(result.rows);
    } finally {
        client.release();
    }

    res.status(404);
})

// Only start the server when this file is run directly, not when imported by tests
if (require.main === module) {
    app.listen(3000, () => console.log("Server running"));
}

module.exports = { app, pool };