var express    = require("express");
var router     = express.Router();
var Recipe     = require("../models/recipe");
var middleware = require("../middleware");

//Default recipe page
router.get("/recipes", function(req, res){
   //sort recipes in alphabetical order. Default
   Recipe.find().sort({name: 1}).exec(function(err, allRecipes){
      if(err) {
          console.log("ERROR!");
      } else {
          res.render("recipes/index", {recipes: allRecipes});
      }
   });
});

router.get("/recipesDesc", function(req, res){
   //sort recipes in reverse alphabetical order
   Recipe.find().sort({name: -1}).exec(function(err, allRecipes){
      if(err) {
          console.log("ERROR!");
      } else {
          res.render("recipes/index", {recipes: allRecipes});
      }
   });
});

//NEW ROUTE
router.get("/recipes/new", middleware.isAdmin, function(req, res){
    res.render("recipes/new");
});

//CREATE - Add new recipe to database
router.post("/recipes", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var ingredients = req.body.ingredients;
    var instructions = req.body.instructions;
    var recipe = {name: name, ingredients: ingredients, instructions: instructions};
    // Create a new campground and save to DB
    console.log(recipe);
    Recipe.create(recipe, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //req.flash(recipe.name + " has been posted!");
            //redirect back to recipes page
            res.redirect("/recipes");
        }
    });
});

//SHOW ROUTE - SAME AS EDIT
router.get("/recipes/:id/", middleware.isAdmin, function(req, res){
    Recipe.findById(req.params.id, function(err, foundRecipe) {
        if(err){
            res.render("/recipes");
        } else {
            res.render("recipes/show", {recipe: foundRecipe});
        }
    });
});

//EDIT ROUTE
router.get("/recipes/:id/edit", middleware.isAdmin, function(req, res){
    Recipe.findById(req.params.id, function(err, editRecipe) {
        if(err){
            res.render("/recipes");
        } else {
            res.render("recipes/edit", {recipe: editRecipe});
        }
    });
});

//UPDATE ROUTE
router.put("/recipes/:id", middleware.isAdmin, function(req, res){
    //update newsItem information
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updaterecipe){
        if(err) {
            res.redirect("/recipes");
        } else {
            req.flash("success", "Recipe has been updated");
            res.redirect("/recipes");
        }
    });
});

//Delete Route
router.delete("/recipes/:id", middleware.isAdmin, function(req, res) {
    //remove news entry from the website
    Recipe.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            req.flash("error", "Deletion Unsuccessful");
            res.redirect("/recipes");
        } else {
            req.flash("error", "Recipe deletion successful");
            res.redirect("/recipes");
        }
    });
});

router.get("/seminars", function(req, res){
   res.render("seminars"); 
});

module.exports = router;