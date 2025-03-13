# Crowdsourced Noise Map

This project is a Next.js application that enables users to report noise levels in their area and visualize these reports on an interactive map. It aims to create a platform for crowdsourced noise level reporting in urban areas, potentially aiding urban planning and community noise management.

## Getting Started

### Prerequisites
- Node.js (version specified in `.nvmrc` or `package.json`, typically the latest LTS)
- PostgreSQL (for database operations)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/noise-mapper
   cd noise-mapper```
2. Install dependencies:
   ```npm install```
3. Set up the database:
  - Ensure PostgreSQL is running on your system.
  - Create a database and set the DATABASE_URL environment variable in a .env file, e.g., DATABASE_URL=postgresql://user:password@localhost:5432/dbname.
  - Run Prisma migrations to set up the schema:
    narn prisma migrate dev```
4. Start the development server:
```yarn dev```
5. Open http://localhost:3000 in your browser to see the application in action.

### Key Notes
1. Noise Reporting:
- Users can record noise levels using their device's microphone or manually input decibel values.
- Reports include location data (latitude and longitude), captured via geolocation.
- Validation ensures decibel levels are within a reasonable range (0-150 dB).

2. Map Display:
- Utilizes Leaflet for an interactive map, displaying noise reports as circles with colors indicating intensity.
- Includes a heatmap layer for visualizing noise distribution, with customizable options like radius and gradient.
- It supports zooming and panning with custom zoom controls for a better user experience.

3. Search Bar:
- Implements location search using the OpenStreetMap provider via leaflet-geosearch.
- Users can search for places (e.g., "Lagos, Nigeria") and center the map on the selected location.
- Results are debounced for performance, with a loading spinner during searches.

4. API:
- ```/api/noise```: GET to fetch the latest 1000 noise reports, ordered by timestamp; POST to submit new reports.
- ```/api/test-db```: GET to test database connectivity, useful for debugging.
- Uses Prisma Client for database operations, with singleton pattern for production efficiency.


### Project Structure
The project is organized as follows:

```
├── .gitignore
├── README.md
├── app
    ├── api
    │   ├── noise
    │   │   └── route.ts
    │   └── test-db
    │   │   └── route.ts
    ├── favicon.ico
    ├── globals.css
    ├── layout.tsx
    └── page.tsx
├── components
    ├── NoiseInput.tsx
    ├── NoiseMap.tsx
    └── SearchBar.tsx
├── eslint.config.mjs
├── hooks
    ├── useAudioAnalyzer.ts
    └── useGeolocation.ts
├── lib
    └── validators.ts
├── middleware.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma
    ├── migrations
    │   ├── 20250310164723_init
    │   │   └── migration.sql
    │   └── migration_lock.toml
    └── schema.prisma
├── public
    ├── audioWorker.js
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── vercel.svg
    └── window.svg
├── tailwind.config.js
├── tsconfig.json
├── types.ts
└── types
    └── leaflet.heat.d.ts
```

|Directory/File   | Description |
| --------        | ------- |
| ```app/```        | Contains pages and API routes, including the main page and noise API.   |
|   ```components/```     |  React components like `NoiseInput`, `NoiseMap`, and `SearchBar`.    |
|  `hooks/`        |  Custom hooks for audio analysis (`useAudioAnalyzer`) and geolocation (`useGeolocation`).  |
|   `lib/`     |   Utility functions, including validation schemas with Zod.   |
|  `prisma/`        |  Prisma schema and migrations for database management.  |
|   `public/`     |  Static assets like favicon, SVGs for icons, and the audio worker script.    |
|   `next.config.ts`       |  Next.js configuration, including Webpack fixes for Leaflet.  |
|    `tailwind.config.js`    |   Tailwind CSS configuration for styling.   |
|    `tsconfig.json`      |  TypeScript configuration for the project.  |



### Technologies Used
- Next.js (15.2.1): React framework for server-side rendering and routing, ensuring fast load times and SEO optimization.
- Leaflet (1.9.4): JavaScript library for interactive maps, used for displaying noise reports.
- Prisma (6.4.1): ORM for PostgreSQL, handling database operations with type safety.
- Zod (3.24.2): Validation library for ensuring data integrity, especially for noise reports.
- React Leaflet (5.0.0): React components for integrating Leaflet maps.
- SWR (2.3.3): React hooks for data fetching and caching, used for fetching noise reports.
- Tailwind CSS (4.x): Utility-first CSS framework for responsive design.

### Contributing
To contribute to this project, please follow these steps:

- Fork the repository to your GitHub account.
- Create a new branch for your feature or bug fix:
  `git checkout -b feature/your-feature-name`
- Make your changes and commit them with descriptive messages.
- Push to the branch and submit a pull request, detailing your changes and any testing performed.


### License
This project is licensed under the MIT License. See the LICENSE file for more details.


This executes Prisma migrations and builds the Next.js app. Check the Vercel deployment documentation for more details.


