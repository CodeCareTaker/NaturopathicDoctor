var express    = require("express");
var router     = express.Router();
var middleware = require("../middleware");

router.get("/treatment", function(req, res){
   res.render("treatment"); 
});

router.get("/treatment/emdr", function(req, res){
   res.render("emdr"); 
});


router.get("/treatment/nlp", function(req, res){
   res.render("nlp"); 
});

module.exports = router;