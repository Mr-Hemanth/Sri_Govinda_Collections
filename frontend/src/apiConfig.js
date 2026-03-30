const rawBaseUrl = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api').trim();

// Normalize the URL:
// 1. Remove any trailing slashes
// 2. Ensure it ends with /api
let normalizedUrl = rawBaseUrl.replace(/\/+$/, '');

if (!normalizedUrl.endsWith('/api')) {
    normalizedUrl = `${normalizedUrl}/api`;
}

export const API_BASE_URL = normalizedUrl;
