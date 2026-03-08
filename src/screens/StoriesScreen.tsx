import React from 'react';
import { SafeImage } from '../components/common/SafeImage';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  FlatList, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGetAllStoriesV1StoriesGetQuery } from '../store/api';
import { DesignSystem } from '../theme/design_system';

const StoriesScreen = () => {
  const router = useRouter();
  const { data: storiesWrapper, error: storiesError, isLoading } = useGetAllStoriesV1StoriesGetQuery();

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

  const renderStoryItem = ({ item }: { item: any }) => {
    const avatarUrl =
      item.creator?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(item.creator?.username || 'S')}&background=1E90FF&color=fff`;

    return (
      <TouchableOpacity
        style={styles.storyItem}
        activeOpacity={0.8}
        onPress={() => router.push(`/StoryView/${item.id}` as any)}
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
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Stories</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add" size={22} color={DesignSystem.colors.primary} />
          </TouchableOpacity>
        </View>

        {stories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="camera" size={64} color={DesignSystem.colors.surfaceContainerHighest} />
            <Text style={styles.emptyTitle}>No stories yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to share your moment!</Text>
            <TouchableOpacity style={styles.createStoryBtn}>
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
  storyItem: { flex: 1, alignItems: 'center', margin: 8, maxWidth: '30%' },
  storyRing: { width: 80, height: 80, borderRadius: 40, padding: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  storyInner: { width: 72, height: 72, borderRadius: 36, backgroundColor: DesignSystem.colors.surfaceContainer, overflow: 'hidden' },
  storyAvatar: { width: '100%', height: '100%' },
  liveBadge: { position: 'absolute', bottom: 22, backgroundColor: DesignSystem.colors.errorRed, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  liveBadgeText: { color: DesignSystem.colors.onErrorContainer, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  storyName: { color: DesignSystem.colors.textMuted, fontSize: 12, textAlign: 'center', fontWeight: '500' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14 },
  emptyTitle: { color: DesignSystem.colors.textPrimary, fontSize: 22, fontWeight: '700' },
  emptySubtitle: { color: DesignSystem.colors.textSecondary, fontSize: 15 },
  createStoryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: DesignSystem.colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, marginTop: 8 },
  createStoryText: { color: DesignSystem.colors.onPrimary, fontWeight: '700', fontSize: 15 },
});

export default StoriesScreen;