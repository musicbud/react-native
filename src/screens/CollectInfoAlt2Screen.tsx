import React, { useState } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const CollectInfoAlt2Screen = () => {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedGender) {
      router.push('/CollectInfoAlt3Screen'); // Assuming CollectInfoAlt3 is the next step
    } else {
      alert('Please select your gender.');
    }
  };

  return (
    <View style={styles.container}>
      <SafeImage
        source={{/* require('../../assets/ui/extra/Collect information-2.png') */}}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          {/* Placeholder for back arrow icon */}
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: '75%' }]} />
        </View>

        <Text style={styles.title}>What’s your Gender</Text>

        <View style={styles.genderOptionsContainer}>
          <TouchableOpacity
            style={[styles.genderButton, selectedGender === 'Male' && styles.genderButtonSelected]}
            onPress={() => setSelectedGender('Male')}
          >
            <Text style={[styles.genderButtonText, selectedGender === 'Male' && styles.genderButtonTextSelected]}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, selectedGender === 'Female' && styles.genderButtonSelected]}
            onPress={() => setSelectedGender('Female')}
          >
            <Text style={[styles.genderButtonText, selectedGender === 'Female' && styles.genderButtonTextSelected]}>Female</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, selectedGender === 'Other' && styles.genderButtonSelected]}
            onPress={() => setSelectedGender('Other')}
          >
            <Text style={[styles.genderButtonText, selectedGender === 'Other' && styles.genderButtonTextSelected]}>Other</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
          <Text style={styles.nextIcon}>→</Text>
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
  progressBarContainer: {
    width: '90%',
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    marginTop: 100,
    marginBottom: 50,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1E90FF',
    borderRadius: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 50,
    textAlign: 'center',
  },
  genderOptionsContainer: {
    width: '90%',
    marginBottom: 30,
  },
  genderButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  genderButtonSelected: {
    backgroundColor: '#1E90FF',
  },
  genderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  genderButtonTextSelected: {
    color: 'white',
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
});

export default CollectInfoAlt2Screen;