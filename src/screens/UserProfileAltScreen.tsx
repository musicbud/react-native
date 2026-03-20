import React from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DesignSystem } from '../theme/design_system';
import {
  useGetUserProfileByIdV1UsersProfileUserIdGetQuery,
  useGetRecentActivityV1UsersActivityRecentGetQuery,
  useGetCurrentUserInfoV1AuthMeGetQuery
} from '../store/api';

const { width, height } = Dimensions.get('window');

const UserProfileAltScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const routeUserId = params.id as string | undefined;

  const { data: myProfileWrapper } = useGetCurrentUserInfoV1AuthMeGetQuery(undefined, { skip: !!routeUserId });
  const myProfile = myProfileWrapper?.data;
  const userId = routeUserId || myProfile?.id;

  const { data: userProfileData, error: userProfileError, isLoading: isUserProfileLoading } = useGetUserProfileByIdV1UsersProfileUserIdGetQuery(
    { userId: userId as string },
    { skip: !userId }
  );

  const { data: userActivityData, error: userActivityError, isLoading: isUserActivityLoading } = useGetRecentActivityV1UsersActivityRecentGetQuery(
    { limit: 10 },
    { skip: !userId }
  );

  const isLoading = isUserProfileLoading || isUserActivityLoading || (!userId && !myProfile);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  if (userProfileError || userActivityError || !userId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load user profile.</Text>
        <Text style={styles.errorText}>Please check your backend connection.</Text>
      </View>
    );
  }

  // Use the fetched profile data. Fallback safely.
  const userData = userProfileData || myProfile || {} as any;
  const recentActivity = userActivityData || [];

  const renderActivityItem = ({ item }: { item: any }) => (
    <View style={styles.activityItem}>
      <Text style={styles.activityDescription}>{item.description}</Text>
      <Text style={styles.activityTime}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <SafeImage
        source={{/* require('../../assets/ui/extra/User Profile-1.png') */ }}
        style={styles.fullBackgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={DesignSystem.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          {(!routeUserId || routeUserId === myProfile?.id) && (
            <TouchableOpacity onPress={() => console.log('Edit Profile')}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <SafeImage source={{ uri: userData.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.profileImage} />
          <Text style={styles.nameText}>{userData.display_name || userData.username || 'Music Bud'}</Text>
          <Text style={styles.usernameText}>@{userData.username || 'user'}</Text>
          <Text style={styles.bioText}>{userData.bio || 'This user has no biography available.'}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statCount}>{userData.connections_count || userData.budsCount || 0}</Text>
              <Text style={styles.statLabel}>Buds</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statCount}>{userData.following_count || userData.followingCount || 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statCount}>{userData.followers_count || userData.followersCount || 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.length > 0 ? (
            <FlatList
              data={recentActivity}
              renderItem={renderActivityItem}
              keyExtractor={(item, index) => item.id || index.toString()}
              scrollEnabled={false} // Allow parent ScrollView to handle scroll
            />
          ) : (
            <Text style={styles.bioText}>No recent activity found.</Text>
          )}
        </View>
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
    paddingHorizontal: DesignSystem.spacing.md,
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
    padding: DesignSystem.spacing.md,
  },
  errorText: {
    color: DesignSystem.colors.errorRed,
    ...DesignSystem.typography.bodyLarge,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.lg,
  },
  headerTitle: {
    color: DesignSystem.colors.textPrimary,
    ...DesignSystem.typography.headlineMedium,
  },
  editButton: {
    color: DesignSystem.colors.primary,
    ...DesignSystem.typography.titleMedium,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: DesignSystem.colors.primary,
    marginBottom: 15,
  },
  nameText: {
    color: DesignSystem.colors.textPrimary,
    ...DesignSystem.typography.displaySmall,
  },
  usernameText: {
    color: DesignSystem.colors.textSecondary,
    ...DesignSystem.typography.titleMedium,
    marginBottom: DesignSystem.spacing.sm,
  },
  bioText: {
    color: DesignSystem.colors.textPrimary,
    ...DesignSystem.typography.bodyMedium,
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: DesignSystem.spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statCount: {
    color: DesignSystem.colors.textPrimary,
    ...DesignSystem.typography.headlineLarge,
  },
  statLabel: {
    color: DesignSystem.colors.textSecondary,
    ...DesignSystem.typography.labelMedium,
  },
  activitySection: {
    backgroundColor: DesignSystem.colors.surfaceContainerHighest,
    borderRadius: DesignSystem.radius.lg,
    padding: DesignSystem.spacing.md,
  },
  sectionTitle: {
    color: DesignSystem.colors.textPrimary,
    ...DesignSystem.typography.titleLarge,
    marginBottom: DesignSystem.spacing.md,
  },
  activityItem: {
    backgroundColor: DesignSystem.colors.surfaceContainer,
    borderRadius: DesignSystem.radius.md,
    padding: DesignSystem.spacing.md,
    marginBottom: DesignSystem.spacing.sm,
  },
  activityDescription: {
    color: DesignSystem.colors.textPrimary,
    ...DesignSystem.typography.bodyLarge,
    marginBottom: DesignSystem.spacing.xs,
  },
  activityTime: {
    color: DesignSystem.colors.textMuted,
    ...DesignSystem.typography.bodySmall,
    alignSelf: 'flex-end',
  },
});

export default UserProfileAltScreen;