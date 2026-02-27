import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetUserProfileQuery, User } from '../store/api';
import { LinearGradient } from 'expo-linear-gradient';

const UserProfileScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: userProfileData, error: userProfileError, isLoading: isUserProfileLoading } = useGetUserProfileQuery(id as string);
  const [activeTab, setActiveTab] = useState('About'); // 'About', 'Interests'

  if (isUserProfileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (userProfileError) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>Unable to load user profile.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const user: User = userProfileData || {
    id: 'unknown',
    username: 'unknown',
    email: '',
    display_name: 'Unknown User',
    bio: 'No bio available.',
    avatar_url: 'https://ui-avatars.com/api/?name=Music+Bud\&background=random',
    location: 'Unknown',
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['rgba(30,30,30,0.9)', '#121212']}
        style={styles.headerGradient}
      >
        <Image
          source={{ uri: user.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }}
          style={styles.fullBackgroundImage}
          blurRadius={10}
        />
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.profileHeader}>
            <Image source={{ uri: user.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.profileImage} />
            <Text style={styles.nameText}>{user.display_name || user.username}</Text>
            <Text style={styles.usernameText}>@{user.username}</Text>
            {user.location && (
              <View style={styles.locationContainer}>
                <Text style={styles.locationText}>📍 {user.location}</Text>
              </View>
            )}

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Connect</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'About' && styles.activeTab]} onPress={() => setActiveTab('About')}>
            <Text style={[styles.tabButtonText, activeTab === 'About' && styles.activeTabText]}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'Interests' && styles.activeTab]} onPress={() => setActiveTab('Interests')}>
            <Text style={[styles.tabButtonText, activeTab === 'Interests' && styles.activeTabText]}>Interests</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'About' && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Bio</Text>
            <Text style={styles.bioText}>{user.bio || 'No bio available.'}</Text>

            <Text style={styles.sectionTitle}>Stats</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Playlists</Text>
              </View>
              <View style={styles.dividerVertical} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>85%</Text>
                <Text style={styles.statLabel}>Match</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'Interests' && (
          <View style={styles.sectionContent}>
            <Text style={styles.emptyText}>No interests to show yet.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerGradient: {
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  fullBackgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  overlay: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
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
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#1E90FF',
    marginBottom: 15,
  },
  nameText: {
    color: 'white',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  usernameText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    marginBottom: 8,
  },
  locationContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  locationText: {
    color: '#DDD',
    fontSize: 14,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  secondaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tabButton: {
    paddingVertical: 12,
    marginRight: 30,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#1E90FF',
  },
  tabButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  sectionContent: {
    minHeight: 200,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  bioText: {
    color: '#CCC',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  dividerVertical: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  }
});

export default UserProfileScreen;