var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

router.get("/", function(req, res){
    res.render("landing");
});

//Auth Routes

//show register form
router.get("/register", function(req, res){
    res.render("register");
})

//handling user sign in
router.post("/register", function(req, res) {
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
router.get("/login", function(req, res){
    res.render("login");
});

//Login Logic
//middleware
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/whatsnew",
        failureRedirect: "/login",
    }), function(req, res) {
    
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;