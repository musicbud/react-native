import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetConnectionsQuery, User } from '../store/api';
import { LinearGradient } from 'expo-linear-gradient';

const BudsScreen = () => {
  const router = useRouter();
  const { data: connectionsData, error: connectionsError, isLoading: isConnectionsLoading } = useGetConnectionsQuery({ limit: 100 });

  if (isConnectionsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (connectionsError) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>Unable to load connections.</Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const connections: User[] = connectionsData || [];

  const renderBudItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.budItemContainer}
      onPress={() => router.push(`/UserProfileScreen/${item.id}`)}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
        style={styles.budItem}
      >
        <Image source={{ uri: item.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.budAvatar} />
        <View style={styles.budDetails}>
          <Text style={styles.budName}>{item.first_name ? `${item.first_name} ${item.last_name || ''}` : item.username}</Text>
          <Text style={styles.budUsername}>@{item.username}</Text>
        </View>
        <View style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Message</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.screenTitle}>My Buds</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{connections.length}</Text>
        </View>
      </View>

      <FlatList
        data={connections}
        keyExtractor={(item) => item.id}
        renderItem={renderBudItem}
        contentContainerStyle={styles.budsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No connections yet.</Text>
            <Text style={styles.emptySubText}>Start swiping to find your music buds!</Text>
            <TouchableOpacity style={styles.findButton} onPress={() => router.push('/(tabs)/MatchingScreen' as any)}>
              <Text style={styles.findButtonText}>Find Buds</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  screenTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  headerBadgeText: {
    color: '#1E90FF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 14,
  },
  budsList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  budItemContainer: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  budItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  budAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  budDetails: {
    flex: 1,
    marginLeft: 16,
  },
  budName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  budUsername: {
    color: '#888',
    fontSize: 14,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(30, 144, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(30, 144, 255, 0.3)',
  },
  actionButtonText: {
    color: '#1E90FF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  findButton: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  findButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BudsScreen;