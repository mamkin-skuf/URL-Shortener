const express = require('express');
const crypto = require('crypto');

const app = express();
const port = 3000;

// In-memory storage for URLs
const urlDatabase = {};

app.use(express.json());

// Generate a random short ID





function generateShortId() {
  return crypto.randomBytes(4).toString('hex');
}

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the URL Shortener API! Use /shorten to shorten a URL.');
});

// Shorten a URL
app.post('/shorten', (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const shortId = generateShortId();
  urlDatabase[shortId] = longUrl;

  res.json({ shortUrl: `http://localhost:${port}/${shortId}` });
});

// Redirect to the original URL
app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  const longUrl = urlDatabase[shortId];

  if (!longUrl) {
    return res.status(404).send('Short URL not found');
  }

  res.redirect(longUrl);
});

// Delete a short URL
app.delete('/:shortId', (req, res) => {
  const { shortId } = req.params;

  if (!urlDatabase[shortId]) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  delete urlDatabase[shortId];
  res.json({ message: 'Short URL deleted successfully' });
});

// Start server
app.listen(port, () => {
  console.log(`URL Shortener running at http://localhost:${port}`);
});
