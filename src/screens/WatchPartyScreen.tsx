import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput, FlatList, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGetChatChannelDetailsQuery, useGetChatMessagesQuery, useSendMessageMutation, useGetMyProfileQuery, ChatMessage, User } from '../store/api';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const WatchPartyScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const flatListRef = useRef<FlatList>(null);

  // Fetch data
  const { data: channelDetails, isLoading: isChannelLoading } = useGetChatChannelDetailsQuery(id as string);
  const { data: messagesData } = useGetChatMessagesQuery(id as string, {
    pollingInterval: 5000,
  });
  const { data: myProfile } = useGetMyProfileQuery();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const [chatInput, setChatInput] = useState('');

  // Sort messages
  const messages = (messagesData || []).slice().sort((a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const handleSendMessage = async () => {
    if (chatInput.trim() && id) {
      try {
        await sendMessage({ channelId: id, content: chatInput }).unwrap();
        setChatInput('');
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const isMyMessage = (senderId: string) => {
    return myProfile?.id === senderId;
  };

  const renderParticipant = ({ item }: { item: User }) => (
    <View style={styles.participantItem}>
      <Image source={{ uri: item.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.participantAvatar} />
      <Text style={styles.participantName} numberOfLines={1}>{item.first_name || item.username}</Text>
    </View>
  );

  const renderChatMessage = ({ item }: { item: ChatMessage }) => {
    const isMe = isMyMessage(item.sender_id);
    const sender = channelDetails?.participants.find(p => p.id === item.sender_id);
    const senderName = sender ? (sender.first_name || sender.username) : 'Unknown';

    return (
      <View style={[styles.chatMessageContainer, isMe ? styles.myMessageContainer : styles.theirMessageContainer]}>
        {!isMe && <Text style={styles.chatSender}>{senderName}</Text>}
        <Text style={styles.chatMessage}>{item.content}</Text>
        <Text style={styles.chatTime}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  if (isChannelLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image
        source={{ uri: 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} // Placeholder or dynamic background
        style={styles.fullBackgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Watch Party</Text>
          <TouchableOpacity onPress={() => console.log('More options')}>
            <Text style={styles.moreOptionsIcon}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Video Player Placeholder */}
        <View style={styles.videoPlayer}>
          <LinearGradient
            colors={['#333', '#111']}
            style={styles.videoGradient}
          >
            <Text style={styles.videoPlaceholderText}>Video Player</Text>
            <Text style={styles.nowPlayingText}>{channelDetails?.name || 'Now Playing'}</Text>
          </LinearGradient>
        </View>

        {/* Participants Section */}
        <View style={styles.participantsSection}>
          <Text style={styles.sectionTitle}>Participants</Text>
          <FlatList
            horizontal
            data={channelDetails?.participants || []}
            renderItem={renderParticipant}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.participantsListContent}
          />
        </View>

        {/* Chat Section */}
        <View style={styles.chatSection}>
          <Text style={styles.sectionTitle}>Chat</Text>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderChatMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatMessagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatTextInput}
                placeholder="Type your message..."
                placeholderTextColor="#888"
                value={chatInput}
                onChangeText={setChatInput}
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton} disabled={!chatInput.trim() || isSending}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
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
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  screenTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  moreOptionsIcon: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 8,
  },
  videoPlayer: {
    width: '100%',
    height: height * 0.25,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  videoGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  nowPlayingText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 8,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  participantsSection: {
    marginBottom: 20,
    height: 90,
  },
  participantsListContent: {
    paddingVertical: 5,
  },
  participantItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 60,
  },
  participantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#1E90FF',
    marginBottom: 5,
  },
  participantName: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
  },
  chatSection: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.5)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    marginBottom: 20, // Add some bottom margin
  },
  chatMessagesList: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  chatMessageContainer: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    maxWidth: '85%',
  },
  myMessageContainer: {
    backgroundColor: '#1E90FF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2,
  },
  theirMessageContainer: {
    backgroundColor: '#333',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
  },
  chatSender: {
    color: '#DDD',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
  },
  chatMessage: {
    color: 'white',
    fontSize: 14,
  },
  chatTime: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#222',
    borderRadius: 25,
    padding: 5,
  },
  chatTextInput: {
    flex: 1,
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 40,
  },
  sendButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 5,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default WatchPartyScreen;