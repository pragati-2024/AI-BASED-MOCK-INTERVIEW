import API from './api';

export const signUp = async (userData) => {
  try {
    const response = await API.post('/users/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const signIn = async (credentials) => {
  try {
    const response = await API.post('/users/signin', credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
  try {
    const response = await API.post('/users/logout');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};