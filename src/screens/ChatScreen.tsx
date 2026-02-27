import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetChatChannelsQuery, ChatChannel } from '../store/api';
import { LinearGradient } from 'expo-linear-gradient';

const ChatScreen = () => {
  const router = useRouter();
  const { data: channels, error: channelsError, isLoading: isChannelsLoading } = useGetChatChannelsQuery({});

  if (isChannelsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (channelsError) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>Unable to load chats.</Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const conversations: ChatChannel[] = channels || [];

  const watchParties = conversations.filter((conv: any) => conv.is_watch_party);
  const messages = conversations.filter((conv: any) => !conv.is_watch_party);

  const renderWatchPartyItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.watchPartyItem} onPress={() => router.push(`/WatchPartyScreen/${item.id}` as any)}>
      <LinearGradient
        colors={['#1E90FF', '#00BFFF']}
        style={styles.watchPartyGradient}
      >
        <Image source={{ uri: item.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.watchPartyAvatar} />
      </LinearGradient>
      <Text style={styles.watchPartyName} numberOfLines={1}>{item.name || item.display_name}</Text>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: ChatChannel }) => {
    // Determine display name and avatar (assuming 1-on-1 chat for now if no name)
    // In a real app, logic would be more complex to find "other" participant
    const otherParticipant = item.participants?.[0]; // Simplification
    const displayName = item.name || otherParticipant?.username || 'Unknown';
    const avatarUrl = otherParticipant?.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random';

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.messageItemContainer}
        onPress={() => router.push(`/ChatDetailsScreen/${item.id}`)}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
          style={styles.messageItem}
        >
          <Image source={{ uri: avatarUrl }} style={styles.messageAvatar} />
          <View style={styles.messageDetails}>
            <View style={styles.messageHeader}>
              <Text style={styles.messageName}>{displayName}</Text>
              {item.updated_at && (
                <Text style={styles.messageTime}>
                  {new Date(item.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              )}
            </View>
            <View style={styles.messageFooter}>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.last_message?.content || 'No messages yet'}
              </Text>
              {item.unread_count && item.unread_count > 0 ? (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread_count}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Chats</Text>
        <TouchableOpacity style={styles.newChatButton}>
          <Text style={styles.newChatText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Watch Parties Section */}
        {watchParties.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Watch Parties</Text>
            <FlatList
              horizontal
              data={watchParties}
              keyExtractor={(item) => item.id}
              renderItem={renderWatchPartyItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.watchPartyList}
            />
          </View>
        )}

        {/* Messages Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Messages</Text>
          {messages.length > 0 ? (
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessageItem}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No active chats</Text>
              <Text style={styles.emptySubText}>Start a conversation with your Buds!</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screenTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 144, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(30, 144, 255, 0.5)',
  },
  newChatText: {
    color: '#1E90FF',
    fontSize: 24,
    marginTop: -2,
    fontWeight: '300',
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
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  watchPartyList: {
    paddingHorizontal: 20,
  },
  watchPartyItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  watchPartyGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  watchPartyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
  },
  watchPartyName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  messageItemContainer: {
    marginBottom: 2,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  messageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#333',
  },
  messageDetails: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  messageName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  messageTime: {
    color: '#666',
    fontSize: 12,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    color: '#999',
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: '#1E90FF',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    opacity: 0.6,
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubText: {
    color: '#888',
    fontSize: 14,
  },
});

export default ChatScreen;