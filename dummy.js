const express = require('express');
const app = express();
const port = 6000;

// Define the /testhehe endpoint
app.get('/testhehe', (req, res) => {
  res.send('hahahaah');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
