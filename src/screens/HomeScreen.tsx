import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetDiscoverContentQuery, useGetTrendingContentQuery, useGetMyProfileQuery, useGetConnectionsQuery, User } from '../store/api';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayer } from '../context/PlayerContext';

const HomeScreen = () => {
  const router = useRouter();
  const { playTrack } = usePlayer();
  const { data: discoverContent, error: discoverError, isLoading: isDiscoverLoading } = useGetDiscoverContentQuery();
  const { data: trendingTracks, error: trendingError, isLoading: isTrendingLoading } = useGetTrendingContentQuery({ type: 'tracks' });
  const { data: myProfile, error: myProfileError, isLoading: isMyProfileLoading } = useGetMyProfileQuery();
  // Use connections as "Stories" for now, representing active friends
  const { data: connections } = useGetConnectionsQuery({ limit: 10 });

  const isLoading = isDiscoverLoading || isTrendingLoading || isMyProfileLoading;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (discoverError || trendingError || myProfileError) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>Failed to load content.</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const userProfile: User = myProfile || { id: 'guest', username: 'Guest', email: '', avatar_url: 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' };

  // Filter valid connections for stories
  const storyData = connections?.filter((user: User) => user.avatar_url) || [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/UserProfileScreen')}>
            <Image source={{ uri: userProfile.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.avatar} />
          </TouchableOpacity>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Good evening,</Text>
            <Text style={styles.usernameText}>{userProfile.first_name || userProfile.username}</Text>
          </View>
          <TouchableOpacity onPress={() => console.log('Notifications pressed')} style={styles.iconButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Stories Section (Connections) */}
        <View style={styles.section}>
          <FlatList
            horizontal
            data={[{ id: 'add', username: 'Add Status', avatar_url: userProfile.avatar_url } as User, ...storyData]}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={styles.storyItem}>
                <View style={[styles.storyRing, index === 0 && styles.addStoryRing]}>
                  <Image source={{ uri: item.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.storyAvatar} />
                  {index === 0 && (
                    <View style={styles.addStoryBadge}>
                      <Text style={styles.addStoryText}>+</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.storyName} numberOfLines={1}>{index === 0 ? 'My Status' : item.first_name || item.username}</Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storyList}
          />
        </View>

        {/* Featured Content (Trending Track) */}
        {discoverContent?.data?.trending_tracks?.[0] && (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Featured Today</Text>
            <TouchableOpacity style={styles.featuredCard}>
              <Image source={{ uri: discoverContent.data.trending_tracks[0].cover_url }} style={styles.featuredImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.featuredOverlay}
              >
                <Text style={styles.featuredTag}>Specially for you</Text>
                <Text style={styles.featuredTitle}>{discoverContent.data.trending_tracks[0].name}</Text>
                <Text style={styles.featuredSubtitle}>{discoverContent.data.trending_tracks[0].artist}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Recently Added (Using Trending Tracks as placeholder if needed, or New Releases) */}
        {discoverContent?.data?.new_releases && discoverContent.data.new_releases.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>New Releases</Text>
              <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={discoverContent.data.new_releases}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.cardItem}>
                  <Image source={{ uri: item.cover_url }} style={styles.cardImage} />
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>{item.artist}</Text>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Trending Tracks */}
        {trendingTracks?.data?.tracks && trendingTracks.data.tracks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending Now</Text>
              <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={trendingTracks.data.tracks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.cardItem} onPress={() => playTrack(item)}>
                  <Image source={{ uri: item.cover_url }} style={styles.cardImage} />
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>{item.artist}</Text>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Darker, premium background
  },
  scrollContent: {
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  greetingContainer: {
    flex: 1,
    marginLeft: 12,
  },
  greetingText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
  },
  usernameText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  notificationIcon: {
    color: 'white',
    fontSize: 18,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  seeAllText: {
    color: '#1E90FF',
    fontSize: 12,
    fontWeight: '600',
  },
  storyList: {
    paddingHorizontal: 15,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 64,
  },
  storyRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#1E90FF',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  addStoryRing: {
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#333',
  },
  addStoryBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1E90FF',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#121212',
  },
  addStoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -2,
  },
  storyName: {
    color: '#CCC',
    fontSize: 11,
    textAlign: 'center',
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featuredCard: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 15,
    backgroundColor: '#333',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  featuredTag: {
    color: '#1E90FF',
    fontWeight: '700',
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  featuredTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  featuredSubtitle: {
    color: '#CCC',
    fontSize: 14,
    fontWeight: '500',
  },
  horizontalList: {
    paddingHorizontal: 15,
  },
  cardItem: {
    marginHorizontal: 8,
    width: 140,
  },
  cardImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#333',
  },
  cardTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#888',
    fontSize: 12,
  },
});

export default HomeScreen;