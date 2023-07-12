const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const { SERCRET_KEY } = require('../../config.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send('Please input your details');
    return;
  }

  if (users.some(user => user.username === username)) {
    res.status(409).send('WARNING!!! USER ALREADY EXISTS');
    return;
  }

  const newUser = { username, password };
  users.push(newUser);
  res.status(201).send("User registered successfully");
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // axios.get('http://localhost:3000/books')
  //   .then(response => {
  //     res.send(JSON.stringify(response.data, null, 2));
  //   })
  //   .catch(error => {
  //     res.status(500).send('Error retrieving book list');
  //   });
  try {
    res.send(books)

  } catch (error) {
    res.status(404).json({ message: 'Something Went Wrong' })
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // try {
  //   const { isbn } = req.params;
  //   const response = await axios.get(`http://localhost:3000/books/${isbn}`);
  //   if (response.data) {
  //     res.send(JSON.stringify(response.data, null, 2));
  //   } else {
  //     res.status(404).send('Book not found');
  //   }
  // } catch (error) {
  //   res.status(500).send('Error retrieving book details');
  // }
  try {
    const { isbn } = req.params

    const filterredBooks = books.find(books=> books.isbn === isbn)
    return res.send(filterredBooks)
    
  } catch (error) {
    res.status(404).json({ message: 'Something Went Wrong' })
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  const filteredBooks = [];

  for (const bookId in books) {
    const book = books[bookId];
    if (book.author === author) {
      filteredBooks.push(book);
    }
  }

  if (filteredBooks.length > 0) {
    res.send(filteredBooks);
  } else {
    res.status(404).send("No books with that author found");
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  // try {
  //   const { title } = req.params;
  //   const response = await axios.get('http://localhost:3000/books');
  //   const booksByTitle = response.data.filter(book => book.title === title);

  //   if (booksByTitle.length > 0) {
  //     res.send(JSON.stringify(booksByTitle, null, 2));
  //   } else {
  //     res.status(404).send('No books with that title found');
  //   }
  // } catch (error) {
  //   res.status(500).send('Error retrieving book details');
  // }

    const { title } = req.params;
    const filteredBooks = [];
  
    for (const bookId in books) {
      const book = books[bookId];
      if (book.title === title) {
        filteredBooks.push(book);
      }
    }
  
    if (filteredBooks.length > 0) {
      res.send(filteredBooks);
    } else {
      res.status(404).send("No books with that title found");
    }
  });
  


// Add or modify a book review
public_users.post('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const review = req.query.review;
  const token = req.headers.authorization;
  const decodedToken = jwt.verify(token, SECRET_KEY); // Replace with your secret key
  const username = decodedToken.username;

  const existingReview = reviews.find(r => r.username === username && r.isbn === isbn);
  if (existingReview) {
    existingReview.review = review;
    res.send("Review modified successfully");
  } else {
    reviews.push({ isbn, username, review });
    res.send("Review added successfully");
  }
});


module.exports.general = public_users;
