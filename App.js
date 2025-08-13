import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContactList from './components/ContactList';
import ChatBox from './components/chatBox';
import NavBar from './components/NavBar';


function App() {
  const [screen, setScreen] = useState(''); // 'login' | 'register' | 'chat'
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  useEffect(() => {
   
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setScreen('chat');
    loadContacts(parsedUser.id);
    }
    }, []);

  const handleLogin = async (email, password) => {
  try {
    const res = await axios.post('http://localhost:5000/api/login', { email, password });
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
    setScreen('chat');
    loadContacts(res.data.id);
  } catch {
    alert("Login failed");
  }
};


  const handleRegister = async (name, email, password) => {
  try {
    await axios.post('http://localhost:5000/api/register', { name, email, password });
    alert('Registered successfully. Please login.');
    setScreen('login');
  } catch {
    alert("Registration failed");
  }
};


const loadContacts = async (currentUserId) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/users?exclude=${currentUserId}`);
    setContacts(res.data);
  } catch {
    alert("Failed to load contacts");
  }
};


  if (screen === 'login') {
    return (
      <div>
        <h2>Login</h2>
        <input placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
        <button onClick={() => handleLogin(loginEmail, loginPassword)}>Login</button>
        <p>New user? <button onClick={() => setScreen('register')}>Register</button></p>
      </div>
    );
  }

  if (screen === 'register') {
    return (
      <div>
        <h2>Register</h2>
        <input placeholder="Name" value={regName} onChange={(e) => setRegName(e.target.value)} />
        <input placeholder="Email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
        <button onClick={() => handleRegister(regName, regEmail, regPassword)}>Register</button>
        <p>Already registered? <button onClick={() => setScreen('login')}>Login</button></p>
      </div>
    );
  }

  return (
    <div><NavBar/>
    <div style={{ display: 'flex', height: '100vh' }}>
      <ContactList contacts={contacts} setSelectedUser={setSelectedUser} />
      <ChatBox user={user} selectedUser={selectedUser} />
      <button style={{ position: 'absolute', top: 10, right: 10 }} onClick={() => {
        localStorage.removeItem('user');
        setUser(null);
        setScreen('login');
      }}>
        Logout
      </button>
    </div>
    </div>
  );
}

export default App;