var mongoose = require("mongoose")
var Recipe = require("./models/recipe")

var data = [
            {
                name: "Aduki, Orzo and Pepper Salad",
                ingredients: "2 cups Cooked orzo pasta, 1 cup Finely-diced crunchy fennel, 1 cup Slivered roasted red peppers, 1/4 cup Finely-sliced pitted olives, 1/2 cup Packed Italian parsley -- chopped, 1/2 cup Dressing made with olive oil, balsamic vinegar (or lemon juice), and garlic (optional), Salt -- to taste, Freshly-ground black pepper -- to taste, Crumbled goat or feta cheese -- for garnish (optional)",
                instructions: "Mix the ingredients together and season with salt and pepper; garnish with cheese. This recipe yields 4 servings."
            },
            {
                name: "Shredded Wheat Surprise", 
                ingredients: "2 bars of shredded wheat, 1 cup soy milk, cup hot water, cup fresh or dried fruit",
                instructions: "Add all together but hot water then add enough hot water until warm."
            },
            {
                name: "Fruit Shake", 
                ingredients: "1 cup fresh fruit, 1 cup & banana with water in blender",
                instructions: "process until smooth and pour over rice."
            },
            {
                name: "Frozen Banana Smoothie", 
                ingredients: "1 cup frozen banana chunks, 1 cup frozen fruit (strawberries, raspberries, blueberries, etc.), 1 cup fruit juice (orange, pineapple, apple, etc.)",
                instructions: "Place all ingredients in a blender jar and process until smooth for a frozen smoothie that's better than ice cream."
            },
            {
                name: "Non-Dairy Pizza", 
                ingredients: "2 Whole wheat pitas, 1 tsp. Dried Oregano, 1/2 cup pasta sauce, green pepper sliced, 1/2 cup diced onions, 1/2 cup shredded tofu cheese",
                instructions: "Spread pitas with pasta sauce. Top with green pepper, onions & oregano. Sprinkle with Tofu cheese. Bake for 10 minutes at 4500 or until cheese is melted."
            },
            {
                name: "Almost Instant Breakfast", 
                ingredients: "1/2 cup quick cooking oatmeal, 1/2 cup applesauce, 1 banana, 1 tbsp raisins, dash of cinnamon, 1/2 cup of boiling water",
                instructions: "Combine all but water & banana in covered bowl & let sit overnight. In morning, add boiling water, stir, let rest for 5 minutes slice banana into mix & eat."
            }
];
    
   
function seedDB(){
    //Remove all recipes
    Recipe.remove({}, function(err){
        if(err){
            console.log(err)
        }
        console.log("removed recipes!");
        //Add a few recipes
        data.forEach(function(seed){
            Recipe.create(seed, function(err, recipe) {
                if(err){
                    console.log(err);
                } else {
                console.log("added a recipe");
                }
            });
        });
    });
}

module.exports = seedDB;


