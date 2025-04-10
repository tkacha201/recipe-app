const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Recipe = require("./models/Recipe");
const Comment = require("./models/Comment");

// Load environment variables
dotenv.config();

// Sample users
const users = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
  },
  {
    name: "Chef Gordon",
    email: "chef@example.com",
    password: "password123",
  },
];

// Sample recipe data
const recipeData = [
  {
    title: "Classic Spaghetti Carbonara",
    ingredients: [
      "350g spaghetti",
      "150g pancetta or guanciale, diced",
      "3 large eggs",
      "50g pecorino cheese, grated",
      "50g parmesan, grated",
      "2 cloves garlic, minced",
      "Salt and black pepper to taste",
    ],
    instructions: `1. Bring a large pot of salted water to boil and cook the spaghetti according to package directions until al dente.

2. While the pasta is cooking, heat a large skillet over medium heat. Add the pancetta or guanciale and cook until crispy, about 5-7 minutes.

3. In a bowl, whisk together the eggs, grated cheeses, and freshly ground black pepper.

4. When the pasta is done, reserve 1 cup of the pasta water, then drain.

5. Working quickly, add the hot pasta to the skillet with the pancetta, tossing to combine. Remove from heat.

6. Pour the egg and cheese mixture over the pasta, tossing quickly to create a creamy sauce. If needed, add a splash of the reserved pasta water to loosen the sauce.

7. Season with salt and additional black pepper to taste. Serve immediately with extra grated cheese on top.`,
    imageUrl:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
  },
  {
    title: "Homemade Margherita Pizza",
    ingredients: [
      "500g pizza dough",
      "200g san marzano tomatoes, crushed",
      "200g fresh mozzarella, sliced",
      "Fresh basil leaves",
      "2 tbsp olive oil",
      "1 clove garlic, minced",
      "Salt and pepper to taste",
    ],
    instructions: `1. Preheat your oven to the highest temperature (usually 500°F/260°C) with a pizza stone or baking sheet inside.

2. In a small bowl, mix the crushed tomatoes with minced garlic, 1 tbsp olive oil, salt, and pepper.

3. On a floured surface, stretch or roll the pizza dough into a 12-inch circle.

4. Transfer the dough to a piece of parchment paper or a floured pizza peel.

5. Spread the tomato sauce evenly over the dough, leaving a 1-inch border.

6. Arrange the mozzarella slices evenly over the sauce.

7. Slide the pizza onto the preheated stone or baking sheet and bake for 8-10 minutes until the crust is golden and the cheese is bubbly.

8. Remove from the oven, top with fresh basil leaves, drizzle with remaining olive oil, and serve immediately.`,
    imageUrl:
      "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
  },
  {
    title: "Chocolate Chip Cookies",
    ingredients: [
      "225g unsalted butter, softened",
      "200g brown sugar",
      "100g white sugar",
      "2 large eggs",
      "1 tsp vanilla extract",
      "300g all-purpose flour",
      "1 tsp baking soda",
      "1/2 tsp salt",
      "300g chocolate chips",
    ],
    instructions: `1. Preheat oven to 350°F (175°C) and line baking sheets with parchment paper.

2. In a large bowl, cream together the softened butter, brown sugar, and white sugar until light and fluffy, about 3 minutes.

3. Beat in the eggs one at a time, then stir in the vanilla.

4. In a separate bowl, whisk together the flour, baking soda, and salt.

5. Gradually add the dry ingredients to the wet ingredients, mixing just until combined.

6. Fold in the chocolate chips.

7. Drop rounded tablespoons of dough onto the prepared baking sheets, spacing them about 2 inches apart.

8. Bake for 10-12 minutes, until edges are golden but centers are still soft.

9. Allow cookies to cool on the baking sheet for 5 minutes before transferring to a wire rack to cool completely.`,
    imageUrl:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
  },
  {
    title: "Thai Green Curry",
    ingredients: [
      "2 tbsp green curry paste",
      "400ml coconut milk",
      "500g chicken breast, sliced",
      "1 red bell pepper, sliced",
      "1 zucchini, sliced",
      "100g green beans, trimmed",
      "2 tbsp fish sauce",
      "1 tbsp palm sugar or brown sugar",
      "Fresh Thai basil leaves",
      "2 kaffir lime leaves",
      "1 tbsp vegetable oil",
    ],
    instructions: `1. Heat the oil in a large pan or wok over medium heat. Add the curry paste and cook for 1 minute until fragrant.

2. Add half the coconut milk and bring to a simmer, stirring until the oil separates.

3. Add the chicken and stir to coat with the curry sauce. Cook for 3-4 minutes until chicken starts to turn white.

4. Add the remaining coconut milk, bell pepper, zucchini, green beans, fish sauce, sugar, and lime leaves. 

5. Simmer for 10-15 minutes until the chicken is cooked through and the vegetables are tender.

6. Taste and adjust seasonings if needed.

7. Remove from heat and stir in the Thai basil leaves.

8. Serve hot with steamed jasmine rice.`,
    imageUrl:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    title: "Classic French Omelette",
    ingredients: [
      "3 large eggs",
      "1 tbsp butter",
      "Salt and pepper to taste",
      "1 tbsp fresh chives, chopped",
      "30g Gruyère cheese, grated (optional)",
    ],
    instructions: `1. Crack the eggs into a bowl and whisk until the whites and yolks are fully combined. Season with salt and pepper.

2. Heat a non-stick skillet over medium heat. Add the butter and swirl to coat the pan.

3. When the butter is foaming but not brown, pour in the eggs.

4. As the eggs begin to set, use a spatula to gently pull the cooked edges toward the center, tilting the pan to allow uncooked egg to flow to the edges.

5. When the eggs are mostly set but still slightly runny on top, sprinkle the cheese (if using) over one half of the omelette.

6. Using your spatula, fold the omelette in half to enclose the filling.

7. Cook for another 30 seconds, then slide onto a plate.

8. Sprinkle with fresh chives and serve immediately.`,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1667807521536-bc35c8d8b64b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Homemade Guacamole",
    ingredients: [
      "3 ripe avocados",
      "1 lime, juiced",
      "1/2 red onion, finely diced",
      "2 Roma tomatoes, seeded and diced",
      "1/4 cup fresh cilantro, chopped",
      "1 jalapeño, seeded and minced",
      "1 clove garlic, minced",
      "1/2 tsp ground cumin",
      "Salt and pepper to taste",
    ],
    instructions: `1. Cut the avocados in half, remove the pits, and scoop the flesh into a bowl.

2. Add the lime juice and mash the avocados with a fork to your desired consistency (chunky or smooth).

3. Fold in the diced onion, tomatoes, cilantro, jalapeño, and garlic.

4. Season with cumin, salt, and pepper to taste.

5. Taste and adjust seasonings if needed, adding more lime juice or salt as necessary.

6. Serve immediately with tortilla chips, or cover with plastic wrap pressed directly onto the surface of the guacamole (to prevent browning) and refrigerate until ready to serve.`,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1681406689584-2f7612fa98a4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

// Sample comment templates
const commentTemplates = [
  "This recipe is amazing! I made it for my family and they loved it.",
  "I added {ingredient} and it turned out great!",
  "Thanks for sharing this recipe. It's now a regular in my home.",
  "Perfect recipe for beginners. Simple and delicious!",
  "I've tried many similar recipes, but this one is the best by far.",
  "Made this for dinner last night. Everyone asked for seconds!",
  "The flavors are so well balanced. Definitely making this again.",
  "I reduced the cooking time by 5 minutes and it was perfect for me.",
  "Love how easy this is to make. Great for busy weeknights.",
  "My kids are picky eaters but they devoured this!",
  "I substituted {ingredient} with {alternative} and it was still delicious.",
  "This has become a staple in our household. So good!",
  "The instructions were clear and easy to follow. Great recipe!",
  "I was skeptical at first, but this turned out amazing.",
  "Perfect balance of flavors. Not too complicated either!",
];

// Ingredients and alternatives for comment templating
const ingredients = [
  "garlic",
  "onions",
  "butter",
  "salt",
  "pepper",
  "olive oil",
  "cheese",
  "sugar",
];
const alternatives = [
  "honey",
  "coconut oil",
  "margarine",
  "herbs",
  "spices",
  "plant-based alternative",
  "low-fat option",
];

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    seedDatabase();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Function to seed the database
async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Recipe.deleteMany({});
    await Comment.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create recipes and assign them to users
    const recipes = recipeData.map((recipe, index) => ({
      ...recipe,
      createdBy: createdUsers[index % createdUsers.length]._id,
    }));

    const createdRecipes = await Recipe.create(recipes);
    console.log(`Created ${createdRecipes.length} recipes`);

    // Add some likes to recipes
    for (let i = 0; i < createdRecipes.length; i++) {
      const recipe = createdRecipes[i];
      // Each user likes some recipes (but not their own)
      for (let j = 0; j < createdUsers.length; j++) {
        const user = createdUsers[j];
        // Skip if this is the user's own recipe
        if (recipe.createdBy.toString() === user._id.toString()) continue;

        // Users like recipes with ~75% probability (to make it more natural)
        if (Math.random() < 0.75) {
          recipe.likes.push(user._id);
        }
      }
      await recipe.save();
    }
    console.log("Added likes to recipes");

    // Add comments to recipes
    const comments = [];
    for (const recipe of createdRecipes) {
      // Each user adds 1-3 comments per recipe (if they didn't create it)
      for (const user of createdUsers) {
        // Skip if this is the user's own recipe
        if (recipe.createdBy.toString() === user._id.toString()) continue;

        // Determine how many comments this user will add (1-3)
        const commentCount = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < commentCount; i++) {
          // Pick a random comment template
          let commentText =
            commentTemplates[
              Math.floor(Math.random() * commentTemplates.length)
            ];

          // If the template has placeholders, replace them
          if (commentText.includes("{ingredient}")) {
            const ingredient =
              ingredients[Math.floor(Math.random() * ingredients.length)];
            commentText = commentText.replace("{ingredient}", ingredient);
          }

          if (commentText.includes("{alternative}")) {
            const alternative =
              alternatives[Math.floor(Math.random() * alternatives.length)];
            commentText = commentText.replace("{alternative}", alternative);
          }

          comments.push({
            text: commentText,
            recipeId: recipe._id,
            userId: user._id,
          });
        }
      }
    }

    await Comment.create(comments);
    console.log(`Added ${comments.length} comments to recipes`);

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}
