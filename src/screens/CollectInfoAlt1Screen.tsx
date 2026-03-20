import React, { useState } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { DesignSystem } from '../theme/design_system';

const { width, height } = Dimensions.get('window');

const CollectInfoAlt1Screen = () => {
  const router = useRouter();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const handleNext = () => {
    // Basic validation
    if (day && month && year) {
      router.push('/CollectInfoAlt2Screen'); // Assuming CollectInfoAlt2 is the next step
    } else {
      alert('Please enter your full birthday.');
    }
  };

  return (
    <View style={styles.container}>
      <SafeImage
        source={{/* require('../../assets/ui/extra/Collect information-1.png') */ }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          {/* Placeholder for back arrow icon */}
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: '50%' }]} />
        </View>

        <Text style={styles.title}>What’s your Birthday</Text>

        <View style={styles.dateInputContainer}>
          <TextInput
            style={styles.dateInput}
            placeholder="DD"
            placeholderTextColor={DesignSystem.colors.textMuted}
            value={day}
            onChangeText={setDay}
            keyboardType="numeric"
            maxLength={2}
          />
          <TextInput
            style={styles.dateInput}
            placeholder="MM"
            placeholderTextColor={DesignSystem.colors.textMuted}
            value={month}
            onChangeText={setMonth}
            keyboardType="numeric"
            maxLength={2}
          />
          <TextInput
            style={styles.dateInput}
            placeholder="YYYY"
            placeholderTextColor={DesignSystem.colors.textMuted}
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
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
    backgroundColor: DesignSystem.colors.backgroundPrimary,
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
    backgroundColor: DesignSystem.colors.surfaceContainerHighest,
    borderRadius: 3,
    marginTop: 100,
    marginBottom: 50,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: DesignSystem.colors.primary,
    borderRadius: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 50,
    textAlign: 'center',
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 30,
  },
  dateInput: {
    width: '30%',
    height: 50,
    backgroundColor: DesignSystem.colors.surfaceContainerHighest,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DesignSystem.colors.primary,
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
    color: DesignSystem.colors.textMuted,
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default CollectInfoAlt1Screen;