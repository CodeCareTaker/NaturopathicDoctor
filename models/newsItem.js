var mongoose = require("mongoose");

//SCHEMA SETUP
var newsItemSchema = new mongoose.Schema({
    title: String,
    content: String,
    created: {
        type: Date, 
        default: Date.now
    }
});

module.exports = mongoose.model("NewsItem", newsItemSchema);