const express = require('express');
const app = express();
const PORT = 4000;

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Test server is working' });
});

app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
}); 