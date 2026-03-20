import React, { useState } from 'react';
import { useRegisterV1AuthRegisterPostMutation } from '../store/api';
import { DesignSystem } from '../theme/design_system';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const SignUpAltScreen = () => {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState('Heba0sman'); // Pre-fill from image
  const [password, setPassword] = useState('.....................'); // Pre-fill from image
  const [showPassword, setShowPassword] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // Placeholder for password strength logic
  const getPasswordStrength = (pwd: string) => {
    if (pwd.length > 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[!@#$%^&*()]/.test(pwd)) {
      return 'Strong';
    } else if (pwd.length >= 6) {
      return 'Medium';
    }
    return 'Low';
  };

  const handleSignUp = async () => {
    if (!agreePrivacy) {
      alert('You must agree to the privacy policy to sign up.');
      return;
    }
    // TODO: Implement actual signup logic with RTK Query
    console.log('Attempting signup with:', emailOrUsername, password, 'Privacy agreed:', agreePrivacy);
    alert('Sign Up successful! (simulated)');
    router.replace('/HomeScreen'); // Navigate to home on success
  };

  return (
    <View style={styles.container}>
      <SafeImage
        source={{/* require('../../assets/ui/extra/Sign up-1.png') */ }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started!</Text>

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
              <Text style={{ color: DesignSystem.colors.textSecondary }}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.passwordHintRow}>
            <Text style={styles.passwordHintText}>Password Strength: </Text>
            <Text style={[styles.passwordStrengthText, { color: getPasswordStrength(password) === 'Strong' ? 'green' : getPasswordStrength(password) === 'Medium' ? 'orange' : 'red' }]}>
              {getPasswordStrength(password)}
            </Text>
          </View>
          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementText}>• At least 8 characters</Text>
            <Text style={styles.requirementText}>• Contains uppercase and lowercase letters</Text>
            <Text style={styles.requirementText}>• Contains numbers and symbols</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.privacyPolicyRow} onPress={() => setAgreePrivacy(!agreePrivacy)}>
          <View style={[styles.checkbox, agreePrivacy && styles.checkboxChecked]}>
            {agreePrivacy && <Text style={styles.checkboxCheck}>✓</Text>}
          </View>
          <Text style={styles.privacyPolicyText}>I agree with privacy policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
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
    backgroundColor: DesignSystem.colors.background,
  },
  backgroundImage: {
    width: width,
    height: height,
    position: 'absolute',
    opacity: 0.7,
  },
  overlay: {
    backgroundColor: DesignSystem.colors.overlay,
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
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
    backgroundColor: DesignSystem.colors.surfaceContainerHighest,
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
    backgroundColor: DesignSystem.colors.surfaceContainerHighest,
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
  passwordHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  passwordHintText: {
    color: DesignSystem.colors.textSecondary,
    fontSize: 12,
  },
  passwordStrengthText: {
    fontWeight: 'bold',
  },
  passwordRequirements: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  requirementText: {
    color: DesignSystem.colors.textSecondary,
    fontSize: 12,
    marginBottom: 2,
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
    backgroundColor: DesignSystem.colors.primary,
    borderColor: DesignSystem.colors.primary,
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
    backgroundColor: DesignSystem.colors.primaryDark,
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
    color: DesignSystem.colors.primary,
    fontSize: 14,
    marginTop: 20,
  },
});

export default SignUpAltScreen;