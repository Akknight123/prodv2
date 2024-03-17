const mongoose = require('mongoose');

const watchLaterController = mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    playlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "playlist"
    }],
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "video"
    }]
})

module.exports = mongoose.model(
    'WatchList', watchLaterController, 'WatchList'
);