import React, { useState } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const CollectInfoScreen = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');

  const handleNext = () => {
    // Navigate to the next info collection screen
    router.push('/CollectInfoAlt1Screen'); // Assuming CollectInfoAlt1 is the next step
  };

  return (
    <View style={styles.container}>
      <SafeImage
        source={{/* require('../../assets/ui/extra/Collect information.png') */}}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          {/* Placeholder for back arrow icon */}
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarFill} />
        </View>

        <Text style={styles.title}>What’s your First Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          placeholderTextColor="#888"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
          {/* Placeholder for navigate_next icon */}
          <Text style={styles.nextIcon}>→</Text>
        </TouchableOpacity>

        <Text style={styles.hintText}>This will be shown on your profile</Text>
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
    top: 60, // Adjust as needed for status bar
    left: 20,
    padding: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    width: '90%',
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    marginTop: 100, // Adjust positioning
    marginBottom: 50,
  },
  progressBarFill: {
    width: '25%', // Assuming this is the first step out of four, adjust as needed
    height: '100%',
    backgroundColor: '#1E90FF', // Example progress color
    borderRadius: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 50,
    textAlign: 'center',
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: 'white',
    fontSize: 16,
    marginBottom: 30,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E90FF',
    width: '90%',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 50,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  nextIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hintText: {
    color: '#888',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default CollectInfoScreen;