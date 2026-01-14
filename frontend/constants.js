export const ViewState = {
  LANDING: 'LANDING',
  CUSTOMIZER: 'CUSTOMIZER',
  SHOP: 'SHOP',
  CART: 'CART'
};

// API Base URL - can be configured via VITE_API_URL environment variable
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';
