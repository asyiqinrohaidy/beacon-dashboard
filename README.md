# BeaconCore — React Frontend

A real-time employee location tracking dashboard built with React and Recharts.

## Tech Stack
- **React + Vite** — Frontend framework
- **React Router** — Navigation
- **Axios** — API calls
- **Recharts** — Charts and graphs

## Pages
- **Live Map** — Employee cards with online/offline status, auto-refreshes every 5 seconds
- **Floor Plan** — Visual office map showing employees in rooms in real time
- **Presence Logs** — Full history table with search, filter, and charts
- **Settings** — Manage office locations and employees

## Installation

1. Clone the repository
```bash
git clone https://github.com/asyiqinrohaidy/beacon-dashboard.git
cd beacon-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Update API base URL in `src/api/axios.js`
```js
baseURL: 'http://localhost:8000/api'
```

4. Start the development server
```bash
npm run dev
```

5. Open `http://localhost:5173`

## Backend
Laravel API: [beacon-tracker](https://github.com/asyiqinrohaidy/beacon-tracker)
