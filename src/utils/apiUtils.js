/**
 * Builds the query string for the dishes API
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.sortBy - Field to sort by
 * @param {string} params.order - Sort order ('asc' or 'desc')
 * @param {Object} params.filters - Filter parameters
 * @returns {string} Query string
 */
const buildDishesQueryString = (params) => {
    const { page = 1, limit = 10, sortBy = 'name', order = 'asc', filters = {} } = params;

    // Initialize URLSearchParams
    const queryParams = new URLSearchParams();

    // Add pagination params
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    // Add sorting params
    queryParams.append('sortBy', sortBy);
    queryParams.append('order', order);

    // Add diet filter (single value)
    if (filters.diet) {
        queryParams.append('diet', filters.diet);
    }

    // Add course filter (array)
    if (filters.course && filters.course.length > 0) {
        queryParams.append('course', JSON.stringify(filters.course));
    }

    // Add flavor profile filter (array)
    if (filters.flavor_profile && filters.flavor_profile.length > 0) {
        queryParams.append('flavor_profile', JSON.stringify(filters.flavor_profile));
    }

    return queryParams.toString();
};

/**
 * Fetches dishes with the given filters
 * @param {Object} params - Query parameters
 * @returns {Promise} Promise that resolves to the API response
 */
const fetchDishes = async (params) => {
    try {
        const queryString = buildDishesQueryString(params);
        const response = await fetch(`/api/dishes?${queryString}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch dishes');
        }

        return data;
    } catch (error) {
        console.error('Error fetching dishes:', error);
        throw error;
    }
};

/**
 * Fetches available filter options
 * @returns {Promise} Promise that resolves to the filter options
 */
const fetchFilterOptions = async () => {
    try {
        const response = await fetch('/api/dishes/filter-options');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch filter options');
        }

        return data;
    } catch (error) {
        console.error('Error fetching filter options:', error);
        throw error;
    }
};

module.exports = {
    buildDishesQueryString,
    fetchDishes,
    fetchFilterOptions
}; 