// models/userModel.js

const db = require('./db');

const fetchUsers = (callback) => {
  db.query('SELECT * FROM users', callback);
};

const insertUser = (name, email, callback) => {
  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(sql, [name, email], callback);
};

module.exports = { fetchUsers, insertUser };

