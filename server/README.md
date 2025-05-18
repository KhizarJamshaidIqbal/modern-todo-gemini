# Todo App Backend

This is the backend server for the Todo application. It provides a RESTful API for the React frontend to perform CRUD operations on todos.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation, MongoDB Atlas, or any other MongoDB provider)

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://khizarjamshaidiqbal:svcpRYdquS1Jxr3r@34.72.160.101:27017/admin
   ```
   
   Note: The MongoDB URI above is provided as an example. You may need to adjust it if your connection details change.

3. Start the development server with hot reloading:
   ```
   npm run dev
   ```

4. Or start the server in production mode:
   ```
   npm start
   ```

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
  - Body: `{ "title": "Todo title", "priority": "low"|"medium"|"high" }`
- `PUT /api/todos/:id` - Update a todo
  - Body: `{ "completed": true, "title": "Updated title", "priority": "high" }` (any field is optional)
- `DELETE /api/todos/:id` - Delete a todo

## Todo Model

Each todo has the following structure:

```json
{
  "_id": "MongoDB ObjectId",
  "title": "String (required)",
  "completed": "Boolean (default: false)",
  "priority": "String (enum: low, medium, high, default: medium)",
  "createdAt": "Date (default: current date)"
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- 200/201 - Success
- 400 - Bad request (e.g., missing required fields)
- 404 - Resource not found
- 500 - Server error

## Offline Support

The backend is designed to work with the frontend's offline capabilities. The front-end will store pending operations locally and sync them when the connection is restored. 