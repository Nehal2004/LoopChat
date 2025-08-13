import React, { useState, useEffect, useCallback } from 'react';
import './chatBox.css';
import axios from 'axios';

function ChatBox({ user, selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState('');
  const [menuMessageId, setMenuMessageId] = useState(null);

  const fetchMessages = useCallback(async () => {
    if (!user || !selectedUser) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${user.id}/${selectedUser.id}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }, [user, selectedUser]);

  useEffect(() => {
    let interval;
    if (selectedUser) {
      fetchMessages();
      interval = setInterval(fetchMessages, 1000);
    }
    return () => clearInterval(interval);
  }, [fetchMessages, selectedUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.context-menu')) {
        setMenuMessageId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/messages', {
        sender_id: user.id,
        receiver_id: selectedUser.id,
        message: input,
      });
      setInput('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleEdit = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/messages/${id}/edit`, {
        userId: user.id,
        newMessage: editInput,
      });
      fetchMessages();
      setEditingId(null);
      setEditInput('');
    } catch (err) {
      console.error('Error editing message:', err);
    }
  };

  const handleDeleteForMe = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/messages/${id}/delete-for-me`, {
        userId: user.id,
      });
      fetchMessages();
    } catch (err) {
      console.error('Error deleting for me:', err);
    }
  };

  const handleDeleteForEveryone = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/messages/${id}/delete-for-everyone`);
      fetchMessages();
    } catch (err) {
      console.error('Error deleting for everyone:', err);
    }
  };

  if (!selectedUser) {
    return (
      <div className="chatbox-container">
        <h3 className="chatbox-header">Select a user to start chatting</h3>
      </div>
    );
  }

  return (
    <div className="chatbox-container">
      <h3 className="chatbox-header">Chat with {selectedUser.name}</h3>
      <div className="chatbox-messages">
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.sender_id === user.id ? 'message-right' : 'message-left'}
            onContextMenu={(e) => {
              e.preventDefault();
              setMenuMessageId(m.id);
              setEditInput(m.message);
            }}
          >
            {menuMessageId === m.id && (
              <div className="context-menu">
                <button onClick={() => handleDeleteForMe(m.id)}>🗑️ Delete for Me</button>
                {m.sender_id === user.id && (
                  <>
                    <button onClick={() => {
                      setEditingId(m.id);
                      setMenuMessageId(null);
                    }}>✏️ Edit</button>
                    <button onClick={() => handleDeleteForEveryone(m.id)}>❌ Delete for Everyone</button>
                  </>
                )}
              </div>
            )}

            {editingId === m.id ? (
              <>
                <input
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEdit(m.id)}
                />
                <button onClick={() => handleEdit(m.id)}>Save</button>
              </>
            ) : (
              <span className="message-bubble">
                {m.message}
                {m.is_edited && <span className="edited-label"> (edited)</span>}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="chatbox-input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chatbox-input"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="chatbox-send">Send</button>
      </div>
    </div>
  );
}

export default ChatBox;
