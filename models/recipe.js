var mongoose = require("mongoose")

//SCHEMA SETUP
var recipeSchema = new mongoose.Schema({
    name: String,
    ingredients: String,
    instructions: String
});

module.exports = mongoose.model("Recipe", recipeSchema);