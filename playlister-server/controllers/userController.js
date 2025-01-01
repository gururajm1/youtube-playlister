const { v4: uuidv4 } = require('uuid');
const User = require('../model/userModel');

// Store user data
const storeUserData = async (req, res) => {
  try {
    const { email, playlists } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const newUser = new User({
      email,
      playlists,
      uuid: uuidv4(),
    });

    await newUser.save();
    console.log(`User with email ${email} created successfully`);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error storing user data:', error);
    res.status(500).json({ message: 'Error storing user data', error: error.message });
  }
};

// Save playlists for a user
const savePlaylists = async (req, res) => {
  try {
    const { userEmail, playlists } = req.body;

    if (!userEmail || !playlists) {
      return res.status(400).json({ message: 'userEmail and playlists are required' });
    }

    if (!Array.isArray(playlists)) {
      return res.status(400).json({ message: 'Playlists should be an array' });
    }

    playlists.forEach((playlist) => {
      playlist.playlistId = playlist.id;
      playlist.playlistTitle = playlist.name;
      playlist.playlistThumbnail = playlist.thumbnail;
    });

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.playlists = playlists;
    await user.save();
    console.log(`Playlists for user ${userEmail} saved successfully`);
    res.status(200).json({ message: 'Playlists updated successfully' });
  } catch (error) {
    console.error('Error saving playlists:', error);
    res.status(500).json({ message: 'Error saving playlists', error: error.message });
  }
};

// Fetch user data by email
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); // Return user data, including playlists
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
};

module.exports = { storeUserData, savePlaylists, getUserByEmail };
