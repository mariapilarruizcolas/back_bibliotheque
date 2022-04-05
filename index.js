const connection = require('./db-config');
const express = require ('express');
const cors= require('cors');
const app = express ();

const port = 8000;
connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
  } else {
    console.log('connected to database with threadId :  ' + connection.threadId);
  }
});
app.use(cors());
app.use(express.json());
//TABLE BOOKS

app.get('/api/books', (req, res) => {
    connection.query('SELECT * FROM books', (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from database');
      } else {
        res.status(200).json(result);
      }
    });
  });
  app.post('/api/books', (req, res) => {
    const { title, author, is_free} = req.body;
    connection.query(
      'INSERT INTO books (title, author, is_free) VALUES (?, ?, ?)',
      [title, author, is_free],
      (err, result) => {
        if (err) {
          res.status(500).send('Error saving the book');
        } else {
          res.status(200).send('Book successfully saved');
        }
      }
    );
  });

  //TABLE USERS
  app.get('/api/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from database');
      } else {
        res.status(200).json(result);
      }
    });
  });
  app.post('/api/users', (req, res) => {
    const { firstname, lastname, birthday, address, city, package} = req.body;
    connection.query(
      'INSERT INTO users (firstname, lastname, birthday, address, city, package) VALUES (?, ?, ?, ?,?,?)',
      [firstname, lastname, birthday, address, city, package],
      (err, result) => {
        if (err) {
          res.status(500).send('Error saving the users');
        } else {
          res.status(200).send('Users successfully saved');
        }
      }
    );
  });
//TABLE   BORROWING
app.get('/api/borrowing', (req, res) => {
  connection.query('SELECT * FROM borrowing', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving data from database');
    } else {
      res.status(200).json(result);
    }
  });
});

app.listen (port, (err=>{
    if (err){
        console.error(`Something bad happened`);
        }else{
            console.log(`Server is listening on ${port}`);
        }
 }));
