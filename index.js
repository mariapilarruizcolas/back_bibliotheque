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
    const { title, author, img, resum, theme,  isfree} = req.body;
    connection.query(
      'INSERT INTO books (title, author, img, resum, theme,  isfree) VALUES (?,?,?,?,?,?)',
      [title, author, img, resum, theme,  isfree],
      (err, result) => {
        if (err) {
          res.status(500).send('Error saving the book');
        } else {
          res.status(200).send('Book successfully saved');
        }
      }
    );
  });
  app.put('/api/books/:bookId', (req, res) => {
    const { bookId } = req.params;
    const bookPropsToUpdate = req.body;
    // On envoie une requête UPDATE à notre BdD dans la donnée qui a l’id qui est marqué en params 	
    //substitue les données actuels pour celles que je te donne dans le body
    connection.query(
      'UPDATE books SET ? WHERE id = ?',
      [bookPropsToUpdate, bookId],
      (err) => {
         if (err) {
          console.log(err);
          res.status(500).send('Error updating a book');
        } else {
          res.status(200).send('Book updated successfully 🎉');
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
    //firstname, lastname, birthday, address, city, package, email, only_read
    const { firstname, lastname, birthday, address, city, package, email, only_read} = req.body;
    connection.query(
      'INSERT INTO users (firstname, lastname, birthday, address, city, package, email, only_read) VALUES (?, ?, ?, ?,?,?,?,?)',
      [firstname, lastname, birthday, address, city, package, email, only_read],
      (err, result) => {
        if (err) {
          res.status(500).send('Error saving the users');
        } else {
          res.status(200).send('Users successfully saved');
        }
      }
    );
  });
  
  app.put('/api/users/:userId', (req, res) => {
    const { userId } = req.params;
    const userPropsToUpdate = req.body;
    // On envoie une requête UPDATE à notre BdD dans la donnée qui a l’id qui est marqué en params 	
    //substitue les données actuels pour celles que je te donne dans le body
    connection.query(
      'UPDATE users SET ? WHERE id = ?',
      [userPropsToUpdate, userId],
      (err) => {
         if (err) {
          console.log(err);
          res.status(500).send('Error updating a user');
        } else {
          res.status(200).send('User updated successfully 🎉');
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
app.post('/api/borrowing', (req, res) => {
  const { usersId, booksId, deadlineDate, isRendered} = req.body;
  connection.query(
    'INSERT INTO borrowing ( usersId, booksId, deadlineDate, isRendered) VALUES (?, ?, ?, ?)',
    [ usersId, booksId, deadlineDate, isRendered],
    (err, result) => {
      if (err) {
        res.status(500).send('Error saving the borrowing');
      } else {
        res.status(200).send('Borrowing successfully saved');
      }
    }
  );
});

app.listen (port, (err=>{
    if (err){
        console.error(`Something bad happened`);
        }else{
            console.log(`Server is listening on ${port}`);
        }
 }));
