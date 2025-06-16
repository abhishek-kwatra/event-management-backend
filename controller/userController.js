// // controllers/userController.js

// import  { fetchUsers, insertUser }  from '../models/userModel.js';

// const getAllUsers = (req, res) => {
//   fetchUsers((err, users) => {
//     if (err) {
//       return res.status(500).json({ error: 'Failed to fetch users' });
//     }
//     res.json(users);
//   });
// };

// const createUser = (req, res) => {
//   const { name, email } = req.body;
//   insertUser(name, email, (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: 'Failed to create user' });
//     }
//     res.status(201).json({ message: 'User created', userId: result.insertId });
//   });
// };

// module.exports = { getAllUsers, createUser };

