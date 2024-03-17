const mongoose = require('mongoose');

const playListSchema = mongoose.Schema({
    name: String,
    image: String,
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategory", required: true
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "video", required: true
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model(
    'playlist', playListSchema, 'PlayList'
);