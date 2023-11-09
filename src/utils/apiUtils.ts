import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Define the base URL for your API
const baseURL = 'http://localhost:8080'; // Replace with your API's base URL

// Create an instance of Axios with a custom configuration
const api = axios.create({
  baseURL,
  timeout: 10000, // Adjust the timeout as needed
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Add CORS headers directly here
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  },
});

// Interceptor to handle request configuration
// api.interceptors.request.use(
//   (config: AxiosRequestConfig) => {
//     // You can add global request logic here if needed
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// Interceptor to handle response
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can add global response logic here if needed
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Define a function to make HTTP GET requests
export const get = async <T>(url: string, params?: AxiosRequestConfig): Promise<T> => {
  const response = await api.get(url, params);
  return response.data as T;
};

// Define a function to make HTTP POST requests
export const post = async <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.post(url, data, config);
  return response.data as T;
};

// Define a function to make HTTP PUT requests
export const put = async <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.put(url, data, config);
  return response.data as T;
};

// Define a function to make HTTP DELETE requests
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.delete(url, config);
  return response.data as T;
};

export default api;
