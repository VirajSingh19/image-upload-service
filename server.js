const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const { Pool } = require('pg');
const multer = require('multer');
require('dotenv').config()
// Enable CORS for all origins
app.use(cors());


const pool = new Pool({
  // connectionString: `postgres://${process.env.pg_user}:${process.env.pg_password}@${process.env.pg_host}/${process.env.pg_db}?ssl=true`
  connectionString: "postgresql://yash_9qs8_user:Qf14a6KCdEe9IMXQ9g1qEeYeeX9x7X68@dpg-cqg1e1tds78s73c7hgm0-a/yash_9qs8"
})

// Define a GET endpoint
app.get('/', async  (req, res) => {
  // res.send('Hello, World!');
  const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.send(result.rows[0]);
});


const storage = multer.memoryStorage(); // Store files in memory as Buffer objects
const upload = multer({ storage: storage });

// Image upload endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const fileSize = file.size;
    const fileData = file.buffer; // The binary data of the file
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO images (filename, file_size, image_data) VALUES ($1, $2, $3) RETURNING *',
      [file.originalname, fileSize, fileData]
    );
    client.release();
    delete result.rows[0]['image_data'];
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading file');
  }
});


// Image retrieval endpoint
app.get('/images', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id,filename, file_size FROM images');
    client.release();
    if (result.rows.length > 0) {
      const image = result.rows;
      res.send(image);
    } else {
      res.status(404).send('Image not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving file');
  }
});



// Image retrieval endpoint
app.get('/image/:id', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM images WHERE id = $1', [req.params.id]);
    client.release();
    if (result.rows.length > 0) {
      const image = result.rows[0];
      res.setHeader('Content-Type', 'image/jpeg'); // Adjust the MIME type as necessary
      res.send(image.image_data);
    } else {
      res.status(404).send('Image not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving file');
  }
});


// Image deletion endpoint
app.delete('/image/:id', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM images WHERE id = $1 RETURNING *', [req.params.id]);
    client.release();
    if (result.rowCount > 0) {
      res.status(200).send('Image deleted successfully');
    } else {
      res.status(404).send('Image not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting file');
  }
});


// Start the server
app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  const client = await pool.connect();
  const result = await client.query('SELECT NOW()');
  console.log('connection successful');
  client.release();
  // res.send(result.rows[0]);
});
