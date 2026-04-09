const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');

console.log(`Starting server...`);
console.log(`Looking for dist folder at: ${distPath}`);
console.log(`Dist folder exists: ${require('fs').existsSync(distPath)}`);

// Serve static files from dist directory
app.use(express.static(distPath, {
  maxAge: '1h',
  etag: false
}));

// SPA fallback - serve index.html for all non-file requests
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log(`Serving ${req.path} → ${indexPath}`);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${distPath}`);
});
