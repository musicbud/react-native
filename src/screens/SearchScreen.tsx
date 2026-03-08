import React, { useState, useCallback } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, TextInput,
  FlatList, ActivityIndicator, SafeAreaView, StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSearchContentV1SearchGetQuery } from '../store/api';
import { usePlayer } from '../context/PlayerContext';
import { DesignSystem } from '../theme/design_system';

const CATEGORIES = ['All', 'Tracks', 'Artists', 'Playlists', 'Albums'];

const GENRE_CHIPS = [
  { label: 'Hip-Hop', color: DesignSystem.colors.primaryRed },
  { label: 'Pop', color: DesignSystem.colors.accentBlue },
  { label: 'Electronic', color: DesignSystem.colors.accentPurple },
  { label: 'R&B', color: DesignSystem.colors.errorRed },
  { label: 'Jazz', color: DesignSystem.colors.successGreen },
  { label: 'Classical', color: DesignSystem.colors.warningOrange },
  { label: 'Rock', color: DesignSystem.colors.accentOrange },
  { label: 'Indie', color: DesignSystem.colors.info },
];

const SearchScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string; category?: string }>();
  const { playTrack } = usePlayer();

  const [searchText, setSearchText] = useState(params.q || '');
  const [activeCategory, setActiveCategory] = useState('All');

  const { data: searchWrapper, error, isLoading } = useSearchContentV1SearchGetQuery({
    q: searchText.trim() || null,
    limit: 50
  }, { skip: searchText.trim().length < 2 });

  const results: any[] = searchWrapper?.data || [];

  const filteredResults = activeCategory === 'All'
    ? results
    : results.filter((item) => item.type?.toLowerCase() === activeCategory.toLowerCase().slice(0, -1));

  const getTypeIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'track': return 'musical-note';
      case 'artist': return 'person';
      case 'playlist': return 'list';
      case 'album': return 'disc';
      default: return 'search';
    }
  };

  const handleResultPress = useCallback((item: any) => {
    if (item.type === 'track') {
      playTrack(item);
      router.push({ pathname: '/DetailsScreen', params: { id: item.id, type: 'track' } });
    } else {
      router.push({ pathname: '/DetailsScreen', params: { id: item.id, type: item.type || 'artist' } });
    }
  }, [router, playTrack]);

  const renderResult = ({ item }: { item: any }) => {
    const coverUrl = item.cover_url || item.image_url
      || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || item.title || 'X')}&background=1a1a1a&color=fff`;

    return (
      <TouchableOpacity
        style={styles.resultRow}
        activeOpacity={0.75}
        onPress={() => handleResultPress(item)}
      >
        <SafeImage source={{ uri: coverUrl }} style={[styles.resultThumb, item.type === 'artist' && styles.circularThumb]} />
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle} numberOfLines={1}>{item.title || item.name}</Text>
          <View style={styles.resultMeta}>
            <Ionicons name={getTypeIcon(item.type)} size={12} color={DesignSystem.colors.textMuted} />
            <Text style={styles.resultSubtitle} numberOfLines={1}>
              {' '}{item.artist || item.type?.charAt(0).toUpperCase() + item.type?.slice(1) || 'Music'}
            </Text>
          </View>
        </View>
        {item.type === 'track' && (
          <TouchableOpacity style={styles.playBtn} onPress={() => playTrack(item)}>
            <Ionicons name="play-circle" size={30} color={DesignSystem.colors.primaryRed} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.inner}>

        {/* Search Header */}
        <View style={styles.searchHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={DesignSystem.colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.searchInputWrap}>
            <Ionicons name="search" size={16} color={DesignSystem.colors.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tracks, artists, playlists…"
              placeholderTextColor={DesignSystem.colors.textMuted}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={16} color={DesignSystem.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Chips */}
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveCategory(item)}
              style={[styles.chip, activeCategory === item && styles.chipActive]}
            >
              <Text style={[styles.chipText, activeCategory === item && styles.chipTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Content */}
        {searchText.trim().length < 2 && (
          <View style={styles.browseSection}>
            <Text style={styles.browseTitle}>Browse Genres</Text>
            <View style={styles.genreGrid}>
              {GENRE_CHIPS.map((g) => (
                <TouchableOpacity
                  key={g.label}
                  style={[styles.genreCard, { backgroundColor: g.color + '33' }]}
                  onPress={() => setSearchText(g.label)}
                >
                  <LinearGradient
                    colors={[g.color + '55', g.color + '22']}
                    style={styles.genreCardInner}
                  >
                    <Ionicons name="musical-notes" size={20} color={g.color} />
                    <Text style={[styles.genreLabel, { color: g.color }]}>{g.label}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {isLoading && (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={DesignSystem.colors.primaryRed} />
          </View>
        )}

        {!isLoading && error && (
          <View style={styles.centerState}>
            <Ionicons name="alert-circle" size={40} color={DesignSystem.colors.errorRed} />
            <Text style={styles.stateText}>Search failed. Try again.</Text>
          </View>
        )}

        {!isLoading && !error && searchText.trim().length >= 2 && filteredResults.length === 0 && (
          <View style={styles.centerState}>
            <Ionicons name="search" size={48} color={DesignSystem.colors.surfaceContainerHighest} />
            <Text style={styles.stateText}>No results for &quot;{searchText}&quot;</Text>
            <Text style={styles.stateSubtext}>Try a different spelling or genre</Text>
          </View>
        )}

        {!isLoading && filteredResults.length > 0 && (
          <FlatList
            data={filteredResults}
            renderItem={renderResult}
            keyExtractor={(item) => `${item.id}-${item.type}`}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
          />
        )}

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DesignSystem.colors.backgroundPrimary },
  inner: { flex: 1 },
  searchHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: DesignSystem.spacing.sm, paddingVertical: DesignSystem.spacing.sm },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  searchInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: DesignSystem.colors.surfaceContainer, borderRadius: DesignSystem.radius.xl, paddingHorizontal: DesignSystem.spacing.sm, height: 44, marginLeft: 8 },
  searchInput: { flex: 1, color: DesignSystem.colors.onSurface, ...DesignSystem.typography.bodyLarge },
  chipList: { paddingHorizontal: DesignSystem.spacing.md, paddingBottom: DesignSystem.spacing.sm, gap: 8 },
  chip: { paddingHorizontal: DesignSystem.spacing.md, paddingVertical: 7, borderRadius: DesignSystem.radius.full, backgroundColor: DesignSystem.colors.surfaceContainer, borderWidth: 1, borderColor: DesignSystem.colors.borderColor },
  chipActive: { backgroundColor: DesignSystem.colors.primaryRed, borderColor: DesignSystem.colors.primaryRed },
  chipText: { color: DesignSystem.colors.textMuted, ...DesignSystem.typography.labelMedium },
  chipTextActive: { color: DesignSystem.colors.onPrimary },
  browseSection: { paddingHorizontal: DesignSystem.spacing.md, marginTop: 8 },
  browseTitle: { color: DesignSystem.colors.onSurface, ...DesignSystem.typography.titleLarge, marginBottom: DesignSystem.spacing.md },
  genreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  genreCard: { width: '46%', borderRadius: DesignSystem.radius.md, overflow: 'hidden' },
  genreCardInner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: DesignSystem.spacing.md },
  genreLabel: { ...DesignSystem.typography.bodyLarge, fontWeight: '700' },
  centerState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  stateText: { color: DesignSystem.colors.textMuted, ...DesignSystem.typography.titleMedium },
  stateSubtext: { color: DesignSystem.colors.textSecondary, ...DesignSystem.typography.bodyMedium },
  resultsList: { paddingHorizontal: DesignSystem.spacing.md, paddingBottom: 40 },
  resultRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: DesignSystem.colors.borderColor },
  resultThumb: { width: 52, height: 52, borderRadius: DesignSystem.radius.sm, backgroundColor: DesignSystem.colors.surfaceContainer, marginRight: 14 },
  circularThumb: { borderRadius: 26 },
  resultInfo: { flex: 1 },
  resultTitle: { color: DesignSystem.colors.onSurface, ...DesignSystem.typography.titleMedium, marginBottom: 4 },
  resultMeta: { flexDirection: 'row', alignItems: 'center' },
  resultSubtitle: { color: DesignSystem.colors.textMuted, ...DesignSystem.typography.bodySmall },
  playBtn: { padding: 4 },
});

export default SearchScreen;