import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useRegisterMutation } from '../store/api';

const { width, height } = Dimensions.get('window');

const SignUpScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSignUp = async () => {
    if (!agreePrivacy) {
      Alert.alert('Registration Failed', 'You must agree to the privacy policy to sign up.');
      return;
    }
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Registration Failed', 'Please fill in all fields.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Registration Failed', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) { // Basic password length check
      Alert.alert('Registration Failed', 'Password must be at least 6 characters long.');
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert('Registration Failed', 'Passwords do not match.');
      return;
    }

    try {
      // Assuming the API expects 'username', 'email', 'password', and 'password_confirm'
      const result = await register({ username, email, password, password_confirm: passwordConfirm }).unwrap();
      console.log('Signup successful:', result);
      Alert.alert('Registration Successful', 'Your account has been created! Please log in.');
      router.replace('/LoginScreen'); // Navigate to login on success
    } catch (error: any) {
      console.error('Signup failed:', error);
      const errorMessage = error?.data?.message || 'Something went wrong. Please try again.';
      Alert.alert('Registration Failed', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{/* require('../../assets/ui/extra/Sign up.png') */ }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started!</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Choose a Username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Create a password"
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
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm your password"
              placeholderTextColor="#888"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              secureTextEntry={!showPasswordConfirm}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPasswordConfirm(!showPasswordConfirm)} style={styles.eyeIcon}>
              <Text style={{ color: '#888' }}>{showPasswordConfirm ? 'Show' : 'Hide'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.privacyPolicyRow} onPress={() => setAgreePrivacy(!agreePrivacy)}>
          <View style={[styles.checkbox, agreePrivacy && styles.checkboxChecked]}>
            {agreePrivacy && <Text style={styles.checkboxCheck}>✓</Text>}
          </View>
          <Text style={styles.privacyPolicyText}>I agree with privacy policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signupButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

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

        <TouchableOpacity onPress={() => router.push('/LoginScreen')}>
          <Text style={styles.loginLinkText}>Already have an account? Log in</Text>
        </TouchableOpacity>
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
  privacyPolicyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#1E90FF', // Example check color
    borderColor: '#1E90FF',
  },
  checkboxCheck: {
    color: 'white',
    fontSize: 14,
  },
  privacyPolicyText: {
    color: 'white',
    fontSize: 14,
  },
  signupButton: {
    backgroundColor: '#1E90FF',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
  loginLinkText: {
    color: '#1E90FF',
    fontSize: 14,
    marginTop: 20,
  },
});

export default SignUpScreen;