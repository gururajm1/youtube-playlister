const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define the route for storing the user data
router.post('/store', userController.storeUserData);
router.post('/savePlaylists', userController.savePlaylists);
router.get('/users/:email', userController.getUserByEmail);

module.exports = router;
