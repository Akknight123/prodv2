require('dotenv').config();



exports.login = (req, res) => {
    // console.log("userID", req.body.userID)
    // console.log("password", req.body.password)
    // console.log("USERID", process.env.USERID)
    // console.log("PASSWORD", process.env.PASSWORD)
    if (req.body.userID == process.env.USERID && req.body.password == process.env.PASSWORD) {
        res.status(200).json({
            status: true,
            message: "Logged in successful",

        });
    } else {
        res.status(200).json({
            status: false,

            message: "Credentials not match",

        });
    }
}