var NewsItem = require("../models/newsItem");
var Recipe   = require("../models/recipe");



//all the middleware goes here
var middlewareObj = {};

function isAdmin(req, res, next){
    if(req.user && req.user.isAdmin == true){
        return next();
    } 
    res.redirect("/login");
}

module.exports = middlewareObj;

