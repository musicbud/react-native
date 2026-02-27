import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetDiscoverContentQuery, useGetPublicRecommendationsQuery, useGetTrendingContentQuery } from '../store/api';

const { width, height } = Dimensions.get('window');

const HomeAltScreen = () => {
  const router = useRouter();

  const { data: discoverContentData, error: discoverContentError, isLoading: isDiscoverContentLoading } = useGetDiscoverContentQuery();
  const { data: publicRecommendationsData, error: publicRecommendationsError, isLoading: isPublicRecommendationsLoading } = useGetPublicRecommendationsQuery({ type: 'all' });
  const { data: trendingContentData, error: trendingContentError, isLoading: isTrendingContentLoading } = useGetTrendingContentQuery({ type: 'all' });

  if (isDiscoverContentLoading || isPublicRecommendationsLoading || isTrendingContentLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Home Feed...</Text>
      </View>
    );
  }

  if (discoverContentError || publicRecommendationsError || trendingContentError) {
    console.error("Discover Content Error:", discoverContentError);
    console.error("Public Recommendations Error:", publicRecommendationsError);
    console.error("Trending Content Error:", trendingContentError);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load home content.</Text>
        <Text style={styles.errorText}>Please check your backend server.</Text>
      </View>
    );
  }

  const trendingNow = trendingContentData?.data?.content || [];
  const recommendedForYou = publicRecommendationsData?.data?.content || [];

  const renderContentCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.contentCard} onPress={() => router.push({ pathname: '/DetailsScreen', params: { id: item.id, type: item.type || 'track' } })}>
      <Image source={{ uri: item.cover || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.contentCardImage} />
      <Text style={styles.contentCardTitle}>{item.title || item.name}</Text>
      <Text style={styles.contentCardSubtitle}>{item.artist || item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{/* require('../../assets/ui/Home-1.png') */}}
        style={styles.fullBackgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Musicbud</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => router.push('/SearchScreen')}>
              <Text style={styles.headerIcon}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/UserProfileScreen')}>
              <Text style={styles.headerIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trending Now */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <FlatList
            horizontal
            data={trendingNow}
            renderItem={renderContentCard}
            keyExtractor={(item) => item.id + item.type}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Recommended For You */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <FlatList
            horizontal
            data={recommendedForYou}
            renderItem={renderContentCard}
            keyExtractor={(item) => item.id + item.type}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Add more sections as per the Figma design */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    color: 'white',
    fontSize: 24,
    marginLeft: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  contentCard: {
    marginRight: 15,
    width: 150,
  },
  contentCardImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  contentCardTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentCardSubtitle: {
    color: '#888',
    fontSize: 12,
  },
});

export default HomeAltScreen;