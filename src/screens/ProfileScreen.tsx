import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput, StatusBar, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetMyProfileQuery, useUpdateMyProfileMutation, useGetUserPlaylistsQuery, useCreatePlaylistMutation, User, Playlist } from '../store/api';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = () => {
  const router = useRouter();
  const { data: userProfileData, error: profileError, isLoading: isProfileLoading } = useGetMyProfileQuery();
  const [updateMyProfile, { isLoading: isUpdatingProfile }] = useUpdateMyProfileMutation();

  const { data: playlistsData, isLoading: isPlaylistsLoading } = useGetUserPlaylistsQuery();
  const [createPlaylist, { isLoading: isCreatingPlaylist }] = useCreatePlaylistMutation();

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedDisplayName, setEditedDisplayName] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [editedLocation, setEditedLocation] = useState('');

  const [isPlaylistModalVisible, setPlaylistModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  if (isProfileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (profileError) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>Unable to load profile.</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.replace('/LoginScreen')}>
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const user: User = userProfileData || {
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

  const handleSaveProfile = async () => {
    try {
      await updateMyProfile({
        display_name: editedDisplayName,
        bio: editedBio,
        location: editedLocation,
      } as Partial<User>).unwrap();
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
        name: newPlaylistName,
        description: newPlaylistDescription,
      }).unwrap();
      setPlaylistModalVisible(false);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
    } catch (error: any) {
      console.error('Failed to create playlist:', error);
      Alert.alert('Error', error?.data?.message || 'Failed to create playlist.');
    }
  };

  const renderPlaylistItem = ({ item }: { item: Playlist }) => (
    <TouchableOpacity style={styles.playlistCard}>
      <Image
        source={{ uri: item.cover_url || 'https://ui-avatars.com/api/?name=Music+Bud&background=random' }}
        style={styles.playlistImage}
      />
      <Text style={styles.playlistTitle} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  const profileActions = [
    { id: '1', text: 'My Account', icon: '⚙️', screen: '/MyAccountScreen' },
    { id: '2', text: 'Discovery Settings', icon: '🔍', screen: '/DiscoverySettingsScreen' },
    { id: '3', text: 'Help & Support', icon: '💬', screen: '/OnlineSupportScreen' },
    { id: '4', text: 'Log Out', icon: '🚪', action: handleLogout, danger: true },
  ];

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['rgba(30,30,30,0.8)', '#121212']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Profile</Text>
          <TouchableOpacity onPress={() => {
            setEditedDisplayName(user.display_name || user.username);
            setEditedBio(user.bio || '');
            setEditedLocation(user.location || '');
            setEditModalVisible(true);
          }} style={styles.iconButton}>
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileSummaryContainer}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.avatar} />
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
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Playlists</Text>
        </View>
        {isPlaylistsLoading ? (
          <ActivityIndicator color="#1E90FF" />
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
                <Text style={styles.actionButtonIcon}>{action.icon}</Text>
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

            <TextInput
              style={styles.modalInput}
              placeholder="Display Name"
              placeholderTextColor="#888"
              value={editedDisplayName}
              onChangeText={setEditedDisplayName}
            />
            <TextInput
              style={[styles.modalInput, styles.bioInput]}
              placeholder="Bio"
              placeholderTextColor="#888"
              value={editedBio}
              onChangeText={setEditedBio}
              multiline
              textAlignVertical="top"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Location"
              placeholderTextColor="#888"
              value={editedLocation}
              onChangeText={setEditedLocation}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonClose]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonSave]}
                onPress={handleSaveProfile}
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.textStyle}>Save</Text>
                )}
              </TouchableOpacity>
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
              placeholderTextColor="#888"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
            />
            <TextInput
              style={[styles.modalInput, styles.bioInput]}
              placeholder="Description (Optional)"
              placeholderTextColor="#888"
              value={newPlaylistDescription}
              onChangeText={setNewPlaylistDescription}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonClose]}
                onPress={() => setPlaylistModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonSave]}
                onPress={handleCreatePlaylist}
                disabled={isCreatingPlaylist}
              >
                {isCreatingPlaylist ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.textStyle}>Create</Text>
                )}
              </TouchableOpacity>
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
    backgroundColor: '#121212',
  },
  headerGradient: {
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 60,
    paddingHorizontal: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -4,
  },
  screenTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  editIcon: {
    color: 'white',
    fontSize: 20,
  },
  profileSummaryContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(30, 144, 255, 0.3)',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00FF00',
    borderWidth: 3,
    borderColor: '#121212',
  },
  userName: {
    color: 'white',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  userHandle: {
    color: '#888',
    fontSize: 16,
    marginBottom: 8,
  },
  userLocation: {
    color: '#BBB',
    fontSize: 14,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 20,
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
  bioContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 16,
    width: '100%',
  },
  userBio: {
    color: '#DDD',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playlistsListContent: {
    paddingRight: 20,
    gap: 15,
  },
  playlistCard: {
    width: 140,
    marginRight: 15,
  },
  playlistImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  playlistTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  createPlaylistCard: {
    width: 140,
    height: 140,
    borderRadius: 8,
    backgroundColor: 'rgba(30, 144, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(30, 144, 255, 0.3)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createPlaylistIcon: {
    fontSize: 40,
    color: '#1E90FF',
    marginBottom: 5,
  },
  createPlaylistText: {
    color: '#1E90FF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    backgroundColor: 'rgba(30,30,30,0.5)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  lastActionButton: {
    borderBottomWidth: 0,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(30, 144, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionButtonIcon: {
    fontSize: 18,
    color: '#1E90FF',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  dangerText: {
    color: '#FF6B6B',
  },
  chevronIcon: {
    color: '#666',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 15,
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
  loginButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalView: {
    width: '85%',
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 25,
  },
  modalInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 15,
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
  },
  bioInput: {
    height: 100,
    paddingTop: 15,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    gap: 15,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#333',
  },
  buttonSave: {
    backgroundColor: '#1E90FF',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;