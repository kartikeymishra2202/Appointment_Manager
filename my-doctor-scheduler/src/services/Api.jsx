export const API_BASE_URL = "http://localhost:3000/api/v1";

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("authToken"); // Retrieve token from storage

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // Add token if available
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

// Similar methods for login and booking appointment
