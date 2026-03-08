import React, { useState } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForgotPasswordV1AuthForgotPasswordPostMutation } from '../store/api';

const { width, height } = Dimensions.get('window');

const ResendEmailScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const [forgotPassword, { isLoading }] = useForgotPasswordV1AuthForgotPasswordPostMutation();

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSendLink = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    try {
      const result = await forgotPassword({
        passwordReset: { email }
      }).unwrap();
      console.log('Forgot password request successful:', result);
      Alert.alert('Success', 'If an account with that email exists, a password reset link has been sent.');
      router.back();
    } catch (error: any) {
      console.error('Forgot password request failed:', error);
      const errorMessage = error?.data?.message || 'Failed to send reset link. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <SafeImage
        source={{/* require('../../assets/ui/extra/Resend Email.png') */ }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>Enter your email to receive a password reset link.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="hebakhaledqassem@gmail.com"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.sendLinkButton} onPress={handleSendLink} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendLinkButtonText}>Send Link to Email</Text>
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
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: 'white',
    fontSize: 16,
  },
  sendLinkButton: {
    backgroundColor: '#1E90FF',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  sendLinkButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ResendEmailScreen;