import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetStoriesQuery } from '../store/api'; // Use useGetStoriesQuery

const { width, height } = Dimensions.get('window');

const StoriesScreen = () => {
  const router = useRouter();
  // Fetch stories
  const { data: storiesData, error: storiesError, isLoading: isStoriesLoading } = useGetStoriesQuery();

  if (isStoriesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Loading Stories...</Text>
      </View>
    );
  }

  if (storiesError) {
    console.error("Stories Error:", storiesError);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load stories.</Text>
        <Text style={styles.errorText}>Please check your backend server.</Text>
      </View>
    );
  }

  const stories = storiesData?.data || []; // Assuming data key holds the array of stories

  const renderStoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.storyItem} onPress={() => router.push(`/StoryView/${item.id}`)}>
      <View style={[styles.storyAvatarContainer, item.isLive && styles.liveIndicator]}>
        <Image source={{ uri: item.creator?.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyName}>{item.creator?.username || 'Unknown User'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image
        source={{/* require('../../assets/ui/Stories.png') */}}
        style={styles.fullBackgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.screenTitle}>Stories</Text>

        {stories.length === 0 ? (
          <View style={styles.noStoriesContainer}>
            <Text style={styles.noStoriesText}>No stories available at the moment.</Text>
            <Text style={styles.noStoriesText}>Why not create one?</Text>
          </View>
        ) : (
          <FlatList
            data={stories}
            renderItem={renderStoryItem}
            keyExtractor={(item) => item.id}
            numColumns={4} // Example number of columns for grid layout
            contentContainerStyle={styles.storiesGrid}
            columnWrapperStyle={styles.storiesGridColumnWrapper}
          />
        )}
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
  storiesGrid: {
    justifyContent: 'flex-start',
    paddingBottom: 20,
  },
  storiesGridColumnWrapper: {
    justifyContent: 'space-around',
  },
  storyItem: {
    alignItems: 'center',
    margin: 10,
  },
  storyAvatarContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 2,
    borderColor: '#555', // Default border
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  liveIndicator: {
    borderColor: '#FF0000', // Red border for live stories
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  storyName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  noStoriesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noStoriesText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default StoriesScreen;