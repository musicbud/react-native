import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetGenresQuery, useGetDiscoverContentQuery, useGetTrendingContentQuery } from '../store/api';

const { width, height } = Dimensions.get('window');

const DiscoverAltScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  // Fetch data using RTK Query
  const { data: genresData, error: genresError, isLoading: isGenresLoading } = useGetGenresQuery();
  const { data: discoverContentData, error: discoverContentError, isLoading: isDiscoverContentLoading } = useGetDiscoverContentQuery();
  const { data: trendingTracksData, error: trendingTracksError, isLoading: isTrendingTracksLoading } = useGetTrendingContentQuery({ type: 'tracks' });

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
  const musicGenres = genresData?.data?.music || [];
  const recommendedPlaylists = discoverContentData?.data?.playlists || []; // Assuming discoverContent returns playlists
  const recentFavorites = trendingTracksData?.data?.tracks || []; // Using trending tracks as "Recent Favorites"

  const renderPlaylistItem = ({ item }: { item: any }) => (
    <View style={styles.playlistItem}>
      <Image source={{ uri: item.cover || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.playlistCover} />
      <Text style={styles.playlistTitle}>{item.name}</Text>
      <Text style={styles.playlistArtist}>{item.artist || 'Various Artists'}</Text>
      {/* Assuming a play icon or bookmark for interaction */}
    </View>
  );

  const renderFavoriteItem = ({ item }: { item: any }) => (
    <View style={styles.favoriteItem}>
      <Image source={{ uri: item.cover || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.favoriteCover} />
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
      <Image
        source={{/* require('../../assets/ui/Search/Discover-1.png') */}} // Primary background
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
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => router.push(`/Search?q=${searchText}`)}
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
    textAlign: 'center',
    marginBottom: 20,
  },
  searchBarContainer: {
    marginBottom: 30,
  },
  searchBarInput: {
    height: 50,
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: 'white',
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: 'white',
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
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playlistArtist: {
    color: '#888',
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
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  favoriteArtist: {
    color: '#888',
    fontSize: 12,
  },
  genreItem: {
    backgroundColor: 'rgba(50,50,50,0.5)', // Example genre tag color
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10, // For wrapping
  },
  genreText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DiscoverAltScreen;