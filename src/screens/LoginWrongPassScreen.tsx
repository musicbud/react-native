import React, { useState } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const LoginWrongPassScreen = () => {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState('hebakhaledqassem@gmail.com'); // Pre-fill from image
  const [password, setPassword] = useState('.....................'); // Pre-fill from image
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(true); // Simulate incorrect password error

  const handleLogin = async () => {
    // TODO: Implement actual login logic with RTK Query
    console.log('Attempting login with:', emailOrUsername, password);
    // For now, simulate error
    setLoginError(true);
    alert('Login failed: Incorrect Password (simulated)');
  };

  return (
    <View style={styles.container}>
      <SafeImage
        source={{/* require('../../assets/ui/extra/LogIn-WrongPass.png') */}}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to your account to continue</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email or Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Email or Username"
            placeholderTextColor="#888"
            value={emailOrUsername}
            onChangeText={setEmailOrUsername}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Text style={{ color: '#888' }}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
          {loginError && (
            <View style={styles.errorMessageContainer}>
              {/* Placeholder for ic:outline-error icon */}
              <Text style={styles.errorMessage}>Incorrect Password</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.linksRow}>
          <TouchableOpacity onPress={() => router.push('/SignUpScreen')}>
            <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/ResendEmailScreen')}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialLoginContainer}>
          <Text style={styles.orText}>OR</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialIconContainer}>
              <Text>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIconContainer}>
              <Text>A</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIconContainer}>
              <Text>F</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  backgroundImage: {
    width: width,
    height: height,
    position: 'absolute',
    opacity: 0.7,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 40,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: 'white',
    fontSize: 16,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 5,
  },
  errorMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  errorMessage: {
    color: 'red',
    fontSize: 12,
    marginLeft: 5,
  },
  loginButton: {
    backgroundColor: '#1E90FF',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  linkText: {
    color: '#1E90FF',
    fontSize: 14,
  },
  orText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  socialLoginContainer: {
    width: '100%',
    alignItems: 'center',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  socialIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginWrongPassScreen;