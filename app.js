var express               = require("express"),
    expressSanitizer = require("express-sanitizer"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    flash                 = require("connect-flash"),
    methodOverride        = require("method-override"),
    NewsItem              = require("./models/newsItem"),
    Recipe                = require("./models/recipe"),
    User                  = require("./models/user"),
    LocalStraegy          = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
    //seedDB                = require("./seeds")

var url = process.env.DATABASEURL || "mongodb://localhost/wnhc_v2";
mongoose.connect(url);

var app = express();
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));
app.use(flash());


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"What is going on?",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStraegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Fills the database with recipes
//seedDB();

//===============
// ROUTES
//===============

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/clinic", function(req, res){
   res.render("clinic"); 
});

app.get("/about", function(req, res){
   res.render("about"); 
});

app.get("/info", function(req, res){
   res.render("info"); 
});

app.get("/patientinfo", function(req, res){
   res.render("patientinfo"); 
});

app.get("/policies", function(req, res){
   res.render("policies"); 
});

//What's New - Shows news posted by site owner or admin
app.get("/whatsnew", function(req, res){
   //sort news in descending(latest) order
   NewsItem.find().sort({created: -1}).exec(function(err, news){
      if(err) {
          console.log("ERROR! " + err.message);
      } else {
          res.render("whatsnew/index", {news: news});
      }
   });
});

app.get("/whatsnewAsc", function(req, res){
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
app.get("/whatsnew/new", isAdmin, function(req, res){
    res.render("whatsnew/new");
});

//CREATE
app.post("/whatsnew", isAdmin, function(req, res){
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
            res.redirect("/whatsnew");
        }
    });
});


//SHOW/EDIT - Load one News Item into form, with option to edit or remove.
app.get("/whatsnew/:id", isAdmin, function(req, res) {
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
app.put("/whatsnew/:id", isAdmin, function(req, res){
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
app.delete("/whatsnew/:id", isAdmin, function(req, res) {
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


//RESOURCE ROUTES

//Default recipe page
app.get("/recipes", function(req, res){
   //sort recipes in alphabetical order. Default
   Recipe.find().sort({name: 1}).exec(function(err, allRecipes){
      if(err) {
          console.log("ERROR!");
      } else {
          res.render("recipes/index", {recipes: allRecipes});
      }
   });
});

app.get("/recipesDesc", function(req, res){
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
app.get("/recipes/new", isAdmin, function(req, res){
    res.render("recipes/new");
});

//CREATE - Add new recipe to database
app.post("/recipes", function(req, res){
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
app.get("/recipes/:id/", isAdmin, isAdmin, function(req, res){
    Recipe.findById(req.params.id, function(err, foundRecipe) {
        if(err){
            res.render("/recipes");
        } else {
            res.render("recipes/show", {recipe: foundRecipe});
        }
    });
});

//EDIT ROUTE
app.get("/recipes/:id/edit", isAdmin, isAdmin, function(req, res){
    Recipe.findById(req.params.id, function(err, editRecipe) {
        if(err){
            res.render("/recipes");
        } else {
            res.render("recipes/edit", {recipe: editRecipe});
        }
    });
});

//UPDATE ROUTE
app.put("/recipes/:id", isAdmin, function(req, res){
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
app.delete("/recipes/:id", isAdmin, function(req, res) {
    //remove news entry from the website
    NewsItem.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            req.flash("error", "Deletion Unsuccessful");
            res.redirect("/recipes");
        } else {
            req.flash("error", "Recipe deletion successful");
            res.redirect("/recipes");
        }
    });
});

app.get("/seminars", function(req, res){
   res.render("seminars"); 
});


//TREATMENT ROUTES


app.get("/treatment", function(req, res){
   res.render("treatment"); 
});

app.get("/treatment/emdr", function(req, res){
   res.render("emdr"); 
});


app.get("/treatment/nlp", function(req, res){
   res.render("nlp"); 
});

//Auth Routes

//show register form
app.get("/register", function(req, res){
    res.render("register");
})

//handling user sign in
app.post("/register", function(req, res) {
    req.body.username
    req.body.password
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        })
    })
})

//Login Routes
//render login form
app.get("/login", function(req, res){
    res.render("login");
});

//Login Logic
//middleware
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/whatsnew",
        failureRedirect: "/login",
    }), function(req, res) {
    
});

//logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function isAdmin(req, res, next){
    if(req.user && req.user.isAdmin == true){
        return next();
    } 
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("WNHC is online!");
});