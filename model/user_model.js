const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    uid: { type: String, required: true },
    image: String,
    email: String,
    mobile: String,
    fcm_token: String
}, {
    timestamps: true
})

module.exports = mongoose.model(
    'users', userSchema, 'Users'
);