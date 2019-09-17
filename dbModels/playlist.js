const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let playlistSchema = new Schema({
  playlistName : String,
  authorId : String,
  authorName : String,
  videoCount : Number,
  privacy : String
});

let playlistContentSchema = new Schema({
  videoId : String,
  playlistId : String,
  orderNum : Number
});

const playlist = mongoose.model('playlist', playlistSchema);
const playlistContent = mongoose.model('playlistContent' , playlistContentSchema);

module.exports = {playlist:playlist , playlistContent:playlistContent};
