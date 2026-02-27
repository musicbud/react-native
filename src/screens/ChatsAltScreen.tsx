import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetChatChannelsQuery, useGetConnectionsQuery } from '../store/api';

const { width, height } = Dimensions.get('window');

const ChatsAltScreen = () => {
  const router = useRouter();
  const { data: chatChannelsData, error: chatChannelsError, isLoading: isChatChannelsLoading } = useGetChatChannelsQuery();
  const { data: chatUsersData, error: chatUsersError, isLoading: isChatUsersLoading } = useGetConnectionsQuery({ limit: 10 });
  const [activeTab, setActiveTab] = useState('Chats'); // 'Chats', 'Buds'

  if (isChatChannelsLoading || isChatUsersLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Chats...</Text>
      </View>
    );
  }

  if (chatChannelsError || chatUsersError) {
    console.error("Chat Channels Error:", chatChannelsError);
    console.error("Chat Users Error:", chatUsersError);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load chat data.</Text>
        <Text style={styles.errorText}>Please check your backend server.</Text>
      </View>
    );
  }

  const chatChannels = chatChannelsData || [];
  const chatUsers = chatUsersData || [];

  const renderChatItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => router.push(`/ChatDetailsScreen/${item.id}`)}>
      <Image source={{ uri: item.avatar_url || (item.participants?.[0]?.avatar_url) || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.chatAvatar} />
      <View style={styles.chatContent}>
        <Text style={styles.chatName}>{item.name || item.display_name || item.username || (item.participants?.[0]?.username) || 'Unknown'}</Text>
        <Text style={styles.lastMessage}>{item.last_message?.content || item.bio || 'New Connection'}</Text>
      </View>
      <Text style={styles.chatTime}>
        {item.updated_at ? new Date(item.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image
        source={{/* require('../../assets/ui/extra/Chats-1.png') */ }}
        style={styles.fullBackgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.screenTitle}>Messages</Text>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'Chats' && styles.activeTab]} onPress={() => setActiveTab('Chats')}>
            <Text style={styles.tabButtonText}>Chats</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'Buds' && styles.activeTab]} onPress={() => setActiveTab('Buds')}>
            <Text style={styles.tabButtonText}>Buds</Text>
          </TouchableOpacity>
        </View>

        {/* Chat List */}
        <ScrollView style={styles.chatListContainer}>
          {activeTab === 'Chats' && (
            chatChannels.length > 0 ? (
              <FlatList
                data={chatChannels}
                renderItem={renderChatItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>No active chats yet.</Text>
            )
          )}
          {activeTab === 'Buds' && (
            chatUsers.length > 0 ? (
              <FlatList
                data={chatUsers}
                renderItem={renderChatItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>No buds found. Start swiping!</Text>
            )
          )}
        </ScrollView>
      </View>
    </View>
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
  screenTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#1E90FF',
  },
  tabButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatListContainer: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30,30,30,0.8)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    color: '#CCC',
    fontSize: 14,
  },
  chatTime: {
    color: '#888',
    fontSize: 12,
  },
});

export default ChatsAltScreen;