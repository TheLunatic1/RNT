import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <CustomInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <CustomInput
        placeholder="Password"
        secureTextEntry
      />

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <CustomButton title="Login" />

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 40,
    textAlign: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#1E90FF',
    fontSize: 15,
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  signupText: {
    color: '#6B7280',
    fontSize: 16,
  },
  signupLink: {
    color: '#1E90FF',
    fontWeight: '600',
    fontSize: 16,
  },
});