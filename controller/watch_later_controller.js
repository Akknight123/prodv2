const watch_schema = require("../model/saved_watch_model");
const mongoose = require('mongoose');
const firebaseConsole = require('./firebase_admin')
exports.getAllVideos = (req, res) => {
    console.log(req.query.uid);
    watch_schema.find({ "uid": req.query.uid })
        .populate({
            path: 'videos'
            , populate: { path: 'subcategory', populate: { path: 'category' } }
        })
        .exec().then(videos => {
            if (videos.length == 0) {
                res.status(200).json({
                    status: false,
                    length: videos.length,
                    message: "No files available",
                    data: videos,
                });
            } else {
                res.status(200).json({
                    status: true,
                    length: videos.length,
                    message: "files loaded successfully",
                    data: videos[0],
                });
            }
        }).catch(err => {
            res.status(500).send({
                error: err.message || "Some error occurred while retrieving notes."
            }); N
        });
}
exports.getWatchLaterRawData = (req, res) => {
    watch_schema.find({ "uid": req.query.uid })
        .exec().then(videos => {
            if (videos.length == 0) {
                res.status(200).json({
                    status: false,
                    message: "No files available",
                    data: videos,
                });
            } else {
                res.status(200).json({
                    status: true,
                    message: "files loaded successfully",
                    data: videos[0],
                });
            }

        }).catch(err => {
            res.status(500).send({
                error: err.message || "Some error occurred while retrieving notes."
            });
        });
}
exports.getWatchlaterData = (req, res) => {
    watch_schema.find({ "uid": req.query.uid })
        .populate({
            path: 'playlist',
            populate: {
                path: 'subCategory videos',
            }
        }).populate({
            path: 'videos',
            populate: { path: 'subcategory', populate: { path: 'category' } } // Specify the path to populate within the 'subcategory' field
        })
        .exec().then(videos => {
            if (videos.length == 0) {
                res.status(200).json({
                    status: false,
                    length: videos.length,
                    message: "No files available",
                    data: videos,
                });
            } else {

                res.status(200).json({
                    status: true,
                    length: videos.length,
                    message: "files loaded successfully",
                    data: videos[0],
                });
            }

            // res.send(videos);
        }).catch(err => {
            res.status(500).send({
                error: err.message || "Some error occurred while retrieving notes."
            });
        });
}
exports.getAllPlaylist = (req, res) => {
    // console.log(req.query.uid);
    watch_schema.find({ "uid": req.query.uid })
        .populate({
            path: 'playlist',
            populate: ('subCategory videos') // Specify the path to populate within the 'subcategory' field
        })
        .exec().then(videos => {
            if (videos.length == 0) {
                res.status(200).json({
                    status: false,
                    length: videos.length,
                    message: "No files available",
                    data: videos,
                });
            } else {

                res.status(200).json({
                    status: true,
                    length: videos.length,
                    message: "files loaded successfully",
                    data: videos,
                });
            }

            // res.send(videos);
        }).catch(err => {
            res.status(500).send({
                error: err.message || "Some error occurred while retrieving notes."
            });
        });
}
exports.addWatchLaterVideo = (req, res) => {

    watch_schema.find({
        videos: new mongoose.Types.ObjectId(req.body.videoId)
    }
    ).then(doc => {
        if (doc.length == 0) {
            watch_schema.findOneAndUpdate(
                { uid: req.body.uid }, // search query
                { $push: { videos: req.body.videoId } }, // fields to update
                { new: true }, // return updated document

            ).then(doc => {
                console.log(doc);
                res.status(200).json({
                    status: true,
                    message: "Video Added successfully",
                    data: doc,
                });
            }).catch(err => {
                console.log('Something went wrong when updating the data');
                res.status(200).json({
                    status: false,
                    message: err.message || "Something went wrong!",
                });
            });
        } else {
            console.log(doc);
            res.status(200).json({
                status: true,
                message: "Video already exists in library!",
                // data: doc,
            });
        }

    }).catch(err => {
        console.log('Something went wrong when updating the data');
        res.status(200).json({
            status: false,
            message: err.message || "Something went wrong!",
        });
    });

}
exports.watchLaterVideoRemove = (req, res) => {

    watch_schema.find({
        videos: new mongoose.Types.ObjectId(req.body.videoId)
    }
    ).then(doc => {
        if (doc.length > 0) {
            watch_schema.findOneAndUpdate(
                { uid: req.body.uid }, // search query
                { $pull: { videos: req.body.videoId } }, // fields to update
                { new: true }, // return updated document

            ).then(doc => {
                console.log(doc);
                res.status(200).json({
                    status: true,
                    message: "Video Removed successfully",
                    data: doc,
                });
            }).catch(err => {
                console.log('Something went wrong when updating the data');
                res.status(200).json({
                    status: false,
                    message: err.message || "Something went wrong!",
                });
            });
        } else {
            console.log(doc);
            res.status(200).json({
                status: true,
                message: "Video not exists in library!",
                // data: doc,
            });
        }

    }).catch(err => {
        console.log('Something went wrong when updating the data');
        res.status(200).json({
            status: false,
            message: err.message || "Something went wrong!",
        });
    });

}
exports.addWatchLaterPlaylist = (req, res) => {
    // watch_schema.findOneAndUpdate(
    //     { uid: req.body.uid }, // search query
    //     { $push: { playlist: req.body.playlistId } }, // fields to update
    //     { new: true }, // return updated document

    watch_schema.find({
        playlist: new mongoose.Types.ObjectId(req.body.playlistId)
    }
    ).then(doc => {
        if (doc.length == 0) {
            watch_schema.findOneAndUpdate(
                { uid: req.body.uid }, // search query
                { $push: { playlist: req.body.playlistId } }, // fields to update
                { new: true }, // return updated document

            ).then(doc => {
                console.log(doc);
                res.status(200).json({
                    status: true,
                    message: "Playlist Added successfully",
                    data: doc,
                });
            }).catch(err => {
                console.log('Something went wrong when updating the data');
                res.status(200).json({
                    status: false,
                    message: err.message || "Something went wrong!",
                });
            });
        } else {
            console.log(doc);
            res.status(200).json({
                status: true,
                message: "Playlist already exists in library!",
                // data: doc,
            });
        }

    }).catch(err => {
        console.log('Something went wrong when updating the data');
        res.status(200).json({
            status: false,
            message: err.message || "Something went wrong!",
        });
    });
}
exports.watchLaterPlaylistRemove = (req, res) => {
    watch_schema.find({
        playlist: new mongoose.Types.ObjectId(req.body.playlistId)
    }
    ).then(doc => {
        if (doc.length > 0) {
            watch_schema.findOneAndUpdate(
                { uid: req.body.uid }, // search query
                { $pull: { playlist: req.body.playlistId } }, // fields to update
                { new: true }, // return updated document

            ).then(doc => {
                console.log(doc);
                res.status(200).json({
                    status: true,
                    message: "Playlist removed successfully",
                    data: doc,
                });
            }).catch(err => {
                console.log('Something went wrong when updating the data');
                res.status(200).json({
                    status: false,
                    message: err.message || "Something went wrong!",
                });
            });
        } else {
            console.log(doc);
            res.status(200).json({
                status: true,
                message: "Playlist not exists in library!",
                // data: doc,
            });
        }

    }).catch(err => {
        console.log('Something went wrong when updating the data');
        res.status(200).json({
            status: false,
            message: err.message || "Something went wrong!",
        });
    });
}