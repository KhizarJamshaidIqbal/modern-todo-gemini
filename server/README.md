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
   MONGODB_URI=mongodb://DatabseUserName:DatabasePassword@DatabaseIP/admin
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

## MongoDB on Google Cloud Platform (GCP)

This project can be deployed with MongoDB running on Google Cloud Platform. Here's how to set it up:

### Creating a MongoDB VM on GCP

1. Go to Google Cloud Console and navigate to Compute Engine
2. Click "Create Instance" and select a suitable machine type (e.g., e2-small)
3. Select Ubuntu as the operating system (20.04 LTS or newer)
4. Allow HTTP/HTTPS traffic in the firewall settings
5. Create and launch the VM

### Installing MongoDB on GCP VM

1. SSH into your VM from GCP Console
2. Update package lists and install MongoDB:
   ```
   sudo apt update
   sudo apt install -y mongodb
   ```
3. Enable and start MongoDB service:
   ```
   sudo systemctl enable mongodb
   sudo systemctl start mongodb
   ```
4. Configure MongoDB for remote access by editing `/etc/mongodb.conf`:
   ```
   sudo nano /etc/mongodb.conf
   ```
   - Change `bind_ip` from 127.0.0.1 to 0.0.0.0
   - Save and restart: `sudo systemctl restart mongodb`

### Securing MongoDB on GCP

1. Create an admin user:
   ```
   mongosh
   use admin
   db.createUser({
     user: "adminUser",
     pwd: "securePassword",
     roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
   })
   ```

2. Enable authentication in `/etc/mongodb.conf`:
   ```
   auth = true
   ```

3. Configure GCP firewall to only allow specific IP addresses to access MongoDB port (27017)

### Connecting to GCP MongoDB

Update your `.env` file with the GCP VM's external IP address:
```
MONGODB_URI=mongodb://username:password@YOUR_GCP_VM_IP:27017/your_db_name?authSource=admin
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