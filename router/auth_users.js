const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const { SERCRET_KEY } = require('../../config.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // write code to validate the username
  // return true if valid, false otherwise
}

const authenticatedUser = (username, password) => {
  // write code to check if username and password match the one we have in records
  // return true if authenticated, false otherwise

}

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and Password are required' });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ username }, SERCRET_KEY); // Replace with your secret key
    res.send(token);
  } else {
    res.status(404).send("Invalid Credentials");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const token = req.headers.authorization;
  const decodedToken = jwt.verify(token, SERCRET_KEY); // Replace with your secret key
  const username = decodedToken.username;

  const reviewIndex = reviews.findIndex(r => r.username === username && r.isbn === isbn);
  if (reviewIndex !== -1) {
    reviews.splice(reviewIndex, 1);
    res.send('Deleted Successfully');
  } else {
    res.status(404).send('Review not found');
  }
});
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body

  // Assuming `books` is an object with ISBNs as keys
  if (books.hasOwnProperty(isbn)) {
    books[isbn].review = review;
    return res.status(200).json({ message: "Review updated successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
