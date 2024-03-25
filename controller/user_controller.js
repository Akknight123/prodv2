const user_schema = require("../model/user_model");
const watch_schema = require("../model/saved_watch_model");
const { uploadLocal } = require("../middleware/multer_modules");
const uploadModules = require("./common_uploader");
require("dotenv").config();

exports.getSingleUser = (req, res) => {
  user_schema.findOne({ uid: req.query.uid }).then(user => {

    res.status(200).json({
      status: true,
      message: "User Successfull",
      data: user,
    });
  })
    .catch(err => {
      console.log(err);
      res.status(200).json({
        status: false,
        message: 'User does not exist', err,
      });
    });
}
exports.getSingleUserByObjId = (req, res) => {
  user_schema.findById(req.query.id).then(user => {
    res.status(200).json({
      status: true,
      message: "User Successfull",
      data: user,
    });
  })
    .catch(err => {
      console.log(err);
      res.status(200).json({
        status: false,
        message: 'User does not exist', err,
      });
    });
}
/*   user_schema.findOne({ uid: req.query.uid }).then(user => {

    res.status(200).json({
      status: true,
      message: "User Successfull",
      data: user,
    });
  })
    .catch(err => {
      console.log(err);
      res.status(200).json({
        status: false,
        message: 'User does not exist', err,
      });
    }); */

exports.create = (req, res) => {
  const userModel = new user_schema({
    uid: req.body.uid,
    mobile: req.body.mobile,
    email: req.body.email,
    name: req.body.name
  });
  watchModel = new watch_schema({
    uid: req.body.uid
  })
  user_schema.findOne({ uid: req.body.uid }).then(user => {
    if (user) {
      // console.log('User exists', user);
      res.status(200).json({
        status: true,
        message: "User already Exists",
        data: user,
      });
    } else {

      userModel
        .save()
        .then((data) => {
          watchModel.save();
          res.status(200).json({
            status: true,
            message: "User regitered successfully",
            data: data,
          });
        })
        .catch((err) => {
          res.status(500).send({
            error: err.message || "Some error occurred while creating the Note.",
          });
        });
    }
  })
    .catch(err => {
      console.log(err);
      res.status(200).json({
        status: false,
        message: 'User does not exist', err,
      });

    });

};

exports.addToken = async (req, res) => {
  try {
    user_schema.findOneAndUpdate(
      { uid: req.body.uid }, // search query
      { $set: { fcm_token: req.body.fcmToken } }, // fields to update
      { new: true })
      .then((data) => {
        res.status(200).json({
          status: true,
          message: "token updated successfully",
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
exports.addName = (req, res) => {
  user_schema.findOneAndUpdate(
    { uid: req.body.uid }, // search query
    { $set: { name: req.body.name } }, // fields to update
    { new: true }, // return updated document

  ).then(doc => {

    console.log(doc);
    res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: doc,
    });
  }).catch(err => {
    console.log('Something went wrong when updating the data');
    res.status(200).json({
      status: false,
      message: err.message || "Something went wrong!",

    });

  });

}
exports.update =
  async (req, res) => {
    uploadLocal.single("image")(req, res, async function (err) {
      if (err) {
        res.status(400).json({
          status: false,
          message: err.message || "Something went wrong!",

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

            user_schema.findOneAndUpdate(
              { uid: req.body.uid }, // search query
              { $set: { image: `https://drive.google.com/uc?export=view&id=${data}` } }, // fields to update
              { new: true })
              .then((data) => {
                res.status(200).json({
                  status: true,
                  message: "Profile updated successfully",
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
  user_schema
    .find()
    .then((value) => {
      if (value.length == 0) {
        res.status(200).json({
          status: false,
          length: value.length,
          message: "No Users Available",
          data: value,
        });
      } else {
        res.status(200).json({
          status: true,
          length: value.length,
          message: "User list loaded successfully",
          data: value,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        error: err.message || "Something went wrong!",
      });
    });
};
exports.getOne = (req, res) => {
  category_Schema
    .findById({ _id: req.query.uid })
    .then((value) => {
      res.status(200).json({
        status: true,

        message: "Categories loaded successfully",
        data: value,
      });
    })
    .catch((err) => {
      res.status(200).json({
        status: false,

        message: "Category Not Found",
      });
    });
};

exports.findOne = (req, res) => {
  user_schema.exists({ uuid: req.query.uuid }, function (err, results) {
    if (err) {
      res.send(err);
    } else {
      if (results) {
        BS_order.find(
          { uuid: req.query.uuid, status: req.query.status },
          function (err, datamodal) {
            if (err) {
              res.send(err);
            } else {
              res.send(datamodal);
            }
          }
        );
      } else {
        res.send(results);
      }
    }
  });
};

exports.removeOne = (req, res) => {
  category_Schema
    .findByIdAndDelete(req.query.uid)
    .then((note) => {
      if (!note) {
        return res.status(200).json({
          status: false,
          message: "Category not found with id " + req.query.uid,
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Category deleted successfully!",
        });
      }
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Category not found with id " + req.query.uid,
        });
      }
      return res.status(500).send({
        message: "Could not delete note with id " + req.query.uid,
      });
    });
};
