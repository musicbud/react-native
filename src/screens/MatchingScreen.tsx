import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Animated, PanResponder, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetMatchingBudsQuery, useSwipeUserMutation } from '../store/api';

const { width, height } = Dimensions.get('window');

const MatchingScreen = () => {
  // const router = useRouter(); // Removed unused router
  const { data: matchingBudsData, error: matchingBudsError, isLoading: isMatchingBudsLoading } = useGetMatchingBudsQuery({}); // Pass empty object for default limit
  const [swipeUser, { isLoading: isSwipingUser }] = useSwipeUserMutation();
  const buds = matchingBudsData || []; // API returns an array directly now
  const swipe = useRef(new Animated.ValueXY()).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextBud = async (action: 'like' | 'pass' | 'super_like') => {
    if (currentIndex >= buds.length) return; // No more buds to swipe

    const currentBud = buds[currentIndex];
    console.log(`Bud ${currentBud.display_name} ${action}ed`);

    try {
      const result = await swipeUser({ userId: currentBud.id, action }).unwrap();
      console.log('Swipe successful:', result);
      if (result.is_match) {
        Alert.alert('It\'s a Match!', `You matched with ${currentBud.display_name}!`);
      }
      setCurrentIndex((prevIndex) => prevIndex + 1);
      swipe.setValue({ x: 0, y: 0 }); // Reset card position
    } catch (error: any) {
      console.error('Swipe failed:', error);
      Alert.alert('Swipe Failed', error?.data?.message || 'Could not process swipe. Please try again.');
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        swipe.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) { // Swiped right (like)
          Animated.spring(swipe, {
            toValue: { x: width + 100, y: gesture.dy },
            useNativeDriver: true,
          }).start(() => handleNextBud('like'));
        } else if (gesture.dx < -120) { // Swiped left (pass)
          Animated.spring(swipe, {
            toValue: { x: -width - 100, y: gesture.dy },
            useNativeDriver: true,
          }).start(() => handleNextBud('pass'));
        } else { // Not a significant swipe, return to center
          Animated.spring(swipe, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const rotate = swipe.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const animatedCardStyle = {
    transform: [...swipe.getTranslateTransform(), { rotate }],
  };

  if (isMatchingBudsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Finding Buds...</Text>
      </View>
    );
  }

  if (matchingBudsError) {
    console.error("Matching Buds Error:", matchingBudsError);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load matching Buds.</Text>
        <Text style={styles.errorText}>Please check your backend server and ensure you are logged in.</Text>
      </View>
    );
  }

  const renderBudCard = () => {
    if (currentIndex >= buds.length) {
      return (
        <View style={styles.noMoreBudsContainer}>
          <Text style={styles.noMoreBudsText}>No more Buds to match!</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={() => setCurrentIndex(0)}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const bud = buds[currentIndex];
    return (
      <Animated.View style={[styles.budCard, animatedCardStyle]} {...panResponder.panHandlers}>
        <Image source={{ uri: bud.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.budImage} />
        <View style={styles.budInfo}>
          <Text style={styles.budName}>{bud.display_name || bud.username}</Text>
          <Text style={styles.budDescription}>{bud.bio || 'No bio available.'}</Text>
          <Text style={styles.budCommonalities}>
            {bud.common_interests?.length > 0 && `${bud.common_interests.length} common interests`}
            {bud.common_interests?.length > 0 && bud.compatibility_score && ', '}
            {bud.compatibility_score && `Compatibility: ${bud.compatibility_score}%`}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={{/* require('../../assets/ui/extra/Matching.png') */ }}
        style={styles.fullBackgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.screenTitle}>Buds</Text>

        <View style={styles.cardContainer}>
          {renderBudCard()}
          {isSwipingUser && <ActivityIndicator size="large" color="#1E90FF" style={styles.swipingIndicator} />}
        </View>

        <View style={styles.matchActions}>
          <TouchableOpacity style={styles.rejectButton} onPress={() => handleNextBud('pass')} disabled={isSwipingUser}>
            <Text style={styles.actionButtonText}>X</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton} onPress={() => handleNextBud('like')} disabled={isSwipingUser}>
            <Text style={styles.actionButtonText}>✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullBackgroundImage: {
    width: width,
    height: height,
    position: 'absolute',
    opacity: 0.3,
  },
  overlay: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  screenTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  budCard: {
    width: width * 0.8,
    height: height * 0.6,
    backgroundColor: 'rgba(30,30,30,0.8)',
    borderRadius: 20,
    position: 'absolute', // Important for stacking and swiping
    justifyContent: 'flex-end',
    padding: 20,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    elevation: 5,
  },
  budImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  budInfo: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 10,
  },
  budName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  budDescription: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  budCommonalities: {
    color: '#CCC',
    fontSize: 14,
    marginTop: 10,
  },
  matchActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
    marginBottom: 20,
  },
  rejectButton: {
    backgroundColor: 'red',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: 'green',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  noMoreBudsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreBudsText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  swipingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 10,
    transform: [{ translateX: -15 }, { translateY: -15 }], // Center the indicator
  },
});

export default MatchingScreen;