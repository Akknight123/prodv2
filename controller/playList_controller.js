const playListSchema = require('../model/playlist_model');
const video_schema = require('../model/video_model');

exports.create = (req, res) => {
    const playList = new playListSchema({
        name: req.body.name,
        videos: req.body.videos,
        subCategory: req.body.subcatId
    });
    playList.save()
        .then(data => {
            res.status(200).json({
                status: true,
                message: "Playlist saved successfully",
                data: data,
            });
        }).catch(err => {
            res.status(500).send({
                error: err.message || "Some error occurred while creating the Note."
            });
        });
}

exports.findOne = (req, res) => {
    // console.log("query", req.query.id)
    playListSchema.findById({ '_id': req.query.id }).populate({
        path: 'videos',
        populate: { path: 'subcategory', populate: { path: 'category' } } // Specify the path to populate within the 'subcategory' field
    }).then(value => {

        if (value == null) {

            res.status(200).json({
                status: false,
                message: "No Playlist found"
            })
        } else {

            res.status(200).json({
                status: true,
                data: value
            })
        }
    }).catch(err => {
        res.status(500).send({
            error: err.message || "Some error occurred while creating the Note."
        });
    })
}

exports.findAll = (req, res) => {
    playListSchema.find()

        .populate({
            path: 'subCategory',
            populate: { path: 'category' } // Specify the path to populate within the 'subcategory' field
        })
        .populate('videos')
        .exec()
        .then(value => {
            if (value.length == 0) {
                res.status(200).json({
                    status: false,
                    length: value.length,
                    message: "No Playlist Available",
                    data: value

                });
            } else {
                res.status(200).json({
                    status: true,
                    length: value.length,
                    message: "Playlist loaded successfully",
                    data: value,
                });
            }

        }).catch(err => {
            res.status(500).send({
                error: err.message || "Some error occurred while retrieving notes."
            });
        });
};
exports.findAllBySubCat = (req, res) => {
    playListSchema.find({ "subCategory": req.query.subcatId })
        .populate({
            path: 'subCategory',
            populate: { path: 'category' } // Specify the path to populate within the 'subcategory' field
        })
        .populate('videos')
        .exec()
        .then(value => {
            if (value.length == 0) {
                res.status(200).json({
                    status: false,
                    length: value.length,
                    message: "No Playlist Available",
                    data: value

                });
            } else {
                res.status(200).json({
                    status: true,
                    length: value.length,
                    message: "Playlist loaded successfully",
                    data: value,
                });
            }

        }).catch(err => {
            res.status(500).send({
                error: err.message || "Some error occurred while retrieving notes."
            });
        });
};
exports.addCategory = (req, res) => {

    video_schema.findById({ '_id': req.query.videoId })
        .then(value => {
            playListSchema.findByIdAndUpdate(req.query.playlistId, {
                $addToSet: {
                    videos: value
                }
            }).then(val => {
                res.status(200).json({
                    status: true,

                    message: "Playlist updated successfully",

                });
            })


        }).catch(err => {
            res.status(200).json({
                status: false,

                message: "Category Not Found",
            });

        });

}
exports.getMultipleQueries = (req, res) => {
    // console.log(req.body.users, typeof req.body.users);
    // console.log(req.body.videoIds, typeof req.body.videoIds);
    let filter = { _id: { $in: req.body.videoIds } }

    video_schema.find(filter)
        .then(value => {
            //    console.log("values : ",value);
            playListSchema.findByIdAndUpdate(req.query.playlistId, {
                $set: {
                    videos: value
                }
            }).then(val => {
                res.status(200).json({
                    status: true,

                    message: "Playlist updated successfully",

                });
            })

        }).catch(err => {
            res.status(200).json({
                status: false,

                message: "Category Not Found",
            });
        });
};


exports.removeVideoFromPlayList = (req, res) => {
    // console.log(req.body.users, typeof req.body.users);
    // console.log(req.body.videoIds, typeof req.body.videoIds);
    let filter = { _id: { $in: req.body.videoIds } }

    video_schema.find(filter)
        .then(value => {

            playListSchema.findByIdAndUpdate(req.query.playlistId, {
                $pullAll: {
                    videos: value
                }
            }).then(val => {
                res.status(200).json({
                    status: true,
                    message: "Playlist updated successfully",

                });
            })

        }).catch(err => {
            res.status(200).json({
                status: false,

                message: "Category Not Found",
            });
        });
};


exports.addMultipleVideos = (req, res) => {

    video_schema.findById({ '_id': req.query.videoId })
        .then(value => {
            playListSchema.findByIdAndUpdate(req.query.playlistId, {
                $addToSet: {
                    videos: value
                }
            }).then(val => {
                res.status(200).json({
                    status: true,

                    message: "Playlist updated successfully",

                });
            })


        }).catch(err => {
            res.status(200).json({
                status: false,

                message: "Category Not Found",
            });

        });

}



exports.removeOne = (req, res) => {
    playListSchema.findByIdAndDelete(req.query.uid)
        .then(note => {
            if (!note) {
                return res.status(200).json({
                    status: false,
                    message: "Category not found with id " + req.query.uid
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: "Category deleted successfully!"
                });
            }

        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Category not found with id " + req.query.uid
                });
            }
            return res.status(500).send({
                message: "Could not delete note with id " + req.query.uid
            });
        });
}
