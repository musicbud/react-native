import React, { useState } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, ActivityIndicator, SafeAreaView, Modal, TextInput, Alert, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGetAllStoriesV1StoriesGetQuery, useCreateStoryV1StoriesPostMutation, useGetCurrentUserInfoV1AuthMeGetQuery, useDeleteStoryV1StoriesStoryIdDeleteMutation } from '../store/api';
import { DesignSystem } from '../theme/design_system';

const StoriesScreen = () => {
  const router = useRouter();
  const { data: storiesWrapper, error: storiesError, isLoading, refetch } = useGetAllStoriesV1StoriesGetQuery();
  const { data: myProfileWrapper } = useGetCurrentUserInfoV1AuthMeGetQuery();
  const [createStory, { isLoading: isCreating }] = useCreateStoryV1StoriesPostMutation();
  const [deleteStory] = useDeleteStoryV1StoriesStoryIdDeleteMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');

  const currentUser = (myProfileWrapper as any)?.data || myProfileWrapper;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={DesignSystem.colors.primary} />
      </View>
    );
  }

  if (storiesError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={DesignSystem.colors.errorRed} />
        <Text style={styles.errorText}>Failed to load stories.</Text>
      </View>
    );
  }

  const stories: any[] = storiesWrapper?.data || [];

  const handleCreateStory = async () => {
    if (!mediaUrl) {
      Alert.alert('Validation Error', 'Image URL is required.');
      return;
    }

    try {
      await createStory({
        storyCreate: {
          user_id: currentUser?.id || currentUser?.user_id,
          media_url: mediaUrl,
          media_type: 'image',
          caption,
          duration_seconds: 15
        }
      }).unwrap();
      setModalVisible(false);
      setMediaUrl('');
      setCaption('');
      refetch();
    } catch {
      Alert.alert('Error', 'Failed to create story.');
    }
  };

  const handleDeleteStory = (storyId: string) => {
    Alert.alert('Delete Story', 'Are you sure you want to delete this story?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteStory({ storyId }).unwrap();
            refetch();
          } catch {
            Alert.alert('Error', 'Failed to delete story.');
          }
        }
      }
    ]);
  };

  const renderStoryItem = ({ item }: { item: any }) => {
    const avatarUrl =
      item.creator?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(item.creator?.username || 'S')}&background=1E90FF&color=fff`;

    const isOwner = currentUser?.id === item.user_id || currentUser?.user_id === item.user_id;

    return (
      <View style={styles.storyContainer}>
        <TouchableOpacity
          style={styles.storyItem}
          activeOpacity={0.8}
          onPress={() => router.push(`/StoryView/${item.id}` as any)}
          onLongPress={() => isOwner && handleDeleteStory(item.id)}
        >
          <LinearGradient
            colors={item.is_live ? [DesignSystem.colors.errorRed, DesignSystem.colors.warningOrange] : [DesignSystem.colors.primary, DesignSystem.colors.primaryVariant]}
            style={styles.storyRing}
          >
            <View style={styles.storyInner}>
              <SafeImage source={{ uri: avatarUrl }} style={styles.storyAvatar} />
            </View>
          </LinearGradient>

          {item.is_live && (
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          )}

          <Text style={styles.storyName} numberOfLines={1}>
            {item.creator?.username || 'Unknown'}
          </Text>
        </TouchableOpacity>

        {isOwner && (
          <TouchableOpacity style={styles.deleteBadgeSmall} onPress={() => handleDeleteStory(item.id)}>
            <Ionicons name="close-circle" size={20} color={DesignSystem.colors.errorRed} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Stories</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={22} color={DesignSystem.colors.primary} />
          </TouchableOpacity>
        </View>

        {stories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="camera" size={64} color={DesignSystem.colors.surfaceContainerHighest} />
            <Text style={styles.emptyTitle}>No stories yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to share your moment!</Text>
            <TouchableOpacity style={styles.createStoryBtn} onPress={() => setModalVisible(true)}>
              <Ionicons name="add-circle" size={18} color={DesignSystem.colors.onPrimary} />
              <Text style={styles.createStoryText}>Create Story</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={stories}
            renderItem={renderStoryItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.storiesGrid}
            showsVerticalScrollIndicator={false}
          />
        )}

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create Story</Text>

              <ScrollView>
                <TextInput
                  style={styles.input}
                  placeholder="Image URL"
                  placeholderTextColor={DesignSystem.colors.textMuted}
                  value={mediaUrl}
                  onChangeText={setMediaUrl}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Caption (optional)"
                  placeholderTextColor={DesignSystem.colors.textMuted}
                  value={caption}
                  onChangeText={setCaption}
                />
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={handleCreateStory} disabled={isCreating}>
                  {isCreating ? (
                    <ActivityIndicator size="small" color={DesignSystem.colors.onPrimary} />
                  ) : (
                    <Text style={styles.submitBtnText}>Share</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DesignSystem.colors.backgroundPrimary },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: DesignSystem.colors.backgroundPrimary },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: DesignSystem.colors.backgroundPrimary, gap: 16 },
  errorText: { color: DesignSystem.colors.errorRed, fontSize: 16, fontWeight: '600' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  screenTitle: { color: DesignSystem.colors.textPrimary, fontSize: 28, fontWeight: '800' },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: DesignSystem.colors.primaryContainer, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: DesignSystem.colors.primary },
  storiesGrid: { padding: 12 },
  storyContainer: { flex: 1, alignItems: 'center', margin: 8, maxWidth: '30%', position: 'relative' },
  storyItem: { alignItems: 'center' },
  storyRing: { width: 80, height: 80, borderRadius: 40, padding: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  storyInner: { width: 72, height: 72, borderRadius: 36, backgroundColor: DesignSystem.colors.surfaceContainer, overflow: 'hidden' },
  storyAvatar: { width: '100%', height: '100%' },
  liveBadge: { position: 'absolute', bottom: 22, backgroundColor: DesignSystem.colors.errorRed, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  liveBadgeText: { color: DesignSystem.colors.onErrorContainer, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  storyName: { color: DesignSystem.colors.textMuted, fontSize: 12, textAlign: 'center', fontWeight: '500' },
  deleteBadgeSmall: { position: 'absolute', top: -5, right: -5, backgroundColor: DesignSystem.colors.surfaceContainer, borderRadius: 10 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14 },
  emptyTitle: { color: DesignSystem.colors.textPrimary, fontSize: 22, fontWeight: '700' },
  emptySubtitle: { color: DesignSystem.colors.textSecondary, fontSize: 15 },
  createStoryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: DesignSystem.colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, marginTop: 8 },
  createStoryText: { color: DesignSystem.colors.onPrimary, fontWeight: '700', fontSize: 15 },

  modalOverlay: { flex: 1, backgroundColor: DesignSystem.colors.overlay, justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: DesignSystem.colors.surfaceContainer, borderRadius: 16, padding: 20, maxHeight: '80%' },
  modalTitle: { color: DesignSystem.colors.textPrimary, fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: DesignSystem.colors.surfaceContainerHigh, color: DesignSystem.colors.textPrimary, padding: 12, borderRadius: 8, marginBottom: 12 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, gap: 12 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  cancelBtnText: { color: DesignSystem.colors.textSecondary, fontWeight: 'bold' },
  submitBtn: { backgroundColor: DesignSystem.colors.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  submitBtnText: { color: DesignSystem.colors.onPrimary, fontWeight: 'bold' }
});

export default StoriesScreen;