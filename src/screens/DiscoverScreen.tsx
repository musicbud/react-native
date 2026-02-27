import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, TextInput, StatusBar, ActivityIndicator, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetGenresQuery, useGetDiscoverContentQuery, useGetTrendingContentQuery, useGetUserPlaylistsQuery, useAddTrackToPlaylistMutation } from '../store/api';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayer } from '../context/PlayerContext';

const DiscoverScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const { playTrack } = usePlayer();

  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isAddToPlaylistModalVisible, setAddToPlaylistModalVisible] = useState(false);

  // Fetch data
  const { data: genresData, isLoading: isGenresLoading } = useGetGenresQuery();
  const { data: discoverContentData, isLoading: isDiscoverContentLoading } = useGetDiscoverContentQuery();
  const { data: trendingTracksData, isLoading: isTrendingTracksLoading } = useGetTrendingContentQuery({ type: 'tracks' });
  const { data: playlistsData, isLoading: isPlaylistsLoading } = useGetUserPlaylistsQuery();

  const [addTrackToPlaylist, { isLoading: isAddingTrack }] = useAddTrackToPlaylistMutation();

  // Handle loading
  if (isGenresLoading || isDiscoverContentLoading || isTrendingTracksLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  const musicGenres = genresData?.data?.music || [];
  const recommendedPlaylists = discoverContentData?.data?.featured_playlists || [];
  const recentFavorites = trendingTracksData?.data?.tracks || [];

  const renderPlaylistItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => router.push({ pathname: '/DetailsScreen', params: { id: item.id, type: 'playlist' } })}>
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        style={styles.playlistItem}
      >
        <Image source={{ uri: item.cover_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.playlistCover} />
        <Text style={styles.playlistTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.playlistArtist} numberOfLines={1}>{item.owner?.display_name || 'MusicBud'}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!selectedTrackId) return;

    try {
      await addTrackToPlaylist({ playlistId, trackId: selectedTrackId }).unwrap();
      Alert.alert('Success', 'Track added to playlist!');
      setAddToPlaylistModalVisible(false);
      setSelectedTrackId(null);
    } catch (error: any) {
      console.error('Failed to add track:', error);
      Alert.alert('Error', error?.data?.detail || 'Failed to add track.');
    }
  };

  const renderFavoriteItem = ({ item }: { item: any }) => (
    <View style={styles.favoriteItemWrapper}>
      <TouchableOpacity onPress={() => {
        playTrack(item);
        router.push({ pathname: '/DetailsScreen', params: { id: item.id, type: 'track' } });
      }}>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={styles.favoriteItem}
        >
          <Image source={{ uri: item.cover_url || 'https://ui-avatars.com/api/?name=Music+Bud&background=random' }} style={styles.favoriteCover} />
          <Text style={styles.favoriteTitle} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.favoriteArtist} numberOfLines={1}>{item.artist}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionsButton}
        onPress={() => {
          setSelectedTrackId(item.id);
          setAddToPlaylistModalVisible(true);
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.optionsIcon}>⋮</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGenreItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => router.push(`/SearchScreen?category=${item.name}`)}>
      <LinearGradient
        colors={['#1E90FF', '#007AFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.genreItem}
      >
        <Text style={styles.genreText}>{item.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={['rgba(30,30,30,0.8)', '#000']}
          style={styles.headerGradient}
        >
          <Text style={styles.screenTitle}>Discover</Text>

          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchBarInput}
              placeholder="Search songs, artists, albums..."
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={() => router.push(`/SearchScreen?q=${searchText}`)}
            />
          </View>
        </LinearGradient>

        <View style={styles.contentSection}>
          {/* Recommended Playlists */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Playlists</Text>
            <FlatList
              horizontal
              data={recommendedPlaylists}
              keyExtractor={(item) => item.id}
              renderItem={renderPlaylistItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={<Text style={styles.emptyText}>No playlists available right now.</Text>}
            />
          </View>

          {/* Recent Favorites / Trending */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending Tracks</Text>
            <FlatList
              horizontal
              data={recentFavorites}
              keyExtractor={(item) => item.id}
              renderItem={renderFavoriteItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={<Text style={styles.emptyText}>No trending tracks found.</Text>}
            />
          </View>

          {/* Music Genres */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Browse Genres</Text>
            <FlatList
              horizontal
              data={musicGenres}
              keyExtractor={(item) => item.id}
              renderItem={renderGenreItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={<Text style={styles.emptyText}>Genres are currently unavailable.</Text>}
            />
          </View>
        </View>
      </ScrollView>

      {/* Add To Playlist Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddToPlaylistModalVisible}
        onRequestClose={() => setAddToPlaylistModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add to Playlist</Text>
              <TouchableOpacity onPress={() => setAddToPlaylistModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {isPlaylistsLoading ? (
              <ActivityIndicator color="#1E90FF" style={{ marginVertical: 30 }} />
            ) : (!playlistsData || playlistsData.length === 0) ? (
              <Text style={styles.emptyPlaylistsText}>You don&apos;t have any playlists yet.</Text>
            ) : (
              <FlatList
                data={playlistsData}
                keyExtractor={(item) => item.id}
                style={{ maxHeight: 300 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.playlistRow}
                    onPress={() => handleAddToPlaylist(item.id)}
                    disabled={isAddingTrack}
                  >
                    <Image
                      source={{ uri: item.cover_url || 'https://ui-avatars.com/api/?name=Music+Bud&background=random' }}
                      style={styles.rowCover}
                    />
                    <Text style={styles.rowTitle} numberOfLines={1}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerGradient: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  screenTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  searchBarContainer: {
    marginBottom: 10,
  },
  searchBarInput: {
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    paddingHorizontal: 20,
    color: 'white',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  contentSection: {
    paddingTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  playlistItem: {
    marginRight: 15,
    width: 140,
    borderRadius: 16,
    padding: 10,
  },
  playlistCover: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
    alignSelf: 'center',
  },
  playlistTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  playlistArtist: {
    color: '#aaa',
    fontSize: 12,
  },
  favoriteItemWrapper: {
    marginRight: 15,
    width: 140,
    position: 'relative',
  },
  favoriteItem: {
    borderRadius: 16,
    padding: 10,
    width: '100%',
  },
  favoriteCover: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
    alignSelf: 'center',
  },
  favoriteTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  favoriteArtist: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  optionsButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  genreItem: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginRight: 12,
    marginBottom: 10,
  },
  genreText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
    paddingVertical: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#888',
    fontSize: 24,
    padding: 5,
  },
  emptyPlaylistsText: {
    color: '#888',
    textAlign: 'center',
    marginVertical: 40,
    fontSize: 16,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  rowCover: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  rowTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});

export default DiscoverScreen;