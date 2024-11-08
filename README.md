# Full Stack Open Course Assignments, Part 13

This repository contains the **Blog** project from **Part 13** of the Full Stack Open course. The primary focus of this project is the backend, **`postgres-blogs-backend`**, a Node application with a PostgreSQL database managed in Docker. The backend can be tested using the REST package in the `requests` folder of the application. Additionally, a frontend, **`blogs_query`**, was developed as a refactored version of the app from **Part 7** of the Full Stack Open course, enabling full backend functionality to be tested in a browser.

All prepared data is persisted using a named Docker volume (`volumes`), so you can log in as any of the following users to test the app:
- **Username**: "lemon@lemon.com", **Password**: "sokol"
- **Username**: "admin@admin.com", **Password**: "admin"
- **Username**: "test@test.com", **Password**: "tester"

### Setup Instructions

Ensure Docker is installed on your machine.

1. **Clone this repository**:
    ```sh
    git clone https://github.com/lemon1964/Fullstackopen_GitHub.git
    ```
2. Navigate to the backend (`postgres-blogs-backend`) and frontend (`blogs_query`) directories within the project for setup in `part13`.

3. **Install dependencies** in each directory:
    ```sh
    npm install
    ```

4. **Set up environment variables**: Create a `.env` file in the `postgres-blogs-backend` directory and add:
    ```plaintext
    DATABASE_URL=postgres://postgres:mysecretpasswordblog@localhost:5434/postgres
    SECRET=qwerty
    ```
   _(Frontend does not require environment variables)._

5. **Start the PostgreSQL container** for the backend:
    ```sh
    docker-compose up -d
    ```
   This command creates a `postgres` container to handle data.

6. **Start the backend server**:
    ```sh
    npm run dev
    ```
   Wait for `nodemon` to complete migrations and confirm that the server is running. You can verify the data is available at `http://localhost:3003/api/users` and `http://localhost:3003/api/blogs`.

7. **Start the frontend**:
    ```sh
    npm run dev
    ```
   Then, open `http://localhost:5173/` in your browser, and log in using one of the accounts mentioned above.

### Backend `postgres-blogs-backend` Functionality

- **Basic Testing**: The backend can be directly tested in the browser.
- **CRUD Operations**: Create, like, and delete blogs.
- **Error Handling**: Errors for tokens and application issues are handled in `postgres-blogs-backend/util/middleware.js`, utilizing `express-async-errors`.
- **User Management**: You can add or modify usernames using REST requests on the backend.
- **Relationship Display**: Each blog shows the user who added it, and each user displays their added blogs.
- **Keyword Search**: Search blogs by title or author.
- **Frontend Blog Display**: Blogs received from the backend are sorted by likes.
- **Authors Menu**: Shows backend-provided author information, sorted by likes.
- **Reading List Management**: Use the `Mark as Reading` button to add blogs to a reading list. Once added, blogs can be marked as read with the `Mark as Read` button. A user’s own blogs are labeled `My blog`, and read blogs are marked as `Read`.
- **User Blog List**: Visit the USERS menu to see a user’s blogs and their reading list, with options to filter by read and unread statuses.
- **User Disable Warning**: Selecting DISABLE in the Menu displays a warning on the homepage. This action will require you to log out and back in to continue creating, deleting, and reading blogs.

If you have any questions or need clarification, please feel free to reach out!