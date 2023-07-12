const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { SERCRET_KEY } = require('../config.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;


const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/:customer", function auth(req, res, next) {
  const { customer } = req.params;
  if (!customer) {
    return res.status(404).json({ message: "Invalid Input" });
  }

  const token = jwt.sign({ data: customer }, SERCRET_KEY, { expiresIn: 60 * 60 });
  req.session.authorization = token;
  return res.status(200).json({ message: "User Logged", token });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
