const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const { Pool } = require('pg');
require('dotenv').config()
// Enable CORS for all origins
app.use(cors());




// // Database connection configuration
const pool = new Pool(
  
  process.env.NODE_ENV === 'prod' ?
  {
    connectionString: process.env.pg_prod_conn
  }:
  {
  user: process.env.pg_user,
  host: process.env.pg_host,
  database: process.env.pg_db,
  password: process.env.pg_password,
  port: 5432, // default PostgreSQL port
  ssl: true
});

console.log(process.env.NODE_ENV)


// Define a GET endpoint
app.get('/', async  (req, res) => {
  // res.send('Hello, World!');
  const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.send(result.rows[0]);
});

// Start the server
app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  const client = await pool.connect();
  const result = await client.query('SELECT NOW()');
  console.log(result);
  client.release();
  // res.send(result.rows[0]);
});

