import React from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SafeImage
        source={{/* require('../../assets/ui/extra/on boarding.png') */}} // The main image for onboarding
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.contentOverlay}>
        <Text style={styles.welcomeText}>Let’s meet new people with the same taste in MusicBud</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/LoginScreen')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/SignUpScreen')}>
            <Text style={styles.signupButtonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Align content to the bottom
    alignItems: 'center',
    backgroundColor: '#000', // Assuming a dark background for the static image
  },
  backgroundImage: {
    width: width,
    height: height,
    position: 'absolute',
    opacity: 0.7, // Adjust opacity to allow text overlay to be readable
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 50, // Adjust as needed
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 50, // Space between text and buttons
    fontFamily: 'JosefinSans-Bold', // Placeholder font, assume it will be linked
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'white', // Assuming white button from image
    width: '90%',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: 'transparent', // Assuming transparent button from image
    width: '90%',
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;