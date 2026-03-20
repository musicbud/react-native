import React, { useState } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, ScrollView, TouchableOpacity, FlatList, TextInput, StatusBar, ActivityIndicator, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  usePublicGenresV1DiscoverPublicGenresGetQuery,
  usePublicDiscoverRootV1DiscoverPublicGetQuery,
  usePublicTrendingV1DiscoverPublicTrendingGetQuery,
  useGetMyPlaylistsV1PlaylistsPlaylistsMeGetQuery,
  useAddTrackToPlaylistV1LibraryPlaylistsPlaylistIdTracksPostMutation,
  useCommonLikedTracksV1BudBudLikedTracksPostMutation,
  useCommonLikedArtistsV1BudBudLikedArtistsPostMutation,
  useAddUserInterestV1UsersInterestsCategoryInterestPostMutation,
  useRemoveUserInterestV1UsersInterestsCategoryInterestDeleteMutation
} from '../store/api';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayer } from '../context/PlayerContext';
import { Ionicons } from '@expo/vector-icons';
import { SectionHeader } from '../components/common/SectionHeader';
import { MediaCarousel } from '../components/common/MediaCarousel';
import { DesignSystem } from '../theme/design_system';

const DiscoverScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const { playTrack } = usePlayer();

  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isAddToPlaylistModalVisible, setAddToPlaylistModalVisible] = useState(false);

  // Fetch data
  const { data: genresWrapper, isLoading: isGenresLoading, refetch: refetchGenres } = usePublicGenresV1DiscoverPublicGenresGetQuery({});
  const { data: discoverContentWrapper, isLoading: isDiscoverContentLoading } = usePublicDiscoverRootV1DiscoverPublicGetQuery();
  const { data: trendingTracksWrapper, isLoading: isTrendingTracksLoading } = usePublicTrendingV1DiscoverPublicTrendingGetQuery({ contentType: 'tracks' });
  const { data: playlistsWrapper, isLoading: isPlaylistsLoading } = useGetMyPlaylistsV1PlaylistsPlaylistsMeGetQuery();

  const [addTrackToPlaylist, { isLoading: isAddingTrack }] = useAddTrackToPlaylistV1LibraryPlaylistsPlaylistIdTracksPostMutation();
  const [likeTrack] = useCommonLikedTracksV1BudBudLikedTracksPostMutation();
  const [likeArtist] = useCommonLikedArtistsV1BudBudLikedArtistsPostMutation();
  const [addInterest] = useAddUserInterestV1UsersInterestsCategoryInterestPostMutation();
  const [removeInterest] = useRemoveUserInterestV1UsersInterestsCategoryInterestDeleteMutation();

  const handleLike = async (id: string, type: string) => {
    try {
      if (type === 'track') {
        await likeTrack({ budRequest: { identifier: id } }).unwrap();
      } else if (type === 'artist') {
        await likeArtist({ budRequest: { identifier: id } }).unwrap();
      }
      Alert.alert("Liked!", `Added to your favorites.`);
    } catch {
      Alert.alert("Error", "Failed to like item.");
    }
  };

  const toggleInterest = async (category: string, interest: string, isSelected: boolean) => {
    try {
      if (isSelected) {
        await removeInterest({ category, interest }).unwrap();
      } else {
        await addInterest({ category, interest }).unwrap();
      }
      refetchGenres();
    } catch {
      Alert.alert("Error", "Failed to update interest.");
    }
  };

  // Handle loading
  if (isGenresLoading || isDiscoverContentLoading || isTrendingTracksLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={DesignSystem.colors.primary} />
      </View>
    );
  }

  const musicGenres = genresWrapper?.data?.music || [];
  const popularArtists = discoverContentWrapper?.data?.popular_artists || [];
  const recentFavorites = trendingTracksWrapper?.data?.tracks || [];

  const playlistsData = playlistsWrapper?.data || [];

  const handleTrackPress = (track: any) => {
    playTrack(track);
    router.push({ pathname: '/DetailsScreen', params: { id: track.id, type: 'track' } });
  };

  const handleArtistPress = (artist: any) => {
    router.push({ pathname: '/DetailsScreen', params: { id: artist.id, type: 'artist' } });
  };

  const handleOptionsPress = (track: any) => {
    setSelectedTrackId(track.id);
    setAddToPlaylistModalVisible(true);
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!selectedTrackId) return;

    try {
      await addTrackToPlaylist({ playlistId, trackData: { track_id: selectedTrackId } }).unwrap();
      Alert.alert('Success', 'Track added to playlist!');
      setAddToPlaylistModalVisible(false);
      setSelectedTrackId(null);
    } catch (error: any) {
      console.error('Failed to add track:', error);
      Alert.alert('Error', error?.data?.detail || 'Failed to add track.');
    }
  };

  const renderGenreItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => toggleInterest('music', item.name, false)}>
      <LinearGradient
        colors={[DesignSystem.colors.surfaceContainerHigh, DesignSystem.colors.surfaceContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-full py-2 px-4 mr-2 mb-2 border border-surface-border"
      >
        <Text className="text-text-primary font-sans font-medium text-sm">{item.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Header Hero Section */}
        <LinearGradient
          colors={[DesignSystem.colors.primary + '1F', 'transparent']}
          className="pt-16 px-6 pb-8 rounded-b-[48px]"
        >
          <Text className="text-text-primary font-display font-bold text-4xl mb-6 tracking-tight">
            Discover
          </Text>

          <View className="mb-2">
            <View className="h-14 bg-background-layer1/80 rounded-2xl px-5 border border-white/5 flex-row items-center backdrop-blur-md">
              <Ionicons name="search" size={20} color={DesignSystem.colors.textMuted} />
              <TextInput
                className="flex-1 text-text-primary font-sans text-base ml-3"
                placeholder="Find tracks, artists, moods..."
                placeholderTextColor={DesignSystem.colors.textMuted}
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={() => router.push(`/SearchScreen?q=${searchText}`)}
              />
            </View>
          </View>
        </LinearGradient>

        <View className="pt-6">
          <MediaCarousel
            title="Popular Artists"
            data={popularArtists}
            onItemPress={handleArtistPress}
            onItemLikePress={(item) => handleLike(item.id, 'artist')}
            emptyText="No popular artists found."
          />

          <MediaCarousel
            title="Trending Tracks"
            data={recentFavorites}
            size="small"
            onItemPress={handleTrackPress}
            onItemMorePress={handleOptionsPress}
            onItemLikePress={(item) => handleLike(item.id, 'track')}
            emptyText="No trending tracks available."
          />

          {/* Music Genres */}
          <View className="mb-8">
            <SectionHeader title="Browse Genres" style={{ paddingHorizontal: 16 }} />
            <View className="flex-row flex-wrap px-4 mt-3">
              {musicGenres.length > 0 ? (
                musicGenres.map((genre: any) => (
                  <View key={genre.id}>{renderGenreItem({ item: genre })}</View>
                ))
              ) : (
                <Text className="text-text-secondary font-sans italic py-4 text-center w-full">Genres are currently unavailable.</Text>
              )}
            </View>
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
        <View className="flex-1 bg-black/70 justify-end">
          <View style={{ backgroundColor: DesignSystem.colors.surfaceContainerHighest }} className="rounded-t-[40px] p-8 pb-12 border-t border-white/5 shadow-2xl">
            <View className="w-12 h-1.5 bg-white/10 rounded-full self-center mb-8" />

            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-text-primary font-display font-bold text-3xl">Add to Playlist</Text>
              <TouchableOpacity
                onPress={() => setAddToPlaylistModalVisible(false)}
                className="w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10"
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {isPlaylistsLoading ? (
              <ActivityIndicator color={DesignSystem.colors.primary} className="my-10" />
            ) : (!playlistsData || playlistsData.length === 0) ? (
              <View className="items-center my-10 px-8">
                <View className="w-16 h-16 bg-white/5 rounded-full items-center justify-center mb-4">
                  <Ionicons name="musical-notes-outline" size={32} color={DesignSystem.colors.textMuted} />
                </View>
                <Text className="text-text-secondary text-center font-sans text-lg">You don&apos;t have any playlists yet.</Text>
              </View>
            ) : (
              <FlatList
                data={playlistsData}
                keyExtractor={(item) => item.id}
                style={{ maxHeight: 380 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex-row items-center py-4 px-4 bg-white/5 rounded-2xl mb-3 border border-white/5"
                    onPress={() => handleAddToPlaylist(item.id)}
                    disabled={isAddingTrack}
                  >
                    <SafeImage
                      source={{ uri: item.cover_url || 'https://ui-avatars.com/api/?name=Music+Bud&background=random' }}
                      className="w-16 h-16 rounded-xl mr-4"
                    />
                    <View className="flex-1">
                      <Text className="text-text-primary font-sans font-bold text-lg" numberOfLines={1}>{item.name}</Text>
                      <Text className="text-text-secondary font-sans text-sm">{item.track_count || 0} tracks</Text>
                    </View>
                    <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                      <Ionicons name="add" size={24} color={DesignSystem.colors.primary} />
                    </View>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DiscoverScreen;