import React, { useState } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, SafeAreaView, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGetAllEventsV1EventsGetQuery, useCreateEventV1EventsPostMutation, useGetCurrentUserInfoV1AuthMeGetQuery, useDeleteEventV1EventsEventIdDeleteMutation } from '../store/api';
import { DesignSystem } from '../theme/design_system';

const EventsScreen = () => {
  const router = useRouter();
  const { data: eventsWrapper, error: eventsError, isLoading, refetch } = useGetAllEventsV1EventsGetQuery();
  const { data: myProfileWrapper } = useGetCurrentUserInfoV1AuthMeGetQuery();
  const [createEvent, { isLoading: isCreating }] = useCreateEventV1EventsPostMutation();
  const [deleteEvent] = useDeleteEventV1EventsEventIdDeleteMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const currentUser = (myProfileWrapper as any)?.data || myProfileWrapper;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={DesignSystem.colors.primary} />
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

  const handleCreateEvent = async () => {
    if (!title || !date || !location) {
      Alert.alert('Validation Error', 'Title, date, and location are required.');
      return;
    }

    try {
      await createEvent({
        eventCreate: {
          title,
          description,
          date: new Date(date).toISOString(),
          location,
          cover_image_url: ""
        }
      }).unwrap();
      setModalVisible(false);
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      refetch();
    } catch {
      Alert.alert('Error', 'Failed to create event.');
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteEvent({ eventId }).unwrap();
            refetch();
          } catch {
            Alert.alert('Error', 'Failed to delete event.');
          }
        }
      }
    ]);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const renderEventItem = ({ item }: { item: any }) => {
    const coverUrl = item.cover_image_url
      || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title || 'Event')}&background=1a1a2e&color=fff&size=300`;

    const isOwner = currentUser?.id === item.organizer?.id || currentUser?.user_id === item.organizer?.id;

    return (
      <TouchableOpacity
        style={styles.eventCard}
        activeOpacity={0.85}
        onPress={() => router.push(`/EventScreen/${item.id}` as any)}
      >
        <SafeImage source={{ uri: coverUrl }} style={styles.eventImage} resizeMode="cover" />
        <View style={styles.eventOverlay} />

        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeText}>{formatDate(item.date)}</Text>
        </View>

        {isOwner && (
          <TouchableOpacity style={styles.deleteBadge} onPress={() => handleDeleteEvent(item.id)}>
            <Ionicons name="trash" size={16} color={DesignSystem.colors.onPrimary} />
          </TouchableOpacity>
        )}

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
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
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

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create Event</Text>

              <ScrollView>
                <TextInput
                  style={styles.input}
                  placeholder="Event Title"
                  placeholderTextColor={DesignSystem.colors.textMuted}
                  value={title}
                  onChangeText={setTitle}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  placeholderTextColor={DesignSystem.colors.textMuted}
                  value={description}
                  onChangeText={setDescription}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Date (YYYY-MM-DD)"
                  placeholderTextColor={DesignSystem.colors.textMuted}
                  value={date}
                  onChangeText={setDate}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Location"
                  placeholderTextColor={DesignSystem.colors.textMuted}
                  value={location}
                  onChangeText={setLocation}
                />
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={handleCreateEvent} disabled={isCreating}>
                  {isCreating ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitBtnText}>Create</Text>
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
  deleteBadge: {
    position: 'absolute', top: 14, right: 14,
    backgroundColor: DesignSystem.colors.errorRed,
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4,
  },
  eventBody: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: DesignSystem.spacing.md, backgroundColor: DesignSystem.colors.overlay },
  eventTitle: { color: DesignSystem.colors.textPrimary, ...DesignSystem.typography.titleMedium, marginBottom: 8 },
  eventMeta: { flexDirection: 'row', gap: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: DesignSystem.colors.textSecondary, ...DesignSystem.typography.labelMedium },
  emptyContainer: { marginTop: 80, alignItems: 'center', gap: 12 },
  emptyTitle: { color: DesignSystem.colors.textPrimary, ...DesignSystem.typography.titleLarge },
  emptySubtitle: { color: DesignSystem.colors.textMuted, fontSize: 15 },

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

export default EventsScreen;