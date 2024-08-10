// src/components/BookList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:2000/books')
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the books!', error);
      });
  }, []);

  return (
    <div className='book-container'>
      <h2>Book List</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id} className='line'>
            {book.title} by {book.author} {book.borrowed ? "(Borrowed)" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
