
import React from 'react';
import './NavBar.css'; 


function NavBar({ setScreen }) {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#3f51b5', color: 'white' }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>LoopChat</div>
      
    </nav>
  );
}

export default NavBar;