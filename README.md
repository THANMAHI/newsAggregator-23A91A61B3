# HackerNews Aggregator

A high-performance React and Vite news aggregator portal built to demonstrate modern web performance optimization techniques. The application fetches the top 500 stories from the HackerNews API, providing title search filtering, sorting by story score, and aggregate stats calculations.

## Core Features
- **Vibrant Tech Theme**: Implements a highly polished slate-dark responsive theme with custom animations and interactive controls.
- **Top 500 Stories**: Downloads and lists HackerNews articles showing titles, scores, authors, and publish dates.
- **Search & Sort**: Real-time title filtering and descending score sorting.
- **Stats Dashboard**: Dynamically computes aggregate story metrics (total stories, total score, average score).

---

## Performance Optimizations
This repository showcases the transition from a highly unoptimized application (available on the `slow-version` branch) to a premium, high-performance web app on the `main` branch.

Key optimizations implemented on the `main` branch:
1. **Parallel Network Requests**: Replaced the sequential N+1 network waterfall loop with `Promise.all` detail fetches.
2. **List Virtualization**: Configured `@tanstack/react-virtual` to only render viewport-visible articles, maintaining a tiny DOM layout and ensuring instantaneous interactivity (low INP/TBT).
3. **Dependency Optimization**: Cherry-picked Lodash imports (`lodash/sortBy`, `lodash/sumBy`) to exclude unused library code.
4. **Calculations Memoization**: Reused a single `Intl.DateTimeFormat` instance and wrapped render conversions in `React.memo` / `useMemo`.
5. **Hero Image Optimization**: Converted the hero banner image to modern WebP format, exported responsive sizes for a `srcset` layout, and set explicit width/height dimensions (reducing CLS to 0).
6. **Code Splitting**: Dynamically loaded the stats dashboard panel via `React.lazy` and `Suspense` to split bundle assets.

For the full detailed performance audit report, refer to [PERFORMANCE.md](file:///c:/Users/thanm/Documents/NewsAggregator/PERFORMANCE.md).

---

## Local Installation & Setup

Ensure you have [Node.js (v18+)](https://nodejs.org/) installed.

1. Clone the repository and navigate to the project root:
   ```bash
   cd NewsAggregator
   ```
2. Install the application dependencies:
   ```bash
   npm install
   ```

---

## Running the Application Locally

### Running the Optimized Version (Main Branch)
1. Ensure you are on the `main` branch:
   ```bash
   git checkout main
   ```
2. Run the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the URL printed in your terminal (usually `http://localhost:5173`).

### Running the Unoptimized Version (Slow-Version Branch)
1. Switch to the `slow-version` branch:
   ```bash
   git checkout slow-version
   ```
2. Install dependencies (if switching for the first time):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## Containerization with Docker

You can containerize and serve the production build of the optimized application using Docker and Docker Compose.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Instructions
1. Copy the environment variables template:
   ```bash
   cp .env.example .env
   ```
2. Build and start the container in detached mode:
   ```bash
   docker-compose up -d --build
   ```
3. Access the application in your web browser at:
   ```
   http://localhost:3000
   ```
4. Verify the container health status:
   ```bash
   docker-compose ps
   ```
5. To stop the application, run:
   ```bash
   docker-compose down
   ```
