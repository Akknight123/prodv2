const mongoose = require('mongoose');
const youtubeModel = mongoose.Schema({
    title: String,
    author_name: String,
    author_url: String,
    type: String,
    height: Number,
    width: Number,
    version: String,
    provider_name: String,
    provider_url: String,
    thumbnail_height: Number,
    thumbnail_width: Number,
    thumbnail_url: String,
});

export const YoutubeModel = youtubeModel;