import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGetChatChannelsQuery, useSendMessageMutation } from '../store/api'; // Use chat channels to represent watch parties

const { width, height } = Dimensions.get('window');

const WatchTogetherScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { conversation_id } = params; // Expect conversation_id as route parameter

  const [chatInput, setChatInput] = useState('');

  // Fetch specific conversation details for this watch party
  const { data: conversationDetails, error: conversationError, isLoading: isConversationLoading } = useGetChatChannelsQuery(conversation_id ? { status: 'active' } : undefined, {
    selectFromResult: ({ data, error, isLoading }) => ({
      data: data?.find((conv: any) => conv.id === conversation_id), // Find the specific conversation
      error,
      isLoading,
    }),
    skip: !conversation_id, // Skip query if no conversation_id
  });

  const [sendMessage, { isLoading: isSendingMessage }] = useSendMessageMutation();

  const handleSendMessage = async () => {
    if (!conversation_id) {
      Alert.alert("Error", "No watch party selected.");
      return;
    }
    if (chatInput.trim()) {
      try {
        await sendMessage({
          conversation_id: conversation_id as string,
          content: chatInput.trim(),
          message_type: 'text',
        }).unwrap();
        setChatInput('');
      } catch (error: any) {
        console.error('Failed to send message:', error);
        Alert.alert('Error', error?.data?.message || 'Failed to send message.');
      }
    }
  };

  const participants = conversationDetails?.participants || [];
  const chatMessages = conversationDetails?.messages || []; // Assuming messages are part of conversationDetails or fetched separately

  if (isConversationLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Loading Watch Party...</Text>
      </View>
    );
  }

  if (conversationError) {
    console.error("Watch Party Conversation Error:", conversationError);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load watch party.</Text>
        <Text style={styles.errorText}>Please ensure the conversation ID is valid.</Text>
      </View>
    );
  }

  const renderParticipant = ({ item }: { item: any }) => (
    <View style={styles.participantItem}>
      <Image source={{ uri: item.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }} style={styles.participantAvatar} />
      <Text style={styles.participantName}>{item.display_name || item.username}</Text>
    </View>
  );

  const renderChatMessage = ({ item }: { item: any }) => (
    <View style={styles.chatMessageContainer}>
      <Text style={styles.chatSender}>{item.sender_username}</Text>
      <Text style={styles.chatMessage}>{item.content}</Text>
      <Text style={styles.chatTime}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image
        source={{/* require('../../assets/ui/extra/Watch Party.png') */}}
        style={styles.fullBackgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>{conversationDetails?.name || 'Watch Party'}</Text> {/* Use conversation name */}
          <TouchableOpacity onPress={() => console.log('More options')}>
            <Text style={styles.moreOptionsIcon}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Video Player Placeholder */}
        <View style={styles.videoPlayer}>
          <Text style={styles.videoPlaceholderText}>Video Player (Content: {conversationDetails?.shared_content?.title || 'N/A'})</Text>
        </View>

        {/* Participants Section */}
        <View style={styles.participantsSection}>
          <FlatList
            horizontal
            data={participants}
            renderItem={renderParticipant}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Chat Section */}
        <View style={styles.chatSection}>
          <FlatList
            data={chatMessages}
            renderItem={renderChatMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatMessagesList}
            inverted // Show latest messages at the bottom
          />
          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatTextInput}
              placeholder="Type your message..."
              placeholderTextColor="#888"
              value={chatInput}
              onChangeText={setChatInput}
              onSubmitEditing={handleSendMessage}
              editable={!isSendingMessage}
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton} disabled={isSendingMessage}>
              {isSendingMessage ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendButtonText}>Send</Text>}
            </TouchableOpacity>
          </View>
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  moreOptionsIcon: {
    color: 'white',
    fontSize: 20,
  },
  videoPlayer: {
    width: '100%',
    height: height * 0.3, // Roughly 30% of screen height
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  videoPlaceholderText: {
    color: 'white',
    fontSize: 20,
  },
  participantsSection: {
    marginBottom: 20,
  },
  participantItem: {
    alignItems: 'center',
    marginRight: 15,
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
    fontSize: 12,
  },
  chatSection: {
    flex: 1,
  },
  chatMessagesList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  chatMessageContainer: {
    backgroundColor: 'rgba(50,50,50,0.8)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  chatSender: {
    color: '#1E90FF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  chatMessage: {
    color: 'white',
    fontSize: 14,
  },
  chatTime: {
    color: '#888',
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: 'white',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default WatchTogetherScreen;