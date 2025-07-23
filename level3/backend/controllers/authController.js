const bcrypt = require('bcryptjs');
const pool = require('../config/db'); // make sure this is correct

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log('📩 Incoming Registration Body:', req.body);

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: '❌ All fields are required including role.' });
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: '❌ Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ message: '✅ Registered successfully!' });
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    res.status(500).json({ error: '❌ Server error. Please try again.' });
  }
};
