# Mono Manager

A simple project and task management app built with Next.js. This is a hobby project I made for my own use to keep track of projects and tasks.

## What it does

- Create and manage projects
- Add tasks to projects with different statuses
- Basic project and task organization
- That's it. Nothing fancy.

## Running it

First, you'll need to set up your environment variables:

1. Create a `.env.local` file in the root directory
2. Add your MongoDB connection string:

```bash
DB_URL=mongodb://localhost:27017/mono-manager
# or for MongoDB Atlas:
# DB_URL=mongodb+srv://username:password@cluster.mongodb.net/mono-manager
```

Then install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're good to go.

## Environment Variables

The application requires the following environment variable:

- `DB_URL`: MongoDB connection string

### Database Setup

You can use either:
1. **Local MongoDB**: Install MongoDB locally and use `mongodb://localhost:27017/mono-manager`
2. **MongoDB Atlas**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) and use the provided connection string

Make sure your database is running before starting the application.

## About this project

This is a personal hobby project. I built it because I needed something simple to manage my projects and tasks. It does what I need it to do.

If it works for you too, great. Feel free to use it, fork it, or do whatever you want with it.

## Suggestions welcome

If you have ideas for improvements or find bugs, I'd appreciate hearing about them. Open an issue or submit a pull request.

## Tech stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui components
- MongoDB with Mongoose
- Server Actions for API calls
