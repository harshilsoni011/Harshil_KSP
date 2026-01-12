import axios from "axios";
import { toast } from "react-toastify";
import { API_MESSAGES } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          localStorage.removeItem("token");
          localStorage.removeItem("userType");
          localStorage.removeItem("user");
          window.location.href = "/login";
          break;
        case 403:
          toast.error(API_MESSAGES.ERROR.FORBIDDEN);
          break;
        case 404:
          toast.error(API_MESSAGES.ERROR.NOT_FOUND);
          break;
        case 500:
          toast.error(API_MESSAGES.ERROR.SERVER_ERROR);
          break;
        default:
          break;
      }
    } else if (error.request) {
      toast.error(API_MESSAGES.ERROR.NETWORK);
    } else {
      toast.error(API_MESSAGES.ERROR.UNEXPECTED);
    }

    return Promise.reject(error);
  },
);

export const kspAPI = {
  // auth apis
  login: (credentials) => api.post("/users/login", credentials),
  register: (data) => api.post("/users/register", data),
  logout: () => api.post("/users/logout"),

  // Get top users
  getTopUsers: () => api.get("/users/top"),
  getMe: () => api.get("/users/me"),

  // question related apis
  getQuestions: (params) => api.get("/question", { params }),
  getQuestionById: (id) => api.get(`/question/${id}`),
  createQuestion: (data) => api.post("/question", data),
  voteQuestion: (id, value) => api.post(`/question/${id}/vote`, { value }),

  // answer related apis
  createAnswer: (questionId, data) => api.post(`/question/${questionId}/answers`, data),
  voteAnswer: (answerId, value) => api.post(`/answers/${answerId}/vote`, { value }),

  // comments apis
  createQuestionComment: (questionId, data) => api.post(`/question/${questionId}/comments`, data),
  createAnswerComment: (answerId, data) => api.post(`/answers/${answerId}/comments`, data),

  // tags relate api
  getTrendingTags: () => api.get("/tags/trending"),
};

// Helper function to set authorization token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Utility functions
export const formatApiError = (error) => {
  if (error.response?.data?.error) return error.response.data.error;
  if (error.message) return error.message;
  return "An unexpected error occurred";
};

export const isNetworkError = (error) => !error.response && error.request;

export default api;