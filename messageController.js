import pool from '../db.js';

export const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE ((sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1))
         AND (deleted_for_user IS NULL OR deleted_for_user != $1)
       ORDER BY id ASC`,
      [senderId, receiverId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const sendMessage = async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [sender_id, receiver_id, message]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).send('Failed to send message');
  }
};


export const deleteForMe = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    await pool.query(
      'UPDATE messages SET deleted_for_user = $1 WHERE id = $2',
      [userId, id]
    );
    res.json({ message: 'Deleted for user' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteForEveryone = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `UPDATE messages SET is_deleted = TRUE, message = 'This message was deleted' WHERE id = $1`,
      [id]
    );
    res.json({ message: 'Deleted for everyone' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editMessage = async (req, res) => {
  const { id } = req.params;
  const { newMessage } = req.body;

  try {
    await pool.query(
      'UPDATE messages SET message = $1, is_edited = TRUE WHERE id = $2',
      [newMessage, id]
    );
    res.json({ message: 'Message edited' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};