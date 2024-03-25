const user_schema = require("../model/user_model");
const notification_call = require('../controller/firebase_admin')

exports.shootNotification = (req, res) => {
    user_schema.find().select('fcm_token')
        // .aggregate([
        //     {
        //         $project: {
        //             "fcm_token": 1
        //         }
        //     }
        // ])
        .then((value) => {
            var fcmList = [];
            const varval = value.map((val) => val["fcm_token"]);
            varval.forEach(element => {
                if (element != undefined) {
                    fcmList.push(element)
                }
            });
            // console.log("varval", fcmList);
            // console.log("fcmTokenList", value);
            notification_call.sendToMultiple(fcmList);
            // if (value.length == 0) {
            //     res.status(200).json({
            //         status: false,
            //         length: value.length,
            //         message: "No Users Available",
            //         data: fcmList,
            //     });
            // } else {
            //     res.status(200).json({
            //         status: true,
            //         length: value.length,
            //         message: "User list loaded successfully",
            //         data: fcmList,
            //     });
            // }
        })
        .catch((err) => {
            res.status(500).send({
                error: err.message || "Something went wrong!",
            });
        });
};