# Geo Bench

Geo Bench is a full-stack web application for discovering and sharing your favorite benches on an interactive map. Users can register, log in, add markers for benches with a title and description, and view benches added by others.

## Features

- **User Authentication**: Secure registration, login, and logout functionality using JWT.
- **Interactive Map**: Built with Leaflet and React-Leaflet to display and interact with bench locations.
- **Marker Management**: Authenticated users can add new bench markers, view details, and delete their own markers.
- **Protected Routes**: User profiles and other sensitive pages are protected and require authentication.
- **Dark/Light Mode**: A theme switcher allows users to toggle between light and dark modes, with preferences saved.
- **Responsive Design**: A clean and modern UI built with Tailwind CSS that works on all screen sizes.

## Tech Stack

- **Frontend**:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - React-Leaflet (for maps)
  - Axios (for API communication)
  - `next-themes` (for theme management)
- **Backend**:
  - Node.js / Express
  - PostgreSQL
  - JWT (for authentication)
- **Deployment**:
  - Docker & Docker Compose
  - Nginx

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm
- Docker and Docker Compose

### Running the Full Stack with Docker (Recommended)

This method runs the entire application (frontend and backend) in isolated containers.

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd social-geo-view
    ```

2.  **Environment Variables:**
    You may need to create `.env` files for the backend and frontend as specified in the `docker-compose.yml` file.

3.  **Build and Run:**
    Use the development Docker Compose file to build and start the services.

    ```bash
    docker-compose -f docker-compose.dev.yml up --build
    ```

4.  **Access the Application:**
    - The frontend will be available at `http://localhost:3000`.
    - The backend API will be available at `http://localhost:5000`.

### Running the Frontend Standalone

This method is for running only the Next.js frontend development server.

1.  **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a file named `.env.local` in the `frontend` directory and add the URL for your backend API:

    ```
    NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Available Scripts

Inside the `frontend` directory, you can run the following commands:

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm start`: Starts a production server (requires `npm run build` first).
- `npm run lint`: Lints the project files using ESLint.
