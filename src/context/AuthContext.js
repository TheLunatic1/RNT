import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { makeApiRequest } from '../utils/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setUser({ token });
        }
      } catch (e) {
        console.error('Failed to load token', e);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

   const login = async (email, password) => {
    try {
      const response = await makeApiRequest({
        endpoint: '/api/auth/login',
        method: 'POST',
        data: { email, password },
        isCritical: true // Authentication requests are critical
      });

      // Handle queued request (though we wouldn't queue critical requests)
      if (response && response.queued) {
        Alert.alert('Authentication Failed', 'Unable to authenticate while offline. Please connect to internet and try again.');
        return { success: false, error: 'Unable to authenticate while offline' };
      }

      const { token } = response;
      await SecureStore.setItemAsync('userToken', token);
      setUser({ token });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

   const register = async (name, email, password) => {
    try {
      const response = await makeApiRequest({
        endpoint: '/api/auth/register',
        method: 'POST',
        data: { name, email, password },
        isCritical: true // Authentication requests are critical
      });

      // Handle queued request (though we wouldn't queue critical requests)
      if (response && response.queued) {
        Alert.alert('Registration Failed', 'Unable to register while offline. Please connect to internet and try again.');
        return { success: false, error: 'Unable to register while offline' };
      }

      const { token } = response;
      await SecureStore.setItemAsync('userToken', token);
      setUser({ token });
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        token: user?.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
