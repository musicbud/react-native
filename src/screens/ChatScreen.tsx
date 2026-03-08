import React from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useChatSync } from '../hooks/useChatSync';
import { LinearGradient } from 'expo-linear-gradient';
import { DesignSystem } from '../theme/design_system';
import { SectionHeader } from '../components/common/SectionHeader';

const ChatScreen = () => {
  const router = useRouter();
  const {
    watchParties,
    directMessages,
    isConversationsLoading: isLoading,
    conversationsError: chatError,
    refetchConversations: refetch
  } = useChatSync();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={DesignSystem.colors.primaryRed} />
      </View>
    );
  }

  if (chatError) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>Unable to load chats.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }



  const renderWatchPartyItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.watchPartyItem} onPress={() => router.push(`/WatchPartyScreen/${item.id}` as any)}>
      <LinearGradient
        colors={[DesignSystem.colors.accentBlue, DesignSystem.colors.primaryContainer]}
        style={styles.watchPartyGradient}
      >
        <SafeImage source={{ uri: item.avatar_url || item.image_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.watchPartyAvatar} />
      </LinearGradient>
      <Text style={styles.watchPartyName} numberOfLines={1}>{item.name || item.display_name}</Text>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: any }) => {
    const otherParticipant = item.participants?.[0];
    const displayName = item.name || otherParticipant?.username || 'Unknown';
    const avatarUrl = otherParticipant?.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random';

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.messageItemContainer}
        onPress={() => router.push(`/ChatDetailsScreen/${item.id}`)}
      >
        <LinearGradient
          colors={[DesignSystem.colors.surfaceContainerHighest, DesignSystem.colors.surfaceContainer]}
          style={styles.messageItem}
        >
          <SafeImage source={{ uri: avatarUrl }} style={styles.messageAvatar} />
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
                {item.last_message?.content || item.latest_message?.content || 'No messages yet'}
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
            <SectionHeader title="Watch Parties" style={{ paddingHorizontal: DesignSystem.spacing.md }} />
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
          <SectionHeader title="Messages" style={{ paddingHorizontal: DesignSystem.spacing.md }} />
          {directMessages.length > 0 ? (
            <FlatList
              data={directMessages}
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
    backgroundColor: DesignSystem.colors.backgroundPrimary,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: DesignSystem.spacing.md,
    paddingBottom: DesignSystem.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screenTitle: {
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.displaySmall,
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(233, 30, 99, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.5)',
  },
  newChatText: {
    color: DesignSystem.colors.primaryRed,
    fontSize: 24,
    marginTop: -2,
    fontWeight: '300',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: DesignSystem.colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: DesignSystem.colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: DesignSystem.colors.errorRed,
    ...DesignSystem.typography.bodyLarge,
    marginBottom: DesignSystem.spacing.md,
  },
  retryButton: {
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.sm,
    backgroundColor: DesignSystem.colors.surfaceContainer,
    borderRadius: DesignSystem.radius.sm,
  },
  retryButtonText: {
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.labelLarge,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: DesignSystem.spacing.lg,
  },
  watchPartyList: {
    paddingHorizontal: DesignSystem.spacing.md,
  },
  watchPartyItem: {
    alignItems: 'center',
    marginRight: DesignSystem.spacing.md,
    width: 70,
  },
  watchPartyGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.xs,
  },
  watchPartyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: DesignSystem.colors.surfaceContainerHighest,
  },
  watchPartyName: {
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.labelSmall,
    textAlign: 'center',
  },
  messageItemContainer: {
    marginBottom: 2,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DesignSystem.spacing.md,
    paddingHorizontal: DesignSystem.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.borderColor,
  },
  messageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.surfaceContainerHighest,
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
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.titleMedium,
  },
  messageTime: {
    color: DesignSystem.colors.textMuted,
    ...DesignSystem.typography.bodySmall,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    color: DesignSystem.colors.textSecondary,
    ...DesignSystem.typography.bodyMedium,
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: DesignSystem.colors.primaryRed,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: DesignSystem.colors.onPrimary,
    ...DesignSystem.typography.labelSmall,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    opacity: 0.6,
  },
  emptyText: {
    color: DesignSystem.colors.onSurface,
    ...DesignSystem.typography.titleLarge,
    marginBottom: 8,
  },
  emptySubText: {
    color: DesignSystem.colors.textMuted,
    ...DesignSystem.typography.bodyMedium,
  },
});

export default ChatScreen;