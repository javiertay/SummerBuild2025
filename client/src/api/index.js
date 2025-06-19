import axios from 'axios';

const API = axios.create({baseURL: 'http://localhost:3000/api'});

export const login = (formData) => API.post('/users/login', formData);
export const forgotPassword = (formData) => API.post('/users/forgotPassword', formData)
export const register = (formData) => API.post('/users/register', formData);


// this is for Add Entry
export const getInternship = () => API.get('/internships');
export const createInternship = (formData) =>API.post('/internships', formData,);