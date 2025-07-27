import API from './api';

export const signUp = async (userData) => {
  try {
    const response = await API.post('/users/signup', userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Signup failed');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'Signup failed');
    }
  }
};

export const signIn = async (credentials) => {
  try {
    const response = await API.post('/users/signin', credentials);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'Login failed');
    }
  }
};

export const checkAuth = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const logout = () => {
  localStorage.removeItem('token');
};