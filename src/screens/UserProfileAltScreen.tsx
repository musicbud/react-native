import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGetUserProfileQuery, useGetUserActivityQuery, useGetMyProfileQuery } from '../store/api';

const { width, height } = Dimensions.get('window');

const UserProfileAltScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const routeUserId = params.id as string | undefined;

  // If no ID is passed, assume we are viewing "My" profile but fallback gracefully
  const { data: myProfile } = useGetMyProfileQuery(undefined, { skip: !!routeUserId });
  const userId = routeUserId || myProfile?.id;

  const { data: userProfileData, error: userProfileError, isLoading: isUserProfileLoading } = useGetUserProfileQuery(userId as string, {
    skip: !userId, // Skip if we don't know the ID yet
  });

  const { data: userActivityData, error: userActivityError, isLoading: isUserActivityLoading } = useGetUserActivityQuery({ userId: userId as string }, {
    skip: !userId,
  });

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
      <Image
        source={{/* require('../../assets/ui/extra/User Profile-1.png') */ }}
        style={styles.fullBackgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
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
          <Image source={{ uri: userData.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.profileImage} />
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
    marginBottom: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    color: '#1E90FF',
    fontSize: 16,
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
    borderColor: '#1E90FF',
    marginBottom: 15,
  },
  nameText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  usernameText: {
    color: '#CCC',
    fontSize: 16,
    marginBottom: 10,
  },
  bioText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 20,
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
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#CCC',
    fontSize: 14,
  },
  activitySection: {
    backgroundColor: 'rgba(30,30,30,0.8)',
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  activityItem: {
    backgroundColor: 'rgba(50,50,50,0.5)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  activityDescription: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  activityTime: {
    color: '#888',
    fontSize: 12,
    alignSelf: 'flex-end',
  },
});

export default UserProfileAltScreen;