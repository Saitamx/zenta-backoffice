const DEFAULT_PROD_API = "https://zenta-backend-production.up.railway.app/api";
const DEFAULT_DEV_API = "http://localhost:3000/api";

export const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production" ? DEFAULT_PROD_API : DEFAULT_DEV_API);
