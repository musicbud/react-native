import React, { useState } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGetEventDetailsV1EventsEventIdGetQuery } from '../store/api';
import { DesignSystem } from '../theme/design_system';

const { width, height } = Dimensions.get('window');

const EventScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { event_id } = params; // Expect event_id as route parameter

  const [activeTab, setActiveTab] = useState('Overview'); // For tab navigation

  const { data: eventDetailsWrapper, error: eventError, isLoading: isEventLoading } = useGetEventDetailsV1EventsEventIdGetQuery(
    { eventId: event_id as string },
    { skip: !event_id }
  );

  if (isEventLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={DesignSystem.colors.primary} />
        <Text style={styles.loadingText}>Loading Event Details...</Text>
      </View>
    );
  }

  if (eventError) {
    console.error("Event Details Error:", eventError);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load event details.</Text>
        <Text style={styles.errorText}>Please ensure the event ID is valid.</Text>
      </View>
    );
  }

  const event = eventDetailsWrapper?.data;

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Event not found.</Text>
      </View>
    );
  }

  const renderAttendee = ({ item }: { item: any }) => (
    <View style={styles.attendeeItem}>
      <SafeImage source={{ uri: item.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.attendeeAvatar} />
      <Text style={styles.attendeeName}>{item.name}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <SafeImage
        source={{/* require('../../assets/ui/extra/Event.png') */ }}
        style={styles.fullBackgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>{event.title}</Text>
          <View style={styles.headerIcons}>
            {/* Placeholder for share/bookmark icons */}
            <TouchableOpacity onPress={() => Alert.alert('Share', 'Share functionality coming soon!')}>
              <Text style={styles.headerIcon}>🔗</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Bookmark', 'Bookmark functionality coming soon!')}>
              <Text style={styles.headerIcon}>🔖</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Event Banner */}
        <View style={styles.eventBanner}>
          <SafeImage source={{ uri: event.cover_image_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.eventBannerImage} resizeMode="cover" />
          <Text style={styles.eventBannerDate}>{new Date(event.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</Text>
        </View>

        {/* Event Details */}
        <View style={styles.eventDetailsContainer}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDescription}>{event.description}</Text>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tabButton, activeTab === 'Overview' && styles.activeTab]} onPress={() => setActiveTab('Overview')}>
              <Text style={styles.tabButtonText}>Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabButton, activeTab === 'Line-up' && styles.activeTab]} onPress={() => setActiveTab('Line-up')}>
              <Text style={styles.tabButtonText}>Line-up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabButton, activeTab === 'Shouts' && styles.activeTab]} onPress={() => setActiveTab('Shouts')}>
              <Text style={styles.tabButtonText}>Shouts</Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'Overview' && (
              <View>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailText}>{new Date(event.date).toLocaleString()}</Text>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailText}>{event.location}</Text>

                <View style={styles.attendanceRow}>
                  <Text style={styles.detailLabel}>Attendees</Text>
                  <Text style={styles.detailText}>{event.attendees?.length || 0} going</Text>
                </View>

                {event.attendees && event.attendees.length > 0 ? (
                  <FlatList
                    horizontal
                    data={event.attendees}
                    renderItem={renderAttendee}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.attendeesList}
                  />
                ) : (
                  <Text style={styles.detailText}>No attendees yet.</Text>
                )}


                <Text style={styles.detailLabel}>Full Description</Text>
                <Text style={styles.detailText}>{event.description}</Text>
              </View>
            )}
            {activeTab === 'Line-up' && (
              <View>
                <Text style={styles.detailText}>Line-up details coming soon...</Text>
              </View>
            )}
            {activeTab === 'Shouts' && (
              <View>
                <Text style={styles.detailText}>No shouts yet. Be the first!</Text>
              </View>
            )}
          </View>
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
    paddingHorizontal: 20,
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
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DesignSystem.colors.backgroundPrimary,
    padding: 20,
  },
  errorText: {
    color: DesignSystem.colors.errorRed,
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
    color: DesignSystem.colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  screenTitle: {
    color: DesignSystem.colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    color: DesignSystem.colors.textPrimary,
    fontSize: 20,
    marginLeft: 15,
  },
  eventBanner: {
    width: '100%',
    height: 180, // Example height for the banner area
    backgroundColor: DesignSystem.colors.surfaceContainerHighest,
    borderRadius: 10,
    justifyContent: 'flex-end',
    padding: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  eventBannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  eventBannerDate: {
    color: DesignSystem.colors.textPrimary,
    fontSize: 32,
    fontWeight: 'bold',
    zIndex: 1,
  },
  eventDetailsContainer: {
    backgroundColor: DesignSystem.colors.surfaceContainer,
    borderRadius: 10,
    padding: 15,
  },
  eventTitle: {
    color: DesignSystem.colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDescription: {
    color: DesignSystem.colors.textSecondary,
    fontSize: 14,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.borderColor,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: DesignSystem.colors.primary,
  },
  tabButtonText: {
    color: DesignSystem.colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContent: {
    paddingVertical: 10,
  },
  detailLabel: {
    color: DesignSystem.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  detailText: {
    color: DesignSystem.colors.textPrimary,
    fontSize: 16,
    marginBottom: 5,
  },
  attendanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  attendeesList: {
    marginTop: 10,
    marginBottom: 20,
  },
  attendeeItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  attendeeAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 2,
    borderColor: DesignSystem.colors.primary,
    marginBottom: 5,
  },
  attendeeName: {
    color: DesignSystem.colors.textPrimary,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default EventScreen;