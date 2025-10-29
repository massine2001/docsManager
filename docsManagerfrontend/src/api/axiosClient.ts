import axios from "axios";

let baseURL = import.meta.env.VITE_BFF_URL || "http://localhost:5173/api";
if (!baseURL.endsWith("/api")) {
  baseURL += "/api";
}

const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
});


axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      const path = window.location.pathname;
      const publicRoutes = ["/", "/join", "/pool"];
      const isPublic = publicRoutes.some((r) => path === r || path.startsWith(r + "/"));

      const url = String(error?.config?.url || "");
      const isAuthProbe = url.includes("/api/me") || url.includes("/oauth2/authorization");

      if (!isPublic && !isAuthProbe) {
        window.location.href = "/oauth2/authorization/spa";
        return;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
