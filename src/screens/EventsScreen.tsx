import React from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGetAllEventsV1EventsGetQuery } from '../store/api';
import { DesignSystem } from '../theme/design_system';

const EventsScreen = () => {
  const router = useRouter();
  const { data: eventsWrapper, error: eventsError, isLoading } = useGetAllEventsV1EventsGetQuery();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (eventsError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={DesignSystem.colors.errorRed} />
        <Text style={styles.errorText}>Failed to load events.</Text>
      </View>
    );
  }

  const events: any[] = eventsWrapper?.data || [];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const renderEventItem = ({ item }: { item: any }) => {
    const coverUrl = item.cover_image_url
      || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title || 'Event')}&background=1a1a2e&color=fff&size=300`;

    return (
      <TouchableOpacity
        style={styles.eventCard}
        activeOpacity={0.85}
        onPress={() => router.push(`/EventScreen/${item.id}` as any)}
      >
        <SafeImage source={{ uri: coverUrl }} style={styles.eventImage} resizeMode="cover" />
        <View style={styles.eventOverlay} />

        {/* Date Badge */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeText}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.eventBody}>
          <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.eventMeta}>
            {item.location && (
              <View style={styles.metaRow}>
                <Ionicons name="location" size={12} color={DesignSystem.colors.textMuted} />
                <Text style={styles.metaText}>{item.location}</Text>
              </View>
            )}
            {item.attendees_count != null && (
              <View style={styles.metaRow}>
                <Ionicons name="people" size={12} color={DesignSystem.colors.textMuted} />
                <Text style={styles.metaText}>{item.attendees_count} attending</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Events</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add" size={24} color={DesignSystem.colors.primary} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar" size={64} color={DesignSystem.colors.surfaceContainerHighest} />
              <Text style={styles.emptyTitle}>No events yet</Text>
              <Text style={styles.emptySubtitle}>Be the first to create one!</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DesignSystem.colors.backgroundPrimary },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: DesignSystem.colors.backgroundPrimary },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: DesignSystem.colors.backgroundPrimary, gap: 16 },
  errorText: { color: DesignSystem.colors.errorRed, fontSize: 16, fontWeight: '600' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: DesignSystem.spacing.lg, paddingTop: 12, paddingBottom: 16 },
  screenTitle: { color: DesignSystem.colors.textPrimary, ...DesignSystem.typography.headlineLarge },
  addBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: DesignSystem.colors.primaryContainer, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: DesignSystem.colors.primary },
  list: { paddingHorizontal: DesignSystem.spacing.md, paddingBottom: 40 },
  eventCard: {
    width: '100%',
    height: 200,
    borderRadius: DesignSystem.radius.lg,
    overflow: 'hidden',
    marginBottom: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.surfaceContainer,
  },
  eventImage: { ...StyleSheet.absoluteFillObject },
  eventOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: DesignSystem.colors.overlay },
  dateBadge: {
    position: 'absolute', top: 14, left: 14,
    backgroundColor: DesignSystem.colors.primary,
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4,
  },
  dateBadgeText: { color: DesignSystem.colors.onPrimary, ...DesignSystem.typography.labelSmall, fontWeight: 'bold' },
  eventBody: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: DesignSystem.spacing.md, backgroundColor: 'rgba(0,0,0,0.6)' },
  eventTitle: { color: DesignSystem.colors.textPrimary, ...DesignSystem.typography.titleMedium, marginBottom: 8 },
  eventMeta: { flexDirection: 'row', gap: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: DesignSystem.colors.textSecondary, ...DesignSystem.typography.labelMedium },
  emptyContainer: { marginTop: 80, alignItems: 'center', gap: 12 },
  emptyTitle: { color: DesignSystem.colors.textPrimary, ...DesignSystem.typography.titleLarge },
  emptySubtitle: { color: DesignSystem.colors.textMuted, fontSize: 15 },
});

export default EventsScreen;