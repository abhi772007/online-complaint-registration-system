const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        default: "",
        trim: true
    },

    role: {
        type: String,
        enum: ["USER", "AGENT", "ADMIN"],
        default: "USER"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);