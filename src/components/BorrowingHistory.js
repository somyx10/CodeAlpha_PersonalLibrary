//src/components/BorrowingHistory.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BorrowHistory.css';

const BorrowHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:2000/borrow-history')
      .then(response => {
        setHistory(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the borrowing history!', error);
      });
  }, []);

  return (
    <div>
      <h2>Borrowing History</h2>
      <table>
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Borrowed By</th>
            <th>Borrow Date</th>
            <th>Return Date</th>
          </tr>
        </thead>
        <tbody>
          {history.map(record => (
            <tr key={record.id}>
              <td>{record.book_id}</td>
              <td>{record.borrowed_by}</td>
              <td>{record.borrow_date}</td>
              <td>{record.return_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowHistory;
