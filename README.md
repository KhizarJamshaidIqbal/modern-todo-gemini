# Modern Todo App

A modern Todo application built with React, Redux, and Node.js.

## Project Structure

- `/src` - Frontend React application with Redux state management
- `/server` - Backend Node.js server with Express and MongoDB

## Getting Started

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/todos
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. From the project root, install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

## Features

- Create, read, update, and delete todos
- Set priority levels for todos
- Mark todos as completed
- Responsive design
- Error handling for database connection issues

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/8df2de6c-446a-46f4-8dcf-3870612c6c8b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/8df2de6c-446a-46f4-8dcf-3870612c6c8b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/8df2de6c-446a-46f4-8dcf-3870612c6c8b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
