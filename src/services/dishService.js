const Dish = require("../models/Dish");

const getAllDishes = async (
  page = 1,
  limit = 10,
  sortBy = "name",
  order = "asc",
  filters = {}
) => {
  try {
    // Build filter object
    const filterQuery = {};

    // Add diet filter if provided
    if (filters.diet) {
      filterQuery.diet = filters.diet;
    }

    // Add course filter if provided (already an array from JSON.parse)
    if (filters.course && filters.course.length > 0) {
      filterQuery.course = { $in: filters.course };
    }

    // Add flavor profile filter if provided (already an array from JSON.parse)
    if (filters.flavor_profile && filters.flavor_profile.length > 0) {
      filterQuery.flavor_profile = { $in: filters.flavor_profile };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sortObject = {};
    sortObject[sortBy] = order === "desc" ? -1 : 1;

    // Get total count for pagination
    const total = await Dish.countDocuments(filterQuery);

    // Get paginated and filtered results
    const dishes = await Dish.find(filterQuery)
      .sort(sortObject)
      .skip(skip)
      .limit(parseInt(limit));

    return {
      success: true,
      count: dishes.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: dishes,
    };
  } catch (error) {
    throw new Error(`Error getting dishes: ${error.message}`);
  }
};

const searchDishes = async (searchQuery) => {
  try {
    // First try text search
    const textSearchQuery = { $text: { $search: searchQuery } };

    // Get dishes with text search
    const textSearchDishes = await Dish.find(textSearchQuery)
      .sort({
        score: { $meta: "textScore" },
      })
      .limit(10);

    // If we get enough results from text search, return them
    if (textSearchDishes.length === 10) {
      return {
        success: true,
        count: textSearchDishes.length,
        data: textSearchDishes,
      };
    }

    // If we need more results, try regex search on ingredients
    const remainingLimit = 10 - textSearchDishes.length;
    const regexSearchQuery = {
      ingredients: { $regex: searchQuery, $options: "i" },
      // Exclude dishes we already found
      _id: { $nin: textSearchDishes.map((dish) => dish._id) },
    };

    const regexSearchDishes = await Dish.find(regexSearchQuery)
      .sort({ name: "asc" })
      .limit(remainingLimit);

    // Combine results
    const combinedResults = [...textSearchDishes, ...regexSearchDishes];

    return {
      success: true,
      count: combinedResults.length,
      data: combinedResults,
    };
  } catch (error) {
    throw new Error(`Error searching dishes: ${error.message}`);
  }
};

const getDishById = async (id) => {
  try {
    const dish = await Dish.findById(id);
    if (!dish) {
      throw new Error("Dish not found");
    }
    return dish;
  } catch (error) {
    throw new Error(`Error getting dish: ${error.message}`);
  }
};

const getFilterOptions = async () => {
  try {
    const courses = await Dish.distinct("course");
    const flavorProfiles = await Dish.distinct("flavor_profile");

    return {
      success: true,
      data: {
        diets: ["vegetarian", "non-vegetarian"],
        courses,
        flavor_profiles: flavorProfiles.filter((flavor) => flavor !== null),
      },
    };
  } catch (error) {
    throw new Error(`Error getting filter options: ${error.message}`);
  }
};

const findDishesByIngredients = async (ingredients) => {
  try {
    // Convert ingredients array to lowercase for case-insensitive matching
    const normalizedIngredients = ingredients.map(ing => ing.toLowerCase().trim());

    // Find dishes where at least one ingredient matches
    const dishes = await Dish.aggregate([
      {
        $addFields: {
          // Convert dish ingredients to lowercase for comparison
          normalizedIngredients: {
            $map: {
              input: "$ingredients",
              as: "ingredient",
              in: { $toLower: "$$ingredient" }
            }
          }
        }
      },
      {
        $addFields: {
          // Calculate how many ingredients from the dish are available
          matchedIngredientsCount: {
            $size: {
              $setIntersection: ["$normalizedIngredients", normalizedIngredients]
            }
          },
          // Total ingredients required for the dish
          totalIngredientsCount: { $size: "$ingredients" }
        }
      },
      {
        $addFields: {
          // Calculate match percentage
          matchPercentage: {
            $multiply: [
              { $divide: ["$matchedIngredientsCount", "$totalIngredientsCount"] },
              100
            ]
          }
        }
      },
      {
        $match: {
          // Include dishes where at least one ingredient matches
          matchedIngredientsCount: { $gt: 0 }
        }
      },
      {
        $sort: {
          matchPercentage: -1,  // Sort by highest match first
          name: 1               // Then alphabetically by name
        }
      },
      {
        $limit: 10  // Limit to top 10 matches
      },
      {
        $project: {
          _id: 1,
          name: 1,
          ingredients: 1,
          diet: 1,
          prep_time: 1,
          cook_time: 1,
          course: 1,
          flavor_profile: 1,
          region: 1,
          state: 1,
          matchPercentage: 1,
          matchedIngredientsCount: 1,
          totalIngredientsCount: 1,
          missingIngredients: {
            $setDifference: ["$normalizedIngredients", normalizedIngredients]
          }
        }
      }
    ]);

    return {
      success: true,
      count: dishes.length,
      data: dishes.map(dish => ({
        ...dish,
        matchPercentage: Math.round(dish.matchPercentage),  // Round to whole number
        missingIngredients: dish.missingIngredients,
        matchedIngredientsCount: dish.matchedIngredientsCount,
        totalIngredientsCount: dish.totalIngredientsCount
      }))
    };
  } catch (error) {
    throw new Error(`Error finding dishes by ingredients: ${error.message}`);
  }
};

const getAllIngredients = async () => {
    try {
        // Get distinct ingredients and sort them alphabetically
        const ingredients = await Dish.distinct("ingredients");
        
        // Clean and sort the ingredients
        const cleanedIngredients = ingredients
            .filter(ingredient => ingredient && ingredient.trim()) // Remove null/empty
            .map(ingredient => ingredient.trim()) // Trim whitespace
            .sort((a, b) => a.localeCompare(b)); // Sort alphabetically

        return {
            success: true,
            count: cleanedIngredients.length,
            data: cleanedIngredients
        };
    } catch (error) {
        throw new Error(`Error getting ingredients: ${error.message}`);
    }
};

module.exports = {
  getAllDishes,
  getDishById,
  getFilterOptions,
  searchDishes,
  findDishesByIngredients,
  getAllIngredients
};
