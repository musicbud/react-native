import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { useLoginJsonV1AuthLoginJsonPostMutation } from '../store/api';
import { setCredentials } from '../store/authSlice';
import { DesignSystem } from '../theme/design_system';
import { ModernButton } from '../components/common/ModernButton';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginJsonV1AuthLoginJsonPostMutation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const result = await login({
        userLogin: {
          username: emailOrUsername,
          password
        }
      }).unwrap();

      const data = result?.data || result;
      const accessToken = data?.access_token || data?.token;

      if (accessToken) {
        await AsyncStorage.setItem('userToken', accessToken);
        dispatch(setCredentials({ token: accessToken }));
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
      <StatusBar barStyle="light-content" />
      <View style={styles.backgroundImagePlaceholder} />
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to your account to continue</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email or Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Email or Username"
            placeholderTextColor={DesignSystem.colors.textMuted}
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
              placeholderTextColor={DesignSystem.colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Text style={{ color: DesignSystem.colors.textMuted }}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ModernButton
          text="Login"
          onPressed={handleLogin}
          isLoading={isLoading}
          style={styles.loginButton}
        />

        <View style={styles.linksRow}>
          <TouchableOpacity onPress={() => router.push('/SignUpScreen')}>
            <Text style={styles.linkText}>Don&apos;t have an account? Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/ResendEmailScreen')}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialIconContainer}>
            <Text style={styles.socialText}>G</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIconContainer}>
            <Text style={styles.socialText}>A</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIconContainer}>
            <Text style={styles.socialText}>F</Text>
          </TouchableOpacity>
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
    backgroundColor: DesignSystem.colors.backgroundPrimary,
  },
  backgroundImagePlaceholder: {
    width: width,
    height: height,
    position: 'absolute',
    backgroundColor: DesignSystem.colors.backgroundPrimary,
  },
  overlay: {
    backgroundColor: DesignSystem.colors.overlay,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DesignSystem.spacing.xl,
  },
  title: {
    ...DesignSystem.typography.titleLarge,
    color: DesignSystem.colors.onSurface,
    marginBottom: DesignSystem.spacing.xxs,
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    ...DesignSystem.typography.bodyMedium,
    color: '#B5B5B5',
    marginBottom: DesignSystem.spacing.xl,
  },
  inputGroup: {
    width: '100%',
    marginBottom: DesignSystem.spacing.md,
  },
  inputLabel: {
    ...DesignSystem.typography.labelLarge,
    color: DesignSystem.colors.onSurface,
    marginBottom: DesignSystem.spacing.xs,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: DesignSystem.colors.background,
    borderRadius: DesignSystem.radius.sm,
    paddingHorizontal: DesignSystem.spacing.md,
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.bodyLarge,
    borderWidth: 1,
    borderColor: '#C1C1C1',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 56,
    backgroundColor: DesignSystem.colors.background,
    borderRadius: DesignSystem.radius.sm,
    paddingHorizontal: DesignSystem.spacing.md,
    borderWidth: 1,
    borderColor: '#C1C1C1',
  },
  passwordInput: {
    flex: 1,
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.bodyLarge,
  },
  eyeIcon: {
    padding: DesignSystem.spacing.xs,
  },
  loginButton: {
    width: '100%',
    marginTop: DesignSystem.spacing.md,
    marginBottom: DesignSystem.spacing.lg,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: DesignSystem.spacing.xl,
    paddingHorizontal: DesignSystem.spacing.xs,
    gap: 4,
  },
  linkText: {
    color: '#999999',
    ...DesignSystem.typography.labelLarge,
    fontSize: 12,
  },
  linkTextAction: {
    color: DesignSystem.colors.primary,
    fontWeight: '600',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: DesignSystem.spacing.lg,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#121212',
  },
  orText: {
    color: '#ACACAC',
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: 'Josefin Sans',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: DesignSystem.spacing.xl,
  },
  socialIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialText: {
    color: 'black',
    ...DesignSystem.typography.titleMedium,
  }
});

export default LoginScreen;