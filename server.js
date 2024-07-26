const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const { Pool } = require('pg');
require('dotenv').config()
// Enable CORS for all origins
app.use(cors());




// // Database connection configuration
// const pool = new Pool({
//   user: process.env.pg_user,
//   host: process.env.pg_host,
//   database: process.env.pg_db,
//   password: process.env.pg_password,
//   port: 5432, // default PostgreSQL port
//   ssl: true
// });

const pool = new Pool({
  connectionString: `postgres://${process.env.pg_user}:${process.env.pg_password}@${process.env.pg_host}/${process.env.pg_db}?ssl=true`
})


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

// PGPASSWORD=Qf14a6KCdEe9IMXQ9g1qEeYeeX9x7X68 psql -h dpg-cqg1e1tds78s73c7hgm0-a.oregon-postgres.render.com -U yash_9qs8_user yash_9qs8
