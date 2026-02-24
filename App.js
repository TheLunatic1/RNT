import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import ExpenseScreen from './src/screens/ExpenseScreen';

function MainApp() {
  const { user, loading, logout } = useContext(AuthContext);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6f42c1" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <ExpenseScreen onLogout={logout} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </SafeAreaProvider>
  );
}