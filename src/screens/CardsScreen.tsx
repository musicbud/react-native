import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Animated, PanResponder, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetDiscoveryCardsQuery, useSwipeUserMutation } from '../store/api';

const { width, height } = Dimensions.get('window');

const CardsScreen = () => {
  const router = useRouter();
  const { data: discoveryCardsData, error: discoveryCardsError, isLoading: isDiscoveryCardsLoading } = useGetDiscoveryCardsQuery();
  const [swipeUser, { isLoading: isSwipingUser }] = useSwipeUserMutation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipe = useRef(new Animated.ValueXY()).current;

  if (isDiscoveryCardsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Loading Cards...</Text>
      </View>
    );
  }

  if (discoveryCardsError) {
    console.error("Discovery Cards Error:", discoveryCardsError);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load discovery cards.</Text>
        <Text style={styles.errorText}>Please check your backend server and ensure you are logged in.</Text>
      </View>
    );
  }

  const cards = discoveryCardsData?.data || []; // Assuming API returns an array of user profiles directly

  const handleSwipe = async (action: 'like' | 'pass') => {
    if (currentIndex >= cards.length) return; // No more cards to swipe

    const currentCard = cards[currentIndex];
    console.log(`Card (User) ${currentCard.display_name} ${action}d`);

    try {
      // The swipeUser mutation expects 'userId' and 'action'
      const result = await swipeUser({ userId: currentCard.id, action }).unwrap();
      console.log('Swipe successful:', result);
      if (result.is_match) {
        Alert.alert('It\'s a Match!', `You matched with ${currentCard.display_name}!`);
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
          }).start(() => handleSwipe('like'));
        } else if (gesture.dx < -120) { // Swiped left (pass)
          Animated.spring(swipe, {
            toValue: { x: -width - 100, y: gesture.dy },
            useNativeDriver: true,
          }).start(() => handleSwipe('pass'));
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

  const renderCard = () => {
    if (currentIndex >= cards.length) {
      return (
        <View style={styles.noMoreCardsContainer}>
          <Text style={styles.noMoreCardsText}>No more users to discover!</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={() => setCurrentIndex(0)}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const card = cards[currentIndex];
    return (
      <Animated.View style={[styles.card, animatedCardStyle]} {...panResponder.panHandlers}>
        <Image source={{ uri: card.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.cardImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{card.display_name || card.username}</Text>
          <Text style={styles.cardDescription}>{card.bio || 'No bio available.'}</Text>
          <View style={styles.tagsContainer}>
            {card.common_interests?.map((interest: string, index: number) => (
              <Text key={index} style={styles.tagText}>{interest}</Text>
            ))}
            {card.top_genres?.map((genre: string, index: number) => (
              <Text key={`genre-${index}`} style={styles.tagText}>{genre}</Text>
            ))}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Image
        source={{/* require('../../assets/ui/Cards.png') */}}
      style={styles.fullBackgroundImage}
      resizeMode="cover"
      /> */}
      {/* TODO: Fix missing asset Cards.png */}
      <View style={styles.overlay}>
        <Text style={styles.screenTitle}>Discover Users</Text>

        <View style={styles.cardStackContainer}>
          {renderCard()}
          {isSwipingUser && <ActivityIndicator size="large" color="#1E90FF" style={styles.swipingIndicator} />}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.dislikeButton} onPress={() => handleSwipe('pass')} disabled={isSwipingUser}>
            <Text style={styles.actionButtonText}>👎</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.likeButton} onPress={() => handleSwipe('like')} disabled={isSwipingUser}>
            <Text style={styles.actionButtonText}>👍</Text>
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
  cardStackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    width: width * 0.8,
    height: height * 0.6,
    backgroundColor: 'rgba(30,30,30,0.8)',
    borderRadius: 20,
    position: 'absolute',
    justifyContent: 'flex-end',
    padding: 20,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    elevation: 5,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  cardInfo: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 10,
  },
  cardTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  tagText: {
    color: '#1E90FF',
    backgroundColor: 'rgba(30,144,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 12,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
    marginBottom: 20,
  },
  dislikeButton: {
    backgroundColor: '#FF6347', // Tomato red
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    backgroundColor: '#3CB371', // MediumSeaGreen
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
  noMoreCardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreCardsText: {
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
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
});

export default CardsScreen;