import React, { useState } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput, StatusBar, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm, Controller } from 'react-hook-form';
import {
  useGetCurrentUserInfoV1AuthMeGetQuery,
  useUpdateUserProfileV1UsersProfilePutMutation,
  useGetMyPlaylistsV1PlaylistsPlaylistsMeGetQuery,
  useCreatePlaylistV1LibraryPlaylistsPostMutation
} from '../store/api';
import { LinearGradient } from 'expo-linear-gradient';
import { DesignSystem } from '../theme/design_system';
import { ModernButton } from '../components/common/ModernButton';
import { SectionHeader } from '../components/common/SectionHeader';

interface ProfileFormValues {
  display_name: string;
  bio: string;
  location: string;
  age?: number;
  gender?: string;
}

const ProfileScreen = () => {
  const router = useRouter();
  const { data: userProfileWrapper, error: profileError, isLoading: isProfileLoading } = useGetCurrentUserInfoV1AuthMeGetQuery();
  const [updateMyProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileV1UsersProfilePutMutation();

  const { data: playlistsWrapper, isLoading: isPlaylistsLoading } = useGetMyPlaylistsV1PlaylistsPlaylistsMeGetQuery();
  const playlistsData = playlistsWrapper?.data;
  const [createPlaylist, { isLoading: isCreatingPlaylist }] = useCreatePlaylistV1LibraryPlaylistsPostMutation();

  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const { control, handleSubmit, reset } = useForm<ProfileFormValues>({
    defaultValues: {
      display_name: '',
      bio: '',
      location: '',
      age: undefined,
      gender: '',
    }
  });

  const [isPlaylistModalVisible, setPlaylistModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  if (isProfileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={DesignSystem.colors.primaryRed} />
      </View>
    );
  }

  if (profileError) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>Unable to load profile.</Text>
        <ModernButton text="Go to Login" onPressed={() => router.replace('/LoginScreen')} />
      </View>
    );
  }

  const user = userProfileWrapper?.data || {
    id: 'guest',
    username: 'guest_user',
    display_name: 'Guest User',
    email: '',
    bio: 'No bio available.',
    avatar_url: 'https://ui-avatars.com/api/?name=Music+Bud\&background=random',
    location: 'Unknown',
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      router.replace('/LoginScreen');
    } catch (e) {
      console.error('Failed to log out:', e);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleSaveProfile = async (data: ProfileFormValues) => {
    try {
      await updateMyProfile({
        userProfileUpdate: data as any
      }).unwrap();
      Alert.alert('Success', 'Profile updated successfully!');
      setEditModalVisible(false);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', error?.data?.message || 'Failed to update profile.');
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert('Validation Error', 'Playlist name cannot be empty.');
      return;
    }
    try {
      await createPlaylist({
        playlistData: {
          name: newPlaylistName,
          description: newPlaylistDescription,
        }
      }).unwrap();
      setPlaylistModalVisible(false);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
    } catch (error: any) {
      console.error('Failed to create playlist:', error);
      Alert.alert('Error', error?.data?.message || 'Failed to create playlist.');
    }
  };

  const renderPlaylistItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.playlistCard}>
      <SafeImage
        source={{ uri: item.cover_url || 'https://ui-avatars.com/api/?name=Music+Bud&background=random' }}
        style={styles.playlistImage}
      />
      <Text style={styles.playlistTitle} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  const profileActions = [
    { id: '1', text: 'My Account', icon: 'person', screen: '/MyAccountScreen' },
    { id: '2', text: 'Discovery Settings', icon: 'search', screen: '/DiscoverySettingsScreen' },
    { id: '3', text: 'Connect Services', icon: 'link', screen: '/ConnectServicesScreen' },
    { id: '4', text: 'My Music Map', icon: 'map', screen: '/MapScreen' },
    { id: '5', text: 'Help & Support', icon: 'chatbubbles', screen: '/OnlineSupportScreen' },
    { id: '6', text: 'Log Out', icon: 'log-out', action: handleLogout, danger: true },
  ];

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[DesignSystem.colors.surfaceContainerHighest, DesignSystem.colors.backgroundPrimary]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={DesignSystem.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Profile</Text>
          <TouchableOpacity onPress={() => {
            reset({
              display_name: user?.display_name || user?.username || '',
              bio: user?.bio || '',
              location: user?.location || '',
              age: user?.age || undefined,
              gender: user?.gender || '',
            });
            setEditModalVisible(true);
          }} style={styles.iconButton}>
            <Ionicons name="pencil" size={20} color={DesignSystem.colors.onSurface} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSummaryContainer}>
          <View style={styles.avatarContainer}>
            <SafeImage source={{ uri: user.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.avatar} />
            <View style={styles.onlineBadge} />
          </View>
          <Text style={styles.userName}>{user.display_name || user.username}</Text>
          <Text style={styles.userHandle}>@{user.username}</Text>
          {user.location && <Text style={styles.userLocation}>📍 {user.location}</Text>}

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.connections_count || 0}</Text>
              <Text style={styles.statLabel}>BuDs</Text>
            </View>
            <View style={styles.dividerVertical} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.following_count || user.followers_count || 0}</Text>
              <Text style={styles.statLabel}>Follow</Text>
            </View>
            <View style={styles.dividerVertical} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.compatibility_score ? `${user.compatibility_score}%` : 'N/A'}</Text>
              <Text style={styles.statLabel}>Match</Text>
            </View>
          </View>

          {user.bio && (
            <View style={styles.bioContainer}>
              <Text style={styles.userBio}>{user.bio}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Playlists Section */}
      <View style={styles.section}>
        <SectionHeader title="My Playlists" style={{ paddingHorizontal: 0 }} />
        {isPlaylistsLoading ? (
          <ActivityIndicator color={DesignSystem.colors.primaryRed} />
        ) : (
          <FlatList
            data={playlistsData || []}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={renderPlaylistItem}
            ListFooterComponent={
              <TouchableOpacity
                style={styles.createPlaylistCard}
                onPress={() => setPlaylistModalVisible(true)}
              >
                <Text style={styles.createPlaylistIcon}>+</Text>
                <Text style={styles.createPlaylistText}>New Playlist</Text>
              </TouchableOpacity>
            }
            contentContainerStyle={styles.playlistsListContent}
          />
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.actionsContainer}>
          {profileActions.map((action, index) => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.actionButton,
                index === profileActions.length - 1 && styles.lastActionButton
              ]}
              onPress={() => action.action ? action.action() : router.push(action.screen as any)}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name={action.icon as any} size={18} color={DesignSystem.colors.onSurface} />
              </View>
              <Text style={[styles.actionButtonText, action.danger && styles.dangerText]}>{action.text}</Text>
              <Text style={styles.chevronIcon}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Controller
              control={control}
              name="display_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.modalInput}
                  placeholder="Display Name"
                  placeholderTextColor={DesignSystem.colors.textMuted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="age"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.modalInput}
                  placeholder="Age"
                  keyboardType="numeric"
                  placeholderTextColor={DesignSystem.colors.textMuted}
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val ? parseInt(val) : undefined)}
                  value={value ? String(value) : ''}
                />
              )}
            />

            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.modalInput}
                  placeholder="Gender"
                  placeholderTextColor={DesignSystem.colors.textMuted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.modalInput}
                  placeholder="Location"
                  placeholderTextColor={DesignSystem.colors.textMuted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.modalInput, styles.bioInput]}
                  placeholder="Bio"
                  placeholderTextColor={DesignSystem.colors.textMuted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  textAlignVertical="top"
                />
              )}
            />

            <View style={styles.modalButtonContainer}>
              <ModernButton
                text="Cancel"
                variant="secondary"
                onPressed={() => setEditModalVisible(false)}
                style={{ flex: 1, marginRight: DesignSystem.spacing.xs }}
              />
              <ModernButton
                text="Save"
                isLoading={isUpdatingProfile}
                onPressed={handleSubmit(handleSaveProfile)}
                style={{ flex: 1, marginLeft: DesignSystem.spacing.xs }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Playlist Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPlaylistModalVisible}
        onRequestClose={() => setPlaylistModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Create Playlist</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Playlist Name"
              placeholderTextColor={DesignSystem.colors.textMuted}
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
            />
            <TextInput
              style={[styles.modalInput, styles.bioInput]}
              placeholder="Description (Optional)"
              placeholderTextColor={DesignSystem.colors.textMuted}
              value={newPlaylistDescription}
              onChangeText={setNewPlaylistDescription}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.modalButtonContainer}>
              <ModernButton
                text="Cancel"
                variant="secondary"
                onPressed={() => setPlaylistModalVisible(false)}
                style={{ flex: 1, marginRight: DesignSystem.spacing.xs }}
              />
              <ModernButton
                text="Create"
                isLoading={isCreatingPlaylist}
                onPressed={handleCreatePlaylist}
                style={{ flex: 1, marginLeft: DesignSystem.spacing.xs }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
    marginTop: 60,
    paddingHorizontal: DesignSystem.spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: DesignSystem.colors.surfaceContainer,
  },
  backButtonText: {
    color: DesignSystem.colors.onSurface,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -4,
  },
  screenTitle: {
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.titleLarge,
  },
  editIcon: {
    color: DesignSystem.colors.onSurface,
    fontSize: 20,
  },
  profileSummaryContainer: {
    alignItems: 'center',
    paddingHorizontal: DesignSystem.spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: DesignSystem.spacing.sm,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: DesignSystem.colors.primary,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: DesignSystem.colors.successGreen,
    borderWidth: 3,
    borderColor: DesignSystem.colors.backgroundPrimary,
  },
  userName: {
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.headlineLarge,
    marginBottom: 4,
  },
  userHandle: {
    color: DesignSystem.colors.textMuted,
    ...DesignSystem.typography.bodyMedium,
    marginBottom: DesignSystem.spacing.xs,
  },
  userLocation: {
    color: DesignSystem.colors.textSecondary,
    ...DesignSystem.typography.bodyMedium,
    marginBottom: DesignSystem.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: DesignSystem.spacing.md,
    paddingHorizontal: DesignSystem.spacing.md,
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
  bioContainer: {
    backgroundColor: DesignSystem.colors.surfaceContainer,
    padding: DesignSystem.spacing.md,
    borderRadius: DesignSystem.radius.lg,
    width: '100%',
  },
  userBio: {
    color: DesignSystem.colors.textSecondary,
    ...DesignSystem.typography.bodyMedium,
    textAlign: 'center',
  },
  section: {
    padding: DesignSystem.spacing.md,
  },
  playlistsListContent: {
    gap: DesignSystem.spacing.sm,
  },
  playlistCard: {
    width: 140,
    marginRight: DesignSystem.spacing.sm,
  },
  playlistImage: {
    width: 140,
    height: 140,
    borderRadius: DesignSystem.radius.sm,
    marginBottom: DesignSystem.spacing.xs,
    backgroundColor: DesignSystem.colors.surfaceContainerHighest,
  },
  playlistTitle: {
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.titleSmall,
  },
  createPlaylistCard: {
    width: 140,
    height: 140,
    borderRadius: DesignSystem.radius.sm,
    backgroundColor: DesignSystem.colors.primaryContainer,
    borderWidth: 1,
    borderColor: DesignSystem.colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createPlaylistIcon: {
    fontSize: 40,
    color: DesignSystem.colors.primaryRed,
    marginBottom: 5,
  },
  createPlaylistText: {
    color: DesignSystem.colors.primaryRed,
    ...DesignSystem.typography.titleSmall,
  },
  actionsContainer: {
    backgroundColor: DesignSystem.colors.surfaceContainer,
    borderRadius: DesignSystem.radius.lg,
    overflow: 'hidden',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DesignSystem.spacing.md,
    paddingHorizontal: DesignSystem.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.borderColor,
  },
  lastActionButton: {
    borderBottomWidth: 0,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DesignSystem.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: DesignSystem.spacing.md,
  },
  actionButtonIcon: {
    fontSize: 18,
    color: DesignSystem.colors.onSurface,
  },
  actionButtonText: {
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.titleMedium,
    flex: 1,
  },
  dangerText: {
    color: DesignSystem.colors.errorRed,
  },
  chevronIcon: {
    color: DesignSystem.colors.textMuted,
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: DesignSystem.colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: DesignSystem.colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DesignSystem.spacing.md,
  },
  errorText: {
    color: DesignSystem.colors.errorRed,
    ...DesignSystem.typography.bodyLarge,
    marginBottom: DesignSystem.spacing.md,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DesignSystem.colors.overlay,
  },
  modalView: {
    width: '85%',
    backgroundColor: DesignSystem.colors.surfaceContainer,
    borderRadius: DesignSystem.radius.xl,
    padding: DesignSystem.spacing.lg,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    ...DesignSystem.typography.titleLarge,
    color: DesignSystem.colors.onSurface,
    marginBottom: DesignSystem.spacing.md,
  },
  modalInput: {
    width: '100%',
    minHeight: 50,
    backgroundColor: DesignSystem.colors.surfaceContainerHighest,
    borderRadius: DesignSystem.radius.md,
    paddingHorizontal: DesignSystem.spacing.md,
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.bodyMedium,
    marginBottom: DesignSystem.spacing.sm,
  },
  bioInput: {
    height: 100,
    paddingTop: DesignSystem.spacing.md,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: DesignSystem.spacing.xs,
  },
});

export default ProfileScreen;