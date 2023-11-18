import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { USER_SERVICE_APP } from './constants';

// Default base URL
const defaultBaseURL = USER_SERVICE_APP; // Replace with your default base URL

// Create an instance of Axios with a custom configuration
const api = axios.create({
  baseURL: defaultBaseURL,
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
    console.log(response);
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Define a function to make HTTP GET requests
export const get = async <T>(url: string, params?: AxiosRequestConfig, customBaseURL?: string): Promise<T> => {
  const response = await api.get(url, {
    ...params,
    baseURL: customBaseURL || defaultBaseURL, // Use customBaseURL if provided, or defaultBaseURL
  });
  return response.data as T;
};

// Define a function to make HTTP POST requests
export const post = async <T>(url: string, data: any, config?: AxiosRequestConfig, customBaseURL?: string): Promise<T> => {
  const response = await api.post(url, data, {
    ...config,
    baseURL: customBaseURL || defaultBaseURL, // Use customBaseURL if provided, or defaultBaseURL
  });
  return response.data as T;
};

// Define a function to make HTTP PUT requests
export const put = async <T>(url: string, data: any, config?: AxiosRequestConfig, customBaseURL?: string): Promise<T> => {
  const response = await api.put(url, data, {
    ...config,
    baseURL: customBaseURL || defaultBaseURL, // Use customBaseURL if provided, or defaultBaseURL
  });
  return response.data as T;
};

// Define a function to make HTTP DELETE requests
export const del = async <T>(url: string, config?: AxiosRequestConfig, customBaseURL?: string): Promise<T> => {
  const response = await api.delete(url, {
    ...config,
    baseURL: customBaseURL || defaultBaseURL, // Use customBaseURL if provided, or defaultBaseURL
  });
  return response.data as T;
};

export default api;
