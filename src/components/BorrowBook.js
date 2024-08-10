// src/components/BorrowBook.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BorrowBook = () => {
  const [bookId, setBookId] = useState('');
  const [borrowedBy, setBorrowedBy] = useState('');
  const [borrowDate, setBorrowDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:2000/books')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the books!', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedBorrowDate = new Date(borrowDate).toISOString().slice(0, 10); // Extracts YYYY-MM-DD
    const formattedReturnDate = returnDate ? new Date(returnDate).toISOString().slice(0, 10) : null;
  
    axios.post('http://localhost:2000/borrow', {
      book_id: bookId,
      borrowed_by: borrowedBy,
      borrow_date: formattedBorrowDate,
      return_date: formattedReturnDate
    })
      .then((response) => {
        console.log('Book borrowed:', response.data);
        // Optionally, update the borrowing history in React state if needed
      })
      .catch((error) => {
        console.error('There was an error borrowing the book!', error);
      });
  };
  

  return (
    <div>
      <h2>Borrow Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Book:</label>
          <select
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}>
              <option value="">Select a book</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} by {book.author}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Borrowed By:</label>
          <input
            type="text"
            value={borrowedBy}
            onChange={(e) => setBorrowedBy(e.target.value)}
          />
        </div>
        <div>
          <label>Borrow Date:</label>
          <input
            type="date"
            value={borrowDate}
            onChange={(e) => setBorrowDate(e.target.value)}
          />
        </div>
        <div>
          <label>Return Date:</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>
        <button type="submit">Borrow Book</button>
      </form>
    </div>
  );
};

export default BorrowBook;
