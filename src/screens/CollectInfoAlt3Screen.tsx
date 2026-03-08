import React, { useState } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const interestsList = [
  'Listening Music', 'Parties', 'Massage', 'Books', 'Self Care', 'Hot Yoga',
  'Gymnastics', 'Hockey', 'Football', 'Meditation', 'Spotify', 'Sushi',
  'Painting', 'Basketball', 'Theater', 'Playing Guitar', 'Aquarium',
  'Fitness', 'Travel', 'Coffee', 'Instagram', 'Walking', 'Running'
];

const CollectInfoAlt3Screen = () => {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(item => item !== interest)
        : [...prev, interest]
    );
  };

  const handleLetsStart = () => {
    // TODO: Send collected info (firstName, birthday, gender, interests) to backend
    console.log('User Interests:', selectedInterests);
    router.replace('/HomeScreen'); // Navigate to Home screen after onboarding
  };

  const renderInterestItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.interestTag,
        selectedInterests.includes(item) && styles.interestTagSelected
      ]}
      onPress={() => toggleInterest(item)}
    >
      <Text style={[styles.interestTagText, selectedInterests.includes(item) && styles.interestTagTextSelected]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeImage
        source={{/* require('../../assets/ui/extra/Collect information-3.png') */}}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          {/* Placeholder for back arrow icon */}
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: '100%' }]} />
        </View>

        <Text style={styles.title}>Your Interests</Text>

        <FlatList
          data={interestsList}
          renderItem={renderInterestItem}
          keyExtractor={(item) => item}
          numColumns={3} // Adjust as per visual interpretation of image for grid layout
          contentContainerStyle={styles.interestsGrid}
          columnWrapperStyle={styles.interestsGridColumnWrapper}
        />

        <TouchableOpacity style={styles.letsStartButton} onPress={handleLetsStart}>
          <Text style={styles.letsStartButtonText}>Let’s start</Text>
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
    marginBottom: 30,
    textAlign: 'center',
  },
  interestsGrid: {
    justifyContent: 'center',
  },
  interestsGridColumnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10, // Space between rows
  },
  interestTag: {
    backgroundColor: '#333',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5, // Space between tags
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100, // Adjust based on content
  },
  interestTagSelected: {
    backgroundColor: '#1E90FF', // Selected state color
  },
  interestTagText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'normal',
  },
  interestTagTextSelected: {
    fontWeight: 'bold',
  },
  letsStartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E90FF',
    width: '90%',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 50,
  },
  letsStartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CollectInfoAlt3Screen;