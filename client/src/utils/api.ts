import axios from 'axios';

// Get the API URL from environment variables or use a default
const apiUrl = process.env.REACT_APP_API_URL || '/api';

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 