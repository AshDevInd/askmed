import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'https://api.example.com', // Your base URL here
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiRequest = async (endpoint, data = null) => {
  try {
    const response = await axiosInstance.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error fetching data');
  }
};

export const userLoginRequest = async () => {
    
}

// export const createPost = (newPost) => apiRequest('/posts', newPost);