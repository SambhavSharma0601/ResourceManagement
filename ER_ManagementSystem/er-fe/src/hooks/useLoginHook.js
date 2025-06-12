// src/hooks/useLoginHook.js
import axios from 'axios';
import { useState } from 'react';

export const useLoginHook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://resourcemanagement-4gp2.onrender.com/api/login', formData);
      // console.log(response.data);
      localStorage.setItem('currentUser',JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed');
      return null;
    }
  };

  return { login, loading, error };
};
