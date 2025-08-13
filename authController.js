import pool from '../db.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, password]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Registration failed');
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).send('Invalid credentials');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Login failed');
  }
};

export const getAllUsersExceptCurrent = async (req, res) => {
  const currentUserId = parseInt(req.query.exclude);
  try {
    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE id != $1',
      [currentUserId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).send('Error fetching users');
  }
};