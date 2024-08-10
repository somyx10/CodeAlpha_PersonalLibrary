// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import BorrowBook from './components/BorrowBook';
import BorrowingHistory from './components/BorrowingHistory';
import './App.css';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<BookList />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/borrow-book" element={<BorrowBook />} />
        <Route path="/borrow-history" element={<BorrowingHistory />} />
      </Routes>
    </Router>
  );
};

export default App;

