import React, { useState, useRef } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Animated, PanResponder, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DesignSystem } from '../theme/design_system';
import { ModernButton } from '../components/common/ModernButton';
import { useMatching } from '../hooks/useMatching';

const { width, height } = Dimensions.get('window');

const MatchingScreen = () => {
  const { potentialMatches: buds, isPotentialMatchesLoading: isMatchingBudsLoading, potentialMatchesError: matchingBudsError, swipeAction, isSwipingUser } = useMatching();

  const swipe = useRef(new Animated.ValueXY()).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextBud = async (action: 'like' | 'pass' | 'super_like') => {
    if (currentIndex >= buds.length) return; // No more buds to swipe

    const currentBud = buds[currentIndex];
    console.log(`Bud ${currentBud.display_name} ${action}ed`);

    try {
      const result = await swipeAction(currentBud.id, action);
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
        <ActivityIndicator size="large" color={DesignSystem.colors.primaryRed} />
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

  const renderSwipeHint = () => {
    const likeOpacity = swipe.x.interpolate({ inputRange: [0, 80], outputRange: [0, 1], extrapolate: 'clamp' });
    const nopeOpacity = swipe.x.interpolate({ inputRange: [-80, 0], outputRange: [1, 0], extrapolate: 'clamp' });
    return (
      <>
        <Animated.View style={[styles.swipeLabel, styles.likeLabelBg, { opacity: likeOpacity, left: 30 }]}>
          <Text style={[styles.swipeLabelText, { color: DesignSystem.colors.successGreen }]}>LIKE</Text>
        </Animated.View>
        <Animated.View style={[styles.swipeLabel, styles.nopeLabelBg, { opacity: nopeOpacity, right: 30 }]}>
          <Text style={[styles.swipeLabelText, { color: DesignSystem.colors.errorRed }]}>NOPE</Text>
        </Animated.View>
      </>
    );
  };

  const renderBudCard = () => {
    if (currentIndex >= buds.length) {
      return (
        <View style={styles.noMoreBudsContainer}>
          <Ionicons name="heart-dislike" size={60} color={DesignSystem.colors.textMuted} />
          <Text style={styles.noMoreBudsText}>You&apos;ve seen everyone!</Text>
          <ModernButton
            text="Start Over"
            onPressed={() => setCurrentIndex(0)}
            style={{ borderRadius: DesignSystem.radius.full }}
          />
        </View>
      );
    }

    const bud = buds[currentIndex];
    const avatarUrl = bud.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(bud.display_name || bud.username)}&background=1a1a2e&color=fff&size=400`;
    return (
      <Animated.View style={[styles.budCard, animatedCardStyle]} {...panResponder.panHandlers}>
        <SafeImage source={{ uri: avatarUrl }} style={styles.budImage} resizeMode="cover" />
        {renderSwipeHint()}
        <LinearGradient colors={['transparent', DesignSystem.colors.backgroundDark]} style={styles.cardGradient}>
          {bud.compatibility_score != null && (
            <View style={styles.compatBadge}>
              <Text style={styles.compatText}>{bud.compatibility_score}% Match</Text>
            </View>
          )}
          <Text style={styles.budName}>{bud.display_name || bud.username}</Text>
          <Text style={styles.budDescription}>{bud.bio || 'Music lover'}</Text>

          <View style={styles.statsRow}>
            {(bud.music_compatibility ?? 0) > 0 && <Text style={styles.statText}>🎵 {bud.music_compatibility}% Music</Text>}
            {(bud.movie_compatibility ?? 0) > 0 && <Text style={styles.statText}>🎬 {bud.movie_compatibility}% Movies</Text>}
            {(bud.anime_compatibility ?? 0) > 0 && <Text style={styles.statText}>✨ {bud.anime_compatibility}% Anime</Text>}
          </View>

          {((bud.top_artists?.length ?? 0) > 0 || (bud.top_genres?.length ?? 0) > 0 || (bud.common_interests?.length ?? 0) > 0) && (
            <View style={styles.tagsRow}>
              {[
                ...(bud.top_artists || []).map((a: string) => ({ label: a, type: 'artist' })),
                ...(bud.top_genres || []).map((g: string) => ({ label: g, type: 'genre' })),
                ...(bud.common_interests || []).map((i: string) => ({ label: i, type: 'interest' }))
              ].slice(0, 4).map((item: any, i: number) => (
                <View key={i} style={[
                  styles.tag,
                  item.type === 'artist' && styles.tagArtist,
                  item.type === 'genre' && styles.tagGenre
                ]}>
                  <Text style={styles.tagText}>{item.label}</Text>
                </View>
              ))}
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.topBar}>
          <Text style={styles.screenTitle}>Find Buds</Text>
          <TouchableOpacity>
            <Ionicons name="options" size={24} color={DesignSystem.colors.onSurface} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContainer}>
          {renderBudCard()}
        </View>

        {currentIndex < buds.length && (
          <View style={styles.matchActions}>
            <TouchableOpacity style={[styles.actionCircle, styles.rejectCircle]} onPress={() => handleNextBud('pass')} disabled={isSwipingUser}>
              <Ionicons name="close" size={32} color={DesignSystem.colors.errorRed} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCircle, styles.superCircle]} onPress={() => handleNextBud('super_like')} disabled={isSwipingUser}>
              <Ionicons name="star" size={28} color={DesignSystem.colors.accentBlue} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCircle, styles.likeCircle]} onPress={() => handleNextBud('like')} disabled={isSwipingUser}>
              <Ionicons name="heart" size={32} color={DesignSystem.colors.successGreen} />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DesignSystem.colors.backgroundPrimary },
  overlay: { flex: 1, paddingHorizontal: DesignSystem.spacing.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: DesignSystem.colors.backgroundPrimary },
  loadingText: { color: DesignSystem.colors.onSurface, ...DesignSystem.typography.titleMedium, marginTop: DesignSystem.spacing.md },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: DesignSystem.colors.backgroundPrimary, padding: DesignSystem.spacing.lg },
  errorText: { color: DesignSystem.colors.errorRed, ...DesignSystem.typography.bodyLarge, textAlign: 'center', marginBottom: DesignSystem.spacing.sm },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: DesignSystem.spacing.md, paddingTop: DesignSystem.spacing.sm },
  screenTitle: { color: DesignSystem.colors.onSurface, ...DesignSystem.typography.displaySmall },
  cardContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  budCard: {
    width: width - 40,
    height: height * 0.65,
    borderRadius: DesignSystem.radius.xl,
    position: 'absolute',
    overflow: 'hidden',
    boxShadow: '0px 12px 20px rgba(0,0,0,0.4)',
    backgroundColor: DesignSystem.colors.surfaceContainerHighest,
  },
  budImage: { ...StyleSheet.absoluteFillObject },
  cardGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: DesignSystem.spacing.md, paddingBottom: DesignSystem.spacing.xl, paddingTop: 80 },
  compatBadge: { alignSelf: 'flex-start', backgroundColor: DesignSystem.colors.successGreen, borderRadius: DesignSystem.radius.sm, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10 },
  compatText: { color: DesignSystem.colors.onPrimary, ...DesignSystem.typography.labelSmall, fontWeight: '700' },
  budName: { color: DesignSystem.colors.onPrimary, ...DesignSystem.typography.displayMedium, marginBottom: 4 },
  budDescription: { color: DesignSystem.colors.textSecondary, ...DesignSystem.typography.bodyLarge, marginBottom: 4 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
  statText: { color: DesignSystem.colors.onPrimary, ...DesignSystem.typography.labelMedium, fontWeight: '600', backgroundColor: DesignSystem.colors.surfaceContainerHighest, paddingHorizontal: 8, paddingVertical: 4, borderRadius: DesignSystem.radius.sm },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  tag: { backgroundColor: DesignSystem.colors.surfaceContainer, borderRadius: DesignSystem.radius.full, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: DesignSystem.colors.borderColor },
  tagArtist: { backgroundColor: DesignSystem.colors.primaryContainer, borderColor: DesignSystem.colors.primary },
  tagGenre: { backgroundColor: DesignSystem.colors.secondaryContainer, borderColor: DesignSystem.colors.secondary },
  tagText: { color: DesignSystem.colors.onPrimary, ...DesignSystem.typography.labelSmall, fontWeight: '600' },
  swipeLabel: { position: 'absolute', top: 50, zIndex: 10, borderWidth: 3, borderRadius: DesignSystem.radius.sm, paddingHorizontal: 12, paddingVertical: 6 },
  likeLabelBg: { borderColor: DesignSystem.colors.successGreen },
  nopeLabelBg: { borderColor: DesignSystem.colors.errorRed },
  swipeLabelText: { fontSize: 22, fontWeight: '900', letterSpacing: 2 },
  matchActions: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, paddingVertical: DesignSystem.spacing.lg },
  actionCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', boxShadow: '0px 4px 4px rgba(0,0,0,0.3)', backgroundColor: DesignSystem.colors.surfaceContainer },
  rejectCircle: { borderWidth: 2, borderColor: DesignSystem.colors.errorRed },
  superCircle: { borderWidth: 2, borderColor: DesignSystem.colors.accentBlue, width: 52, height: 52, borderRadius: 26 },
  likeCircle: { borderWidth: 2, borderColor: DesignSystem.colors.successGreen },
  noMoreBudsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: DesignSystem.spacing.xl },
  noMoreBudsText: { color: DesignSystem.colors.textMuted, ...DesignSystem.typography.titleLarge, marginTop: DesignSystem.spacing.md },
});

export default MatchingScreen;