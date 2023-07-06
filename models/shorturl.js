const mongoose = require("mongoose");

const ShortURLSchema = new mongoose.Schema({
    urlId: {
        type: String,
        require: true,
    },
    origUrl: {
        type: String,
        require: true,
    },
    shortUrl: {
        type: String,
        require: true,
    },
});

module.exports = mongoose.model("ShortURL", ShortURLSchema);
