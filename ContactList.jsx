import React from 'react';
import './ContactList.css';

function ContactList({ contacts, setSelectedUser }) {
  return (
    <div className="contactlist-container">
      <div className="contactlist-header">Contacts</div>
      {contacts.map((user) => (
        <div
          key={user.id}
          className="contactlist-user"
          onClick={() => setSelectedUser(user)}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}

export default ContactList;