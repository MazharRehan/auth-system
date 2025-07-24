# Step 2: Create main folders
mkdir controllers models routes middlewares utils config

# Step 3: Create necessary files in each folder
touch controllers/authController.js
touch models/User.js
touch routes/authRoutes.js
touch middlewares/authMiddleware.js
touch middlewares/roleMiddleware.js
touch utils/generateTokens.js
touch config/db.js

# Step 4: Create root-level files
touch .env
touch server.js

