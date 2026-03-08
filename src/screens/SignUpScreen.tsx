import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput, Alert, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useRegisterV1AuthRegisterPostMutation } from '../store/api';
import { DesignSystem } from '../theme/design_system';
import { ModernButton } from '../components/common/ModernButton';

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

  const [register, { isLoading }] = useRegisterV1AuthRegisterPostMutation();

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
      const result = await register({
        userRegister: {
          username,
          email,
          password,
          password_confirm: passwordConfirm
        }
      }).unwrap();
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.backgroundImagePlaceholder} />
      <ScrollView contentContainerStyle={styles.scrollOverlay}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started!</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Choose a Username"
            placeholderTextColor={DesignSystem.colors.textMuted}
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
            placeholderTextColor={DesignSystem.colors.textMuted}
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

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm your password"
              placeholderTextColor={DesignSystem.colors.textMuted}
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              secureTextEntry={!showPasswordConfirm}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPasswordConfirm(!showPasswordConfirm)} style={styles.eyeIcon}>
              <Text style={{ color: DesignSystem.colors.textMuted }}>{showPasswordConfirm ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.privacyPolicyRow} onPress={() => setAgreePrivacy(!agreePrivacy)}>
          <View style={[styles.checkbox, agreePrivacy && styles.checkboxChecked]}>
            {agreePrivacy && <Text style={styles.checkboxCheck}>✓</Text>}
          </View>
          <Text style={styles.privacyPolicyText}>I agree with privacy policy</Text>
        </TouchableOpacity>

        <ModernButton
          text="Sign Up"
          onPressed={handleSignUp}
          isLoading={isLoading}
          style={styles.signupButton}
        />

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

        <TouchableOpacity onPress={() => router.push('/LoginScreen')}>
          <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.linkTextAction}>Log in</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignSystem.colors.backgroundPrimary,
  },
  backgroundImagePlaceholder: {
    width: width,
    height: height,
    position: 'absolute',
    backgroundColor: DesignSystem.colors.backgroundPrimary,
  },
  scrollOverlay: {
    flexGrow: 1,
    backgroundColor: DesignSystem.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DesignSystem.spacing.xl,
    paddingVertical: DesignSystem.spacing.xl,
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
  privacyPolicyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: DesignSystem.spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: DesignSystem.radius.xs,
    borderWidth: 2,
    borderColor: DesignSystem.colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: DesignSystem.spacing.sm,
  },
  checkboxChecked: {
    backgroundColor: DesignSystem.colors.primary,
    borderColor: DesignSystem.colors.primary,
  },
  checkboxCheck: {
    color: DesignSystem.colors.onPrimary,
    ...DesignSystem.typography.labelLarge,
  },
  privacyPolicyText: {
    color: DesignSystem.colors.textSecondary,
    ...DesignSystem.typography.bodyMedium,
  },
  signupButton: {
    width: '100%',
    marginBottom: DesignSystem.spacing.lg,
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
  },
  loginLinkText: {
    color: '#999999',
    ...DesignSystem.typography.labelLarge,
    fontSize: 12,
    marginTop: DesignSystem.spacing.xl,
  },
  linkTextAction: {
    color: DesignSystem.colors.primary,
    fontWeight: '600',
  },
});

export default SignUpScreen;