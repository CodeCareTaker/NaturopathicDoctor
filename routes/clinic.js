var express    = require("express");
var router     = express.Router();
var NewsItem = require("../models/newsItem");
var middleware = require("../middleware");

router.get("/clinic", function(req, res){
   res.render("clinic"); 
});

router.get("/about", function(req, res){
   res.render("about"); 
});

router.get("/info", function(req, res){
   res.render("info"); 
});

router.get("/patientinfo", function(req, res){
   res.render("patientinfo"); 
});

//What's New - Shows news posted by site owner or admin
router.get("/whatsnew", function(req, res){
   //sort news in descending(latest) order
   NewsItem.find().sort({created: -1}).exec(function(err, news){
      if(err) {
          console.log("ERROR! " + err.message);
      } else {
          res.render("whatsnew/index", {news: news});
      }
   });
});

router.get("/whatsnewAsc", function(req, res){
   //sort news in ascending(oldest) order
   NewsItem.find().sort({created: 1}).exec(function(err, news){
      if(err) {
          console.log("ERROR! " + err.message);
      } else {
          res.render("whatsnew/index", {news: news});
      }
   });
});

//NEW ROUTE
router.get("/whatsnew/new", middleware.isAdmin, function(req, res){
    res.render("whatsnew/new");
});

//CREATE ROUTE
router.post("/whatsnew", middleware.isAdmin, function(req, res){
    // get data from form and add to campgrounds array
    var title = req.body.title;
    var content = req.body.content;
    var newNews = {title: title, content: content};
    // Create a new campground and save to DB
    console.log(newNews);
    NewsItem.create(newNews, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //req.flash(newNews.title + " has been posted!");
            //redirect back to campgrounds page
            res.redirect("/whatsnew");
        }
    });
});


//SHOW/EDIT - Load one News Item into form, with option to edit or remove.
router.get("/whatsnew/:id", middleware.isAdmin, function(req, res) {
    //find the NewsItem with provided ID
    NewsItem.findById(req.params.id, function(err, foundNews){
        if(err){
            req.flash("News entry not found");
            console.log(err);
            res.render("back");
        } else {
            //render show template with that News Item
            res.render("whatsnew/show", {newsItem: foundNews});
        }
    });
});

//UPDATE ROUTE
router.put("/whatsnew/:id", middleware.isAdmin, function(req, res){
    //update newsItem information
    NewsItem.findByIdAndUpdate(req.params.id, req.body.newsItem, function(err, updateNews){
        if(err) {
            res.redirect("/whatsnew");
        } else {
            req.flash("success", "News Item has been updated");
            res.redirect("/whatsnew");
        }
    });
});

//Delete Route
router.delete("/whatsnew/:id", middleware.isAdmin, function(req, res) {
    //remove news entry from the website
    NewsItem.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            req.flash("error", "Deletion Unsuccessful");
            res.redirect("/whatsnew");
        } else {
            req.flash("error", "News item has bee deleted");
            res.redirect("/whatsnew");
        }
    });
});

module.exports = router;