import React, { useState } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetConversationsV1ChatConversationsGetQuery, useGetConnectionsV1MatchingConnectionsGetQuery } from '../store/api';
import { DesignSystem } from '../theme/design_system';

const { width, height } = Dimensions.get('window');

const ChatsAltScreen = () => {
  const router = useRouter();
  const { data: channelsWrapper, error: chatChannelsError, isLoading: isChatChannelsLoading } = useGetConversationsV1ChatConversationsGetQuery({});
  const { data: connectionsWrapper, error: chatUsersError, isLoading: isChatUsersLoading } = useGetConnectionsV1MatchingConnectionsGetQuery({ limit: 10 });
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

  const chatChannels = channelsWrapper?.data || [];
  const chatUsers = connectionsWrapper?.data || [];

  const renderChatItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => router.push(`/ChatDetailsScreen/${item.id}`)}>
      <SafeImage source={{ uri: item.avatar_url || (item.participants?.[0]?.avatar_url) || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.chatAvatar} />
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
      <SafeImage
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
    paddingHorizontal: DesignSystem.spacing.md,
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
  screenTitle: {
    color: DesignSystem.colors.textPrimary,
    ...DesignSystem.typography.headlineMedium,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.lg,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: DesignSystem.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.surfaceContainer,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: DesignSystem.colors.primary,
  },
  tabButtonText: {
    color: DesignSystem.colors.textPrimary,
    ...DesignSystem.typography.titleMedium,
  },
  chatListContainer: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignSystem.colors.surfaceContainerHighest,
    borderRadius: DesignSystem.radius.md,
    padding: DesignSystem.spacing.md,
    marginBottom: DesignSystem.spacing.sm,
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: DesignSystem.spacing.md,
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    color: DesignSystem.colors.textPrimary,
    ...DesignSystem.typography.titleMedium,
  },
  lastMessage: {
    color: DesignSystem.colors.textSecondary,
    ...DesignSystem.typography.bodyMedium,
    marginTop: 2,
  },
  chatTime: {
    color: DesignSystem.colors.textMuted,
    ...DesignSystem.typography.bodySmall,
  },
  emptyText: {
    color: DesignSystem.colors.textMuted,
    ...DesignSystem.typography.bodyLarge,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ChatsAltScreen;