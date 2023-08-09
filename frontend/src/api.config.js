import axios from "axios";

export const instance = axios.create({
  withCredentials: true,
  baseURL: "https://jsonplaceholder.typicode.com/",
});

// Add access token to request
instance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
    return config
  }
)


instance.interceptors.response.use(
  // Access token is valid
  (config) => {
    return config;
  },
  
  // Access token is invalid, should refresh
  async (error) => {
   const originalRequest = {...error.config};
   originalRequest._isRetry = true; 
    if (
      error.response.status === 401 && 
      error.config &&
      !error.config._isRetry
    ) {
      try {
        const resp = await instance.get("/api/refresh");
        localStorage.setItem("token", resp.data.accessToken);
        return instance.request(originalRequest);
      } catch (error) {
        console.log("AUTH ERROR");
      }
    }

    throw error;
  }
);