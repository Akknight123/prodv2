const subcategory_Schema = require('../model/subcategory_model');
const { uploadLocal } = require("../middleware/multer_modules");
const uploadModules = require("../controller/common_uploader");
require("dotenv").config();
// exports.create = (req, res) => {
//     const category = new subcategory_Schema({
//         name: req.body.name,
//         image: req.body.image,
//         category: req.body.categoryId
//     });
//     category.save().then(data => {
//         res.status(200).json({
//             status: true,
//             message: "category saved successfully",
//             data: data,
//         });
//     }).catch(err => {
//         res.status(500).send({
//             error: err.message || "Some error occurred while creating the Note."
//         });
//     });
// }
exports.getSubsById = (req, res) => {
    // console.log("cat did: ", req.query.catId);
    var catId = req.query.catId;
    subcategory_Schema.find({ "category": catId })
        .populate('category').exec()
        .then(value => {
            if (value.length == 0) {
                res.status(200).json({
                    status: false,
                    length: value.length,
                    message: "No subCategories Available",
                    data: value
                });
            } else {
                res.status(200).json({
                    status: true,
                    length: value.length,
                    message: "subCategories loaded successfully",
                    data: value,
                });
            }

        }).catch(err => {
            res.status(500).send({
                error: err.message || "Something went wrong!",
            });
        });
}
exports.create =
    async (req, res) => {
        uploadLocal.single("image")(req, res, async function (err) {
            if (err) {
                res.status(400).json({
                    status: false,
                    message: "catch block error",
                    errors: err.message || "Some error occurred while creating the Note.",
                });
            } else {
                if (req.file == undefined) {
                    res.status(200).json({
                        status: false,
                        message: "Please upload category image!!",
                    });
                } else {
                    try {
                        var data = await uploadModules.uploadToDrive(req.file, process.env.FOLDERID);
                        // console.log("got data", data);
                        const category = new subcategory_Schema({
                            name: req.body.name,
                            category: req.body.categoryId,
                            image: `https://drive.google.com/uc?export=view&id=${data}`,
                        });
                        category
                            .save()
                            .then((data) => {
                                res.status(200).json({
                                    status: true,
                                    message: "Subcategory saved successfully",
                                    data: data,
                                });
                            })
                            .catch((errr) => {
                                res.status(200).json({
                                    status: false,
                                    message: errr.message || "Something went wrong!",

                                });
                            });

                    } catch (error) {
                        res.status(200).json({
                            status: false,
                            message: error.message || "Something went wrong!",

                        });
                    }
                }
            }
        })


    };
exports.findAll = (req, res) => {

    subcategory_Schema.find()
        .populate('category').exec()
        .then(value => {
            if (value.length == 0) {
                res.status(200).json({
                    status: false,
                    length: value.length,
                    message: "No subCategories Available",
                    data: value
                });
            } else {
                res.status(200).json({
                    status: true,
                    length: value.length,
                    message: "subCategories loaded successfully",
                    data: value,
                });
            }

        }).catch(err => {
            res.status(500).send({
                error: err.message || "Something went wrong!",
            });
        });
};
exports.getOne = (req, res) => {

    subcategory_Schema.findById({ '_id': req.query.uid })
        .then(value => {

            res.status(200).json({
                status: true,

                message: "Categories loaded successfully",
                data: value,
            });

        }).catch(err => {
            res.status(200).json({
                status: false,

                message: "Category Not Found",
            });

        });

}

exports.findOne = (req, res) => {
    subcategory_Schema.exists({ uuid: req.query.uuid }, function (err, results) {
        if (err) {
            res.send(err);
        } else {
            if (results) {
                BS_order.find({ uuid: req.query.uuid, status: req.query.status }, function (err, datamodal) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(datamodal);
                    }
                })
            } else {
                res.send(results);
            }
        }
    });


};

exports.removeOne = (req, res) => {
    subcategory_Schema.findByIdAndDelete(req.query.uid)
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
