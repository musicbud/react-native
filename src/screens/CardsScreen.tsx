import React, { useState, useRef } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import {
  View, Text, StyleSheet, Image, Dimensions,
  TouchableOpacity, Animated, PanResponder, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useGetPotentialMatchesV1MatchingDiscoverGetQuery,
  useSwipeUserV1MatchingSwipePostMutation
} from '../store/api';
import { DesignSystem } from '../theme/design_system';

const { width, height } = Dimensions.get('window');

const CardsScreen = () => {
  // ─── All hooks must be declared before any early return ───
  const { data: discoveryCardsWrapper, error: discoveryCardsError, isLoading } = useGetPotentialMatchesV1MatchingDiscoverGetQuery({});
  const [swipeUser, { isLoading: isSwipingUser }] = useSwipeUserV1MatchingSwipePostMutation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipe = useRef(new Animated.ValueXY()).current;

  const cards = (discoveryCardsWrapper as any)?.data || discoveryCardsWrapper || [];

  const handleSwipe = async (action: 'like' | 'pass') => {
    if (currentIndex >= cards.length) return;
    const currentCard = cards[currentIndex];

    try {
      const resultWrapper = await swipeUser({
        swipeRequest: {
          user_id: currentCard.id,
          action
        }
      }).unwrap();
      const result = resultWrapper?.data || resultWrapper;
      if (result.is_match) {
        Alert.alert("It's a Match! 🎉", `You matched with ${currentCard.display_name || currentCard.username}!`);
      }
      setCurrentIndex((prev) => prev + 1);
      swipe.setValue({ x: 0, y: 0 });
    } catch (error: any) {
      Alert.alert('Oops', error?.data?.message || 'Could not process swipe.');
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => swipe.setValue({ x: g.dx, y: g.dy }),
      onPanResponderRelease: (_, g) => {
        if (g.dx > 120) {
          Animated.spring(swipe, { toValue: { x: width + 100, y: g.dy }, useNativeDriver: true })
            .start(() => handleSwipe('like'));
        } else if (g.dx < -120) {
          Animated.spring(swipe, { toValue: { x: -width - 100, y: g.dy }, useNativeDriver: true })
            .start(() => handleSwipe('pass'));
        } else {
          Animated.spring(swipe, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const rotate = swipe.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  // ─── Early returns AFTER all hooks ───
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Loading cards…</Text>
      </View>
    );
  }

  if (discoveryCardsError) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>Failed to load discovery cards.</Text>
      </View>
    );
  }

  const renderCard = () => {
    if (currentIndex >= cards.length) {
      return (
        <View style={styles.noMoreCards}>
          <Ionicons name="people" size={64} color="#333" />
          <Text style={styles.noMoreText}>No more users to discover!</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={() => setCurrentIndex(0)}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const card = cards[currentIndex];
    const avatarUrl = card.avatar_url
      || `https://ui-avatars.com/api/?name=${encodeURIComponent(card.display_name || card.username || 'U')}&background=1E90FF&color=fff`;

    return (
      <Animated.View
        style={[styles.card, { transform: [...swipe.getTranslateTransform(), { rotate }] }]}
        {...panResponder.panHandlers}
      >
        <SafeImage source={{ uri: avatarUrl }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardOverlay} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{card.display_name || card.username}</Text>
          {card.bio ? <Text style={styles.cardBio} numberOfLines={2}>{card.bio}</Text> : null}
          <View style={styles.tags}>
            {card.common_interests?.slice(0, 3).map((interest: string, i: number) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{interest}</Text>
              </View>
            ))}
            {card.top_genres?.slice(0, 2).map((genre: string, i: number) => (
              <View key={`g${i}`} style={[styles.tag, styles.genreTag]}>
                <Text style={styles.tagText}>{genre}</Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
      </View>

      <View style={styles.cardStack}>
        {renderCard()}
        {isSwipingUser && (
          <ActivityIndicator size="large" color="#1E90FF" style={styles.swipingOverlay} />
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.passBtn]}
          onPress={() => handleSwipe('pass')}
          disabled={isSwipingUser || currentIndex >= cards.length}
        >
          <Ionicons name="close" size={32} color="#FF3B30" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.superBtn]}
          onPress={() => handleSwipe('like')}
          disabled={isSwipingUser || currentIndex >= cards.length}
        >
          <Ionicons name="star" size={24} color="#FFD700" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.likeBtn]}
          onPress={() => handleSwipe('like')}
          disabled={isSwipingUser || currentIndex >= cards.length}
        >
          <Ionicons name="heart" size={28} color="#1E90FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DesignSystem.colors.backgroundPrimary },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: DesignSystem.colors.backgroundPrimary, gap: 14 },
  loadingText: { color: DesignSystem.colors.textMuted, fontSize: 16 },
  errorText: { color: DesignSystem.colors.errorRed, fontSize: 16, fontWeight: '600' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 12 },
  title: { color: DesignSystem.colors.textPrimary, fontSize: 28, fontWeight: '800' },
  cardStack: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    width: width * 0.88,
    height: height * 0.62,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'absolute',
    backgroundColor: DesignSystem.colors.surfaceContainer,
    elevation: 6,
  },
  cardImage: { ...StyleSheet.absoluteFillObject },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  cardInfo: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 24, backgroundColor: 'rgba(0,0,0,0.55)',
  },
  cardName: { color: DesignSystem.colors.onPrimary, fontSize: 26, fontWeight: '800', marginBottom: 4 },
  cardBio: { color: DesignSystem.colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 12 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: DesignSystem.colors.surfaceContainerHighest, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  genreTag: { backgroundColor: DesignSystem.colors.primaryContainer },
  tagText: { color: DesignSystem.colors.onPrimary, fontSize: 12, fontWeight: '600' },
  noMoreCards: { alignItems: 'center', gap: 16 },
  noMoreText: { color: DesignSystem.colors.textMuted, fontSize: 18, fontWeight: '600' },
  refreshBtn: { backgroundColor: DesignSystem.colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  refreshText: { color: DesignSystem.colors.onPrimary, fontSize: 16, fontWeight: '700' },
  swipingOverlay: { position: 'absolute' },
  actions: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 20, paddingBottom: 40, paddingTop: 16,
  },
  actionBtn: {
    width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: DesignSystem.colors.surfaceContainer, elevation: 4,
  },
  passBtn: { borderWidth: 2, borderColor: DesignSystem.colors.errorRed },
  superBtn: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: DesignSystem.colors.accentBlue },
  likeBtn: { borderWidth: 2, borderColor: DesignSystem.colors.successGreen },
});

export default CardsScreen;