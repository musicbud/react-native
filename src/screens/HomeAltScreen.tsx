import React from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DesignSystem } from '../theme/design_system';
import {
  usePublicDiscoverRootV1DiscoverPublicGetQuery,
  usePublicRecommendationsRootV1RecommendationsPublicGetQuery,
  usePublicTrendingV1DiscoverPublicTrendingGetQuery,
} from '../store/api';

const { width, height } = Dimensions.get('window');

const HomeAltScreen = () => {
  const router = useRouter();

  const { isLoading: isDiscoverContentLoading } = usePublicDiscoverRootV1DiscoverPublicGetQuery();
  const { data: publicRecommendationsWrapper, error: publicRecommendationsError, isLoading: isPublicRecommendationsLoading } = usePublicRecommendationsRootV1RecommendationsPublicGetQuery({ genre: undefined, limit: undefined });
  const { data: trendingContentWrapper, error: trendingContentError, isLoading: isTrendingContentLoading } = usePublicTrendingV1DiscoverPublicTrendingGetQuery({ contentType: 'all' });


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

  const trendingNow = trendingContentWrapper?.data?.content || [];
  const recommendedForYou = publicRecommendationsWrapper?.data?.content || [];

  const renderContentCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.contentCard} onPress={() => router.push({ pathname: '/DetailsScreen', params: { id: item.id, type: item.type || 'track' } })}>
      <SafeImage source={{ uri: item.cover || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.contentCardImage} />
      <Text style={styles.contentCardTitle}>{item.title || item.name}</Text>
      <Text style={styles.contentCardSubtitle}>{item.artist || item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <SafeImage
        source={{/* require('../../assets/ui/Home-1.png') */ }}
        style={styles.fullBackgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Musicbud</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/SearchScreen')}>
              <Ionicons name="search" size={24} color={DesignSystem.colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/UserProfileScreen')}>
              <Ionicons name="settings" size={24} color={DesignSystem.colors.textPrimary} />
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
    backgroundColor: DesignSystem.colors.backgroundPrimary,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    color: DesignSystem.colors.textPrimary,
    ...DesignSystem.typography.headlineMedium,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
    marginLeft: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: DesignSystem.colors.textPrimary,
    ...DesignSystem.typography.titleLarge,
    marginBottom: 15,
  },
  contentCard: {
    marginRight: 15,
    width: 150,
  },
  contentCardImage: {
    width: 150,
    height: 150,
    borderRadius: DesignSystem.radius.lg,
    marginBottom: DesignSystem.spacing.xs,
  },
  contentCardTitle: {
    color: DesignSystem.colors.textPrimary,
    ...DesignSystem.typography.bodyLarge,
    fontWeight: 'bold',
  },
  contentCardSubtitle: {
    color: DesignSystem.colors.textMuted,
    ...DesignSystem.typography.bodyMedium,
  },
});

export default HomeAltScreen;