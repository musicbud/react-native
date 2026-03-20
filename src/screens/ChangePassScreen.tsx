import React, { useState } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useResetPasswordV1AuthResetPasswordPostMutation } from '../store/api';

const { width, height } = Dimensions.get('window');

const ChangePassScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { token: resetTokenParam } = params; // Get reset token from route parameters

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordV1AuthResetPasswordPostMutation();

  // Placeholder for password strength logic
  const getPasswordStrength = (password: string) => {
    if (password.length > 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return 'Strong';
    } else if (password.length > 5) {
      return 'Medium';
    }
    return 'Weak';
  };

  const handlePasswordChange = async () => {
    // In a real app, the resetToken should come from URL parameters
    const tokenString = (Array.isArray(resetTokenParam) ? resetTokenParam[0] : resetTokenParam) || 'dummy-reset-token';
    const token = tokenString as string;

    if (!token) {
      Alert.alert('Error', 'Password reset token is missing.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
    if (newPassword.length < 6) { // Basic password length check
      Alert.alert('Error', 'New password must be at least 6 characters long.');
      return;
    }

    try {
      const result = await resetPassword({
        passwordResetConfirm: {
          token,
          new_password: newPassword,
          new_password_confirm: confirmPassword
        }
      }).unwrap();
      console.log('Password reset successful:', result);
      Alert.alert('Success', 'Your password has been changed successfully. Please log in with your new password.');
      router.replace('/LoginScreen'); // Navigate to login after successful password change
    } catch (error: any) {
      console.error('Password reset failed:', error);
      const errorMessage = error?.data?.message || 'Failed to change password. Please ensure the token is valid.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <SafeImage
        source={{/* require('../../assets/ui/extra/Change Pass.png') */ }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>Your new password must be different from previous used passwords.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Enter new password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="New password"
              placeholderTextColor="#888"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
              <Text style={{ color: '#888' }}>{showNewPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.passwordStrength}>Strength: {getPasswordStrength(newPassword)}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Repeat password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm new password"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Text style={{ color: '#888' }}>{showConfirmPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.changePasswordButton} onPress={handlePasswordChange} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.changePasswordButtonText}>Change password</Text>
          )}
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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
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
  passwordStrength: {
    color: '#1E90FF', // Example strength color
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  changePasswordButton: {
    backgroundColor: '#1E90FF',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  changePasswordButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChangePassScreen;