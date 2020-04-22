const { Schema, model } = require('mongoose')

// const Profile = require('./Profile')

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 15,
        required: true,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    profilePic: {
        type: String,
        default: '/uploads/profile.png'
    }

}, {
    timestamps: true
})

const User = model('User', userSchema)

module.exports = User