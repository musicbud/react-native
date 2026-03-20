import React, { useState } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { DesignSystem } from '../theme/design_system';
import {
  usePublicGenresV1DiscoverPublicGenresGetQuery,
  usePublicDiscoverRootV1DiscoverPublicGetQuery,
  usePublicTrendingV1DiscoverPublicTrendingGetQuery
} from '../store/api';

const { width, height } = Dimensions.get('window');

const DiscoverAltScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  // Fetch data using RTK Query
  const { data: genresWrapper, error: genresError, isLoading: isGenresLoading } = usePublicGenresV1DiscoverPublicGenresGetQuery({});
  const { data: discoverContentWrapper, error: discoverContentError, isLoading: isDiscoverContentLoading } = usePublicDiscoverRootV1DiscoverPublicGetQuery();
  const { data: trendingTracksWrapper, error: trendingTracksError, isLoading: isTrendingTracksLoading } = usePublicTrendingV1DiscoverPublicTrendingGetQuery({ contentType: 'tracks' });

  // Handle loading and error states
  if (isGenresLoading || isDiscoverContentLoading || isTrendingTracksLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading discover content...</Text>
      </View>
    );
  }

  if (genresError || discoverContentError || trendingTracksError) {
    console.error("Genres Error:", genresError);
    console.error("Discover Content Error:", discoverContentError);
    console.error("Trending Tracks Error:", trendingTracksError);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load discover content.</Text>
        <Text style={styles.errorText}>Please check your backend server.</Text>
      </View>
    );
  }

  // Extract data (with fallback to empty array if data is null/undefined)
  const musicGenres = genresWrapper?.data?.music || [];
  const recommendedPlaylists = discoverContentWrapper?.data?.playlists || []; // Assuming discoverContent returns playlists
  const recentFavorites = trendingTracksWrapper?.data?.tracks || []; // Using trending tracks as "Recent Favorites"

  const renderPlaylistItem = ({ item }: { item: any }) => (
    <View style={styles.playlistItem}>
      <SafeImage source={{ uri: item.cover || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.playlistCover} />
      <Text style={styles.playlistTitle}>{item.name}</Text>
      <Text style={styles.playlistArtist}>{item.artist || 'Various Artists'}</Text>
      {/* Assuming a play icon or bookmark for interaction */}
    </View>
  );

  const renderFavoriteItem = ({ item }: { item: any }) => (
    <View style={styles.favoriteItem}>
      <SafeImage source={{ uri: item.cover || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.favoriteCover} />
      <Text style={styles.favoriteTitle}>{item.name}</Text>
      <Text style={styles.favoriteArtist}>{item.artist || 'Various Artists'}</Text>
    </View>
  );

  const renderGenreItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.genreItem} onPress={() => console.log('Genre pressed:', item.name)}>
      <Text style={styles.genreText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <SafeImage
        source={{/* require('../../assets/ui/Search/Discover-1.png') */ }} // Primary background
        style={styles.fullBackgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.screenTitle}>Discover</Text>

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBarInput}
            placeholder="Search..."
            placeholderTextColor={DesignSystem.colors.textMuted}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => router.push(`/Search?q=${searchText}` as any)}
          />
          {/* Add search icon */}
        </View>

        {/* Recommended Playlists */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended playlists</Text>
          <FlatList
            horizontal
            data={recommendedPlaylists}
            keyExtractor={(item) => item.id}
            renderItem={renderPlaylistItem}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Recent Favorites */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Favorites</Text>
          <FlatList
            horizontal
            data={recentFavorites}
            keyExtractor={(item) => item.id}
            renderItem={renderFavoriteItem}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Music Genres */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Music Genres</Text>
          <FlatList
            horizontal
            data={musicGenres}
            keyExtractor={(item) => item.id}
            renderItem={renderGenreItem}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignSystem.colors.background,
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DesignSystem.colors.backgroundPrimary,
  },
  loadingText: {
    color: DesignSystem.colors.textPrimary,
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DesignSystem.colors.backgroundPrimary,
    padding: 20,
  },
  errorText: {
    color: DesignSystem.colors.errorRed,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  screenTitle: {
    color: DesignSystem.colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchBarContainer: {
    marginBottom: 30,
  },
  searchBarInput: {
    height: 50,
    backgroundColor: DesignSystem.colors.surfaceContainer,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: DesignSystem.colors.textPrimary,
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: DesignSystem.colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  playlistItem: {
    marginRight: 15,
    width: 120,
  },
  playlistCover: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 5,
  },
  playlistTitle: {
    color: DesignSystem.colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  playlistArtist: {
    color: DesignSystem.colors.textMuted,
    fontSize: 12,
  },
  favoriteItem: {
    marginRight: 15,
    width: 120,
  },
  favoriteCover: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 5,
  },
  favoriteTitle: {
    color: DesignSystem.colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  favoriteArtist: {
    color: DesignSystem.colors.textMuted,
    fontSize: 12,
  },
  genreItem: {
    backgroundColor: DesignSystem.colors.surfaceContainerHigh,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10, // For wrapping
  },
  genreText: {
    color: DesignSystem.colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DiscoverAltScreen;