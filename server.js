// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import {
  registerUser,
  loginUser,
  getAllUsersExceptCurrent,
} from './controllers/authController.js';

import {
  getMessages,
  sendMessage,
  deleteForMe,
  deleteForEveryone,
  editMessage,
} from './controllers/messageController.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/register', registerUser);
app.post('/api/login', loginUser);
app.get('/api/users', getAllUsersExceptCurrent);

app.get('/api/messages/:senderId/:receiverId', getMessages);
app.post('/api/messages', sendMessage);

app.patch('/api/messages/:id/delete-for-me', deleteForMe);
app.patch('/api/messages/:id/delete-for-everyone', deleteForEveryone);
app.patch('/api/messages/:id/edit', editMessage);


app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});