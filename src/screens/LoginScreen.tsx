import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLoginMutation } from '../store/api';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  /* 
   * Login typically uses OAuth2 format where 'username' field can be username or email.
   * The backend expects 'username' and 'password' as form data.
   */
  const handleLogin = async () => {
    try {
      // Pass 'username' as the key, even if it contains an email, because OAuth2 semantics use 'username' field
      const result = await login({ username: emailOrUsername, password }).unwrap();
      // The backend returns { data: { access_token: ... } }
      // RTK Query unwraps the successful payload
      const data = result?.data || result;
      const accessToken = data?.access_token || data?.token;

      if (accessToken) {
        await AsyncStorage.setItem('userToken', accessToken);
        console.log('Login successful, token saved manually:', accessToken);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', 'Authentication successful but no token received.');
        console.log('Login result structure:', JSON.stringify(result, null, 2));
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error?.data?.message || 'Something went wrong. Please try again.';
      Alert.alert('Login Failed', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{/* require('../../assets/ui/extra/LogIn.png') */ }}
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
              {/* Placeholder for eye icon */}
              <Text style={{ color: '#888' }}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.linksRow}>
          <TouchableOpacity onPress={() => router.push('/SignUpScreen')}>
            <Text style={styles.linkText}>Don&apos;t have an account? Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/ResendEmailScreen')}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialLoginContainer}>
          <Text style={styles.orText}>OR</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialIconContainer}>
              {/* Placeholder for Google Icon */}
              <Text>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIconContainer}>
              {/* Placeholder for Apple Icon */}
              <Text>A</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIconContainer}>
              {/* Placeholder for Facebook Icon */}
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
    backgroundColor: '#000', // Assuming a dark background
  },
  backgroundImage: {
    width: width,
    height: height,
    position: 'absolute',
    opacity: 0.7,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)', // Darker overlay for content
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
  loginButton: {
    backgroundColor: '#1E90FF', // Example color
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
    color: '#1E90FF', // Example link color
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
    backgroundColor: 'white', // Placeholder background
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;