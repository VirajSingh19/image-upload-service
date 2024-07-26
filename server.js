const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());

// Define a GET endpoint
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
