# Indian Food API

A RESTful API service that provides comprehensive information about Indian dishes, including their ingredients, cooking methods, regional origins, and more.

## Features

- **Dish Information**: Detailed information about various Indian dishes
- **Search Functionality**: Search dishes by name, ingredients, or region
- **Filtering Options**: Filter dishes by:
  - Diet type (vegetarian/non-vegetarian)
  - Course type (main course, dessert, snack, starter)
  - Flavor profile (sweet, spicy, bitter, sour)
  - Region (North, South, East, West, North East, Central)
- **Pagination**: Efficient data retrieval with pagination support
- **Sorting**: Sort dishes by various parameters

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Various security middlewares (helmet, cors, rate-limiting, etc.)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jaisinghdhande/culinary-server.git
   cd indian-food-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```env

   PORT=3000
   DB_CONNECTION_STRING=mongodb://localhost:27017/indian-food (Check Mail for deployed mongodb)
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Dishes

- `GET /api/v1/dishes` - Get all dishes (with pagination)
- `GET /api/v1/dishes/:id` - Get a specific dish
- `GET /api/v1/dishes/search` - Search dishes
- `GET /api/v1/dishes/filter-options` - Get all filter options
- `GET /api/v1/dishes/ingredients` - Get all ingredients

### Query Parameters

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10)
- `sort`: Sort by field (e.g., name, -name for descending)
- `diet`: Filter by diet type
- `course`: Filter by course type
- `flavor_profile`: Filter by flavor profile
- `region`: Filter by region

## Example Requests

### Get All Dishes

```bash
GET /api/v1/dishes?page=1&limit=10&sort=-name
```

### Search Dishes

```bash
GET /api/v1/dishes/search?q=butter%20chicken
```

### Filter Dishes

```bash
GET /api/v1/dishes?diet=vegetarian&course=main%20course
```

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "status": "error",
  "message": "Error message here"
}
```

## Security

The API implements several security measures:

- CORS protection
- Rate limiting
- Helmet security headers
- NoSQL injection protection
- XSS protection
- Parameter pollution protection
