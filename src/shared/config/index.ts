// App configuration
export const APP_CONFIG = {
  name: "Map of Events",
  description: "Medical dashboard application",
  version: "0.1.0",
} as const

// Theme configuration
export const THEME_CONFIG = {
  defaultTheme: "system",
  storageKey: "map-of-events-theme",
} as const

// API configuration
export const API_CONFIG = {
  baseUrl: "https://jsonplaceholder.typicode.com",
  timeout: 5000,
} as const