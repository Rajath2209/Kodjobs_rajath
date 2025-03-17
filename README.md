# JobSeeker - Job Search Platform

A modern job-seeking platform built with React and Material-UI.

## Features

- **Landing Page**: Attractive 70:30 layout with job search imagery and login/signup forms
- **User Authentication**: Register and login functionality with form validation
- **Dashboard**: View job listings with search functionality
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- React
- Material-UI
- React Router
- Axios for API calls

## API Integration

The application is set up to integrate with the LinkedIn Bulk Data Scraper API:
- API Endpoint: https://linkedin-bulk-data-scraper.p.rapidapi.com/company_employee_companies
- API Key: 10ecef2d3bmsh4de9d4b4f522b4bp1469ffjsn6d7d3b89572c

## Project Structure

```
src/
├── login/          # Login component
├── register/       # Register component
├── user.json       # User data storage
├── data.json       # Job data storage
├── App.jsx         # Main application with routing
├── LandingPage.jsx # Landing page with 70:30 layout
├── Dashboard.jsx   # Job listings dashboard
└── main.jsx        # Entry point
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## Build for Production

```
npm run build
```

## License

MIT
# Kodjobs_rajath
