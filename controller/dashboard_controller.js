const Video_Schema = require('../model/video_model');
const category_schema = require('../model/category_model');
const subcategory_schema = require('../model/subcategory_model');
const playListSchema = require('../model/playlist_model');

exports.getDashboard = async (req, res) => {
    var videos = await Video_Schema.find().populate('subcategory')
    var categories = await category_schema.find()
    var subcategories = await subcategory_schema.find()
    // var playLists = await playListSchema.find()

    playListSchema.find().populate({
        path: 'subCategory',
        populate: { path: 'category' } // Specify the path to populate within the 'subcategory' field
    }).populate({
        path: 'videos',
        populate: { path: 'subcategory' } // Specify the path to populate within the 'subcategory' field
    })
        // .populate('videos')
        .then(value => {
            res.status(200).json({
                status: true,
                data: {
                    "videos": videos,
                    "categories": categories,
                    "playlist": value,
                    "subcategories": subcategories
                }

            });
        }).catch(err => {
            res.status(500).send({
                error: err.message || "Some error occurred while retrieving notes."
            });
        });
}