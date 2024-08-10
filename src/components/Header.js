// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/add-book">Add Book</Link></li>
          <li><Link to="/borrow-book">Borrow Book</Link></li>
          <li><Link to="/borrow-history">Borrowing History</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
