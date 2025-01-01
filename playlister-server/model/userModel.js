const mongoose = require('mongoose');

// Define video schema
const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true }, // Video ID is required
  title: { type: String, required: true }, // Video title is required
  thumbnail: { type: String, required: true }, // Thumbnail URL is required
  publishedAt: { type: String, required: true }, // Publish date is required
  views: { type: Number, default: 0 }, // Default views to 0
  channelTitle: { type: String, required: true }, // Channel title is required
});

// Define playlist schema
const playlistSchema = new mongoose.Schema({
  playlistId: { type: String, required: true }, // Playlist ID is required
  playlistTitle: { type: String, required: true }, // Playlist title is required
  videoCount: { type: String, required: true }, // Playlist title is required
  playlistThumbnail: { type: String, required: true }, // Playlist thumbnail is required
  videos: { type: [videoSchema], default: [] }, // Default to an empty array of videos
});

// Define user schema
const userSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true }, // UUID is required and unique
  email: { type: String, required: true, unique: true }, // Email is required and unique
  playlists: { type: [playlistSchema], default: [] }, // Array of playlists, default to an empty array
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;

