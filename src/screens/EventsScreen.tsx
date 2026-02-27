import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetEventDetailsQuery } from '../store/api'; // This now fetches a list of events

const { width, height } = Dimensions.get('window');

const EventsScreen = () => {
  const router = useRouter();
  // Call the useGetEventDetailsQuery without an ID to get all events
  const { data: eventsData, error: eventsError, isLoading: isEventsLoading } = useGetEventDetailsQuery(''); // Pass empty string to trigger 'get all'
  
  if (isEventsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Loading Events...</Text>
      </View>
    );
  }

  if (eventsError) {
    console.error("Events Error:", eventsError);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load events.</Text>
        <Text style={styles.errorText}>Please check your backend server.</Text>
      </View>
    );
  }

  const events = eventsData?.data || []; // Assuming data key holds the array of events

  const renderEventItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.eventItem} onPress={() => router.push(`/EventScreen/${item.id}`)}>
      <Image source={{ uri: item.cover_image_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.eventImage} />
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.eventLocation}>{item.location}</Text>
      </View>
      <Text style={styles.chevronIcon}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{/* require('../../assets/ui/Events.png') */}} // Background from Events.png
        style={styles.fullBackgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Events</Text>
          <TouchableOpacity onPress={() => router.push('/EventScreen')}> {/* Hypothetical create event screen */}
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
        </View>

        {events.length === 0 ? (
          <View style={styles.noEventsContainer}>
            <Text style={styles.noEventsText}>No upcoming events found.</Text>
            <Text style={styles.noEventsText}>Be the first to create one!</Text>
          </View>
        ) : (
          <FlatList
            data={events}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.eventsList}
          />
        )}
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
    marginTop: 10,
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
  screenTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addIcon: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  eventsList: {
    paddingBottom: 20,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30,30,30,0.8)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDate: {
    color: '#CCC',
    fontSize: 14,
  },
  eventLocation: {
    color: '#CCC',
    fontSize: 14,
  },
  chevronIcon: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noEventsText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EventsScreen;