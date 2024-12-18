const getApiUrl = () => {
  const mode = import.meta.env.MODE;
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    console.warn(`No API URL configured for mode: ${mode}`);
    return mode === 'development'
      ? 'http://localhost:3000/api'
      : 'https://goofy-olympics-api.stroyco.eu/api';
  }

  return apiUrl;
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
    },
    QUESTIONS: {
      BASE: '/api/questions',
      BY_ID: (id: number) => `/api/questions/${id}`,
    },
    ATHLETES: {
      BASE: '/api/athletes',
      BY_ID: (id: number) => `/api/athletes/${id}`,
    },
    REGIONS: {
      BASE: '/api/regions',
    },
    MEDALS: {
      BASE: '/api/medals',
    },
    EVENTS: {
      BASE: '/api/events',
    },
  },
};
