const express = require('express');
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-AUTH-HEADER, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(bodyParser.json());
app.get('/', (req, res) => res.send('JokeHub Server Running!'));

// Joke routes (public GET and view tracking, protected POST/PUT/PATCH/DELETE)
app.use('/api/joke', function(req, res, next) {
  // Allow public access for GET requests (viewing jokes)
  if (req.method === 'GET') {
    return next();
  }

  // Allow public access for PATCH requests to /view endpoint (tracking views)
  if (req.method === 'PATCH' && req.url.includes('/view')) {
    return next();
  }

  // Require authentication for POST, PUT, PATCH, DELETE
  var token = req.get('X-AUTH-HEADER') || req.get('Authorization')?.replace('Bearer ', '');
  var user = jwt.decode(token);
  if (user && user.user) {
    req.user = user; // Attach user to request
    return next();
  }
  return res.status(403).json({msg: 'Please login to access this information'});
}, require('./jokes'));

// User routes (public)
app.use('/api/user', require('./user'));

const PORT = 3001;
app.listen(PORT, () => console.log(`JokeHub Server listening on http://localhost:${PORT}`));
