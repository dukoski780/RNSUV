var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Path to the JSON database file
const USERS_DB_PATH = path.join(__dirname, 'database', 'users.json');

// Helper function to read users from file
async function readUsers() {
  try {
    const file = await fs.readFile(USERS_DB_PATH, 'utf8');
    return JSON.parse(file || '[]');
  } catch (err) {
    console.error('Failed to read users database:', err);
    return [];
  }
}

// Helper function to write users to file
async function writeUsers(users) {
  try {
    await fs.writeFile(USERS_DB_PATH, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write users database:', err);
    throw err;
  }
}

// Helper function to find user by username
async function findUser(username) {
  const users = await readUsers();
  return users.find(u => u.username === username);
}

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await findUser(username);

  if (user && user.password === password) {
    res.json({
      msg: 'Successfully logged in',
      token: jwt.sign({
        user: username,
        role: user.role
      }, 'SECRET'),
      role: user.role
    });
  } else {
    res.status(400).json({msg: 'Invalid username or password'});
  }
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await findUser(username);

  if (existingUser) {
    res.status(400).json({msg: 'User already exists, please login.'});
  } else {
    const users = await readUsers();
    users.push({
      username: username,
      password: password,
      role: 'user' // Default role for new users
    });
    await writeUsers(users);
    res.json({
      msg: 'Successfully created user, please login'
    });
  }
});

// Change password endpoint (protected - requires authentication)
router.put('/password', async (req, res) => {
  // Extract token from Authorization header
  const token = req.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({msg: 'Authentication required'});
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, 'SECRET');
    const username = decoded.user;

    const { currentPassword, newPassword } = req.body;

    // Validate request body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({msg: 'Current password and new password are required'});
    }

    // Find the user
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex === -1) {
      return res.status(404).json({msg: 'User not found'});
    }

    // Verify current password
    if (users[userIndex].password !== currentPassword) {
      return res.status(400).json({msg: 'Current password is incorrect'});
    }

    // Update password
    users[userIndex].password = newPassword;
    await writeUsers(users);

    res.json({msg: 'Password changed successfully'});
  } catch (err) {
    console.error('Password change error:', err);
    return res.status(401).json({msg: 'Invalid or expired token'});
  }
});

module.exports = router;
