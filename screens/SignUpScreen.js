import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

export default function SignUpScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join ChatSocial today</Text>

      <CustomInput placeholder="Full Name" />

      <CustomInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <CustomInput
        placeholder="Password"
        secureTextEntry
      />

      <CustomInput
        placeholder="Confirm Password"
        secureTextEntry
      />

      <CustomButton title="Sign Up" />

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>
          Already have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  loginText: {
    color: '#6B7280',
    fontSize: 16,
  },
  loginLink: {
    color: '#1E90FF',
    fontWeight: '600',
    fontSize: 16,
  },
});