const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Sneha@22_03',
  database: 'personal_library3',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  debug: true,
});

pool.on('connection', (connection) => {
  console.log('New DB connection established');

  connection.on('error', (err) => {
    console.error('DB connection error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });

  connection.on('close', (err) => {
    console.error('DB connection closed:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
});

const handleDisconnect = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error reconnecting to DB:', err);
      setTimeout(handleDisconnect, 2000); // Attempt to reconnect after 2 seconds
    } else {
      console.log('Reconnected to DB');
      connection.release();
    }
  });
};

// Get all books
app.get('/books', (req, res) => {
  pool.query('SELECT * FROM books', (err, results) => {
    if (err) {
      console.error('Error fetching books:', err);
      return res.status(500).json({ error: 'Failed to fetch books' });
    }
    res.json(results);
  });
});

// Add a new book
app.post('/books', (req, res) => {
  const { title, author, category_id } = req.body;
  pool.query('INSERT INTO books (title, author, category_id) VALUES (?, ?, ?)', [title, author, category_id], (err, result) => {
    if (err) {
      console.error('Error adding book:', err);
      return res.status(500).json({ error: 'Failed to add book' });
    }
    res.json(result);
  });
});

// Get all categories
app.get('/categories', (req, res) => {
  pool.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }
    res.json(results);
  });
});

// Borrow a book
app.post('/borrow', (req, res) => {
  const { book_id, borrowed_by, borrow_date, return_date } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ error: 'Failed to borrow book' });
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ error: 'Failed to borrow book' });
      }

      // Insert into borrow history
      connection.query(
        'INSERT INTO borrow_history (book_id, borrowed_by, borrow_date, return_date) VALUES (?, ?, ?, ?)',
        [book_id, borrowed_by, borrow_date, return_date],
        (err, result) => {
          if (err) {
            console.error('Error inserting into borrow history:', err);
            return connection.rollback(() => {
              res.status(500).json({ error: 'Failed to borrow book' });
            });
          }

          // Update the book's borrowed status
          connection.query(
            'UPDATE books SET borrowed = true WHERE id = ?',
            [book_id],
            (err, result) => {
              if (err) {
                console.error('Error updating book:', err);
                return connection.rollback(() => {
                  res.status(500).json({ error: 'Failed to borrow book' });
                });
              }

              connection.commit((err) => {
                if (err) {
                  console.error('Error committing transaction:', err);
                  return connection.rollback(() => {
                    res.status(500).json({ error: 'Failed to borrow book' });
                  });
                }

                res.json(result);
              });
            }
          );
        }
      );
    });

    connection.release();
  });
});

/// Get borrowing history
app.get('/borrow-history', (req, res) => {
  pool.query('SELECT * FROM borrow_history', (err, results) => {
    if (err) {
      console.error('Error fetching borrow history:', err);
      return res.status(500).json({ error: 'Failed to fetch borrow history' });
    }
    res.json(results);
  });
});


// Return a book
app.post('/return', (req, res) => {
  const { book_id } = req.body;
  
  // Start a transaction
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      return res.status(500).json({ error: 'Failed to return book' });
    }
    
    connection.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ error: 'Failed to return book' });
      }

      // Update the book's borrowed status
      connection.query('UPDATE books SET borrowed = false, borrow_date = NULL, return_date = NULL WHERE id = ?', [book_id], (err, result) => {
        if (err) {
          console.error('Error updating book:', err);
          return connection.rollback(() => {
            res.status(500).json({ error: 'Failed to return book' });
          });
        }

        // Update return date in borrow history
        connection.query('UPDATE borrow_history SET return_date = NOW() WHERE book_id = ? AND return_date IS NULL', [book_id], (err, result) => {
          if (err) {
            console.error('Error updating borrow history:', err);
            return connection.rollback(() => {
              res.status(500).json({ error: 'Failed to return book' });
            });
          }

          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              return connection.rollback(() => {
                res.status(500).json({ error: 'Failed to return book' });
              });
            }

            res.json(result);
          });
        });
      });
    });

    connection.release();
  });
});

// Start the server
app.listen(2000, () => {
  console.log('Server started on port 2000');
});
