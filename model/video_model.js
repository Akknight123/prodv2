const mongoose = require('mongoose');

const VideoSchema = mongoose.Schema({
    url: String,
    title: String,
    thumbnailUrl: String,
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategory", required: true
    },
    details: Object

}, {
    timestamps: true
})

module.exports = mongoose.model(
    'video', VideoSchema, 'Video_Library'
);

/* {
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
    } */