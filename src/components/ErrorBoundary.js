import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // You can also send error to reporting service here
    Alert.alert(
      'Something went wrong',
      'An unexpected error occurred. Please try restarting the app.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Optionally, you could reset the app state here
          }
        }
      ]
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Something went wrong:</Text>
          <Text style={styles.errorDetail}>
            {this.state.error?.message || 'Unknown error'}
          </Text>
          <Button title="Restart App" onPress={() => {
            // In a real app, you might want to reset state or redirect to home
            Alert.alert(
              'App Restart',
              'Please restart the application to continue.',
              [{ text: 'OK' }]
            );
          }} />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 20,
    textAlign: 'center',
  },
});