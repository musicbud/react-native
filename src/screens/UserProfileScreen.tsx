import React, { useState } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGetUserProfileByIdV1UsersProfileUserIdGetQuery } from '../store/api';
import { LinearGradient } from 'expo-linear-gradient';
import { DesignSystem } from '../theme/design_system';
import { ModernButton } from '../components/common/ModernButton';

const UserProfileScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: userProfileWrapper, error: userProfileError, isLoading: isUserProfileLoading } = useGetUserProfileByIdV1UsersProfileUserIdGetQuery({ userId: id as string });
  const [activeTab, setActiveTab] = useState('About'); // 'About', 'Interests'

  if (isUserProfileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={DesignSystem.colors.primaryRed} />
      </View>
    );
  }

  if (userProfileError) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>Unable to load user profile.</Text>
        <ModernButton text="Go Back" onPressed={() => router.back()} variant="secondary" />
      </View>
    );
  }

  const user: any = (userProfileWrapper as any)?.data || userProfileWrapper || {
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
        colors={[DesignSystem.colors.surfaceContainerHighest, DesignSystem.colors.backgroundPrimary]}
        style={styles.headerGradient}
      >
        <SafeImage
          source={{ uri: user.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }}
          style={styles.fullBackgroundImage}
          blurRadius={10}
        />
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <Ionicons name="chevron-back" size={22} color={DesignSystem.colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.profileHeader}>
            <SafeImage source={{ uri: user.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.profileImage} />
            <Text style={styles.nameText}>{user.display_name || user.username}</Text>
            <Text style={styles.usernameText}>@{user.username}</Text>
            {user.location && (
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={14} color={DesignSystem.colors.textMuted} />
                <Text style={styles.locationText}>{user.location}</Text>
              </View>
            )}

            <View style={styles.actionButtonsRow}>
              <ModernButton text="Connect" onPressed={() => console.log('Connect')} />
              <ModernButton text="Message" variant="outline" onPressed={() => console.log('Message')} />
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
    backgroundColor: DesignSystem.colors.backgroundPrimary,
  },
  headerGradient: {
    paddingBottom: DesignSystem.spacing.lg,
    borderBottomLeftRadius: DesignSystem.spacing.lg,
    borderBottomRightRadius: DesignSystem.spacing.lg,
    overflow: 'hidden',
  },
  fullBackgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  overlay: {
    paddingTop: 60,
    paddingHorizontal: DesignSystem.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerTitle: {
    color: DesignSystem.colors.onSurface,
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DesignSystem.colors.backgroundPrimary,
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
    marginBottom: DesignSystem.spacing.md,
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
    borderColor: DesignSystem.colors.primary,
    marginBottom: DesignSystem.spacing.sm,
  },
  nameText: {
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.headlineLarge,
    marginBottom: 4,
  },
  usernameText: {
    color: DesignSystem.colors.textMuted,
    ...DesignSystem.typography.bodyMedium,
    marginBottom: DesignSystem.spacing.xs,
  },
  locationContainer: {
    backgroundColor: DesignSystem.colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: DesignSystem.radius.sm,
    marginBottom: DesignSystem.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: DesignSystem.colors.textMuted,
    ...DesignSystem.typography.bodySmall,
    marginLeft: 4,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: DesignSystem.spacing.sm,
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
    padding: DesignSystem.spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: DesignSystem.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.borderColor,
  },
  tabButton: {
    paddingVertical: 12,
    marginRight: 30,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: DesignSystem.colors.primaryRed,
  },
  tabButtonText: {
    color: DesignSystem.colors.textMuted,
    ...DesignSystem.typography.titleMedium,
  },
  activeTabText: {
    color: DesignSystem.colors.onSurface,
  },
  sectionContent: {
    minHeight: 200,
  },
  sectionTitle: {
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.titleLarge,
    marginBottom: 10,
    marginTop: 10,
  },
  bioText: {
    color: DesignSystem.colors.textSecondary,
    ...DesignSystem.typography.bodyMedium,
    marginBottom: DesignSystem.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: DesignSystem.colors.surfaceContainer,
    borderRadius: DesignSystem.radius.lg,
    padding: DesignSystem.spacing.md,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.headlineMedium,
  },
  statLabel: {
    color: DesignSystem.colors.textMuted,
    ...DesignSystem.typography.labelSmall,
    marginTop: 4,
  },
  dividerVertical: {
    width: 1,
    height: '80%',
    backgroundColor: DesignSystem.colors.borderColor,
  },
  emptyText: {
    color: DesignSystem.colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  }
});

export default UserProfileScreen;