import React, { useState, useRef, useEffect } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import {
  View, Text, StyleSheet, Image, Dimensions, TouchableOpacity,
  TextInput, FlatList, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useGetConversationDetailsV1ChatConversationsConversationIdGetQuery,
  useGetCurrentUserInfoV1AuthMeGetQuery,
  useSendMessageV1ChatMessagesPostMutation
} from '../store/api';
import { DesignSystem } from '../theme/design_system';

const { height } = Dimensions.get('window');

const WatchTogetherScreen = () => {
  const router = useRouter();
  const { conversation_id } = useLocalSearchParams<{ conversation_id: string }>();
  const flatListRef = useRef<FlatList>(null);
  const [chatInput, setChatInput] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Replaced manual store query with actual auth info endpoint hook
  const { data: myProfileWrapper } = useGetCurrentUserInfoV1AuthMeGetQuery();
  const myProfile = myProfileWrapper?.data;

  // Utilize the conversation id parameters properly in the new spec
  const { data: conversationDetailsWrapper, error, isLoading } = useGetConversationDetailsV1ChatConversationsConversationIdGetQuery(
    { conversationId: conversation_id },
    { skip: !conversation_id }
  );

  const conversationDetails = conversationDetailsWrapper?.data;

  // New Send Message Mutation
  const [sendMessage, { isLoading: isSending }] = useSendMessageV1ChatMessagesPostMutation();

  const participants = conversationDetails?.participants || [];
  const chatMessages: any[] = conversationDetails?.messages || [];
  const partyName = conversationDetails?.name || 'Watch Party';
  const sharedTitle = (conversationDetails as any)?.shared_content?.title;

  const handleSend = async () => {
    if (!chatInput.trim() || !conversation_id) return;
    try {
      await sendMessage({ messageSend: { conversation_id, content: chatInput.trim() } }).unwrap();
      setChatInput('');
    } catch (err: any) {
      console.error('Send failed:', err);
    }
  };

  useEffect(() => {
    if (chatMessages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [chatMessages.length]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Joining party…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>Failed to load watch party.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderParticipant = ({ item }: { item: any }) => {
    const avatarUrl = item.avatar_url
      || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.username || 'U')}&background=1E90FF&color=fff`;
    const isCurrentUser = item.id === myProfile?.id;

    return (
      <View style={styles.participantAvatar}>
        <LinearGradient
          colors={isCurrentUser ? ['#1E90FF', '#0070E0'] : ['#9B59B6', '#6C3483']}
          style={styles.participantRing}
        >
          <SafeImage source={{ uri: avatarUrl }} style={styles.participantImg} />
        </LinearGradient>
        <Text style={styles.participantName} numberOfLines={1}>
          {isCurrentUser ? 'You' : (item.first_name || item.username)}
        </Text>
      </View>
    );
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender_id === myProfile?.id;
    return (
      <View style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowThem]}>
        <View style={[styles.msgBubble, isMe ? styles.msgBubbleMe : styles.msgBubbleThem]}>
          {!isMe && <Text style={styles.msgSender}>{item.sender?.username}</Text>}
          <Text style={styles.msgText}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Dark gradient background */}
      <LinearGradient colors={['#0a0a1a', '#0d0d0d']} style={StyleSheet.absoluteFillObject} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={22} color="white" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{partyName}</Text>
            {sharedTitle && <Text style={styles.headerSub}>{sharedTitle}</Text>}
          </View>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => setIsChatVisible(!isChatVisible)}
          >
            <Ionicons name={isChatVisible ? 'chatbubbles' : 'chatbubbles-outline'} size={22} color="#1E90FF" />
          </TouchableOpacity>
        </View>

        {/* Video Player Placeholder */}
        <View style={styles.videoPlayer}>
          <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.videoInner}>
            <Ionicons name="film" size={48} color="#2a2a4a" />
            <Text style={styles.videoPlaceholder}>
              {sharedTitle || 'No content selected'}
            </Text>
          </LinearGradient>

          {/* Playback controls overlay */}
          <View style={styles.videoControls}>
            <TouchableOpacity style={styles.videoBtn} onPress={() => setIsMuted(!isMuted)}>
              <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playPauseBtn} onPress={() => setIsPaused(!isPaused)}>
              <Ionicons name={isPaused ? 'play' : 'pause'} size={26} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.videoBtn}>
              <Ionicons name="expand" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Participants Row */}
        <FlatList
          horizontal
          data={participants}
          renderItem={renderParticipant}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.participantsRow}
          ListEmptyComponent={
            <Text style={styles.noParticipants}>No participants</Text>
          }
        />

        {/* Chat */}
        {isChatVisible && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.chatArea}
          >
            <FlatList
              ref={flatListRef}
              data={chatMessages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.chatList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              ListEmptyComponent={
                <Text style={styles.emptyChat}>Say something to the party! 🎉</Text>
              }
            />
            <View style={styles.inputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder="Chat with the party…"
                placeholderTextColor="#555"
                value={chatInput}
                onChangeText={setChatInput}
                onSubmitEditing={handleSend}
                editable={!isSending}
                returnKeyType="send"
              />
              <TouchableOpacity
                style={[styles.sendBtn, (!chatInput.trim() || isSending) && styles.sendBtnDisabled]}
                onPress={handleSend}
                disabled={!chatInput.trim() || isSending}
              >
                {isSending
                  ? <ActivityIndicator size="small" color="white" />
                  : <Ionicons name="send" size={16} color="white" />}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  centerContainer: { flex: 1, backgroundColor: DesignSystem.colors.backgroundPrimary, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { color: DesignSystem.colors.textPrimary, fontSize: 16 },
  errorText: { color: DesignSystem.colors.errorRed, fontSize: 16, fontWeight: '600' },
  retryBtn: { backgroundColor: DesignSystem.colors.surfaceContainer, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  retryText: { color: DesignSystem.colors.textPrimary, fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 },
  headerBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: DesignSystem.colors.textPrimary, fontSize: 17, fontWeight: '700' },
  headerSub: { color: DesignSystem.colors.textSecondary, fontSize: 12, marginTop: 2 },
  videoPlayer: { marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', height: height * 0.28 },
  videoInner: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  videoPlaceholder: { color: DesignSystem.colors.textMuted, fontSize: 15 },
  videoControls: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', padding: 14, backgroundColor: 'rgba(0,0,0,0.6)' },
  videoBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  playPauseBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: DesignSystem.colors.primary, justifyContent: 'center', alignItems: 'center' },
  participantsRow: { paddingHorizontal: 16, paddingVertical: 14, gap: 16 },
  participantAvatar: { alignItems: 'center', width: 60 },
  participantRing: { width: 50, height: 50, borderRadius: 25, padding: 2, justifyContent: 'center', alignItems: 'center' },
  participantImg: { width: 44, height: 44, borderRadius: 22, backgroundColor: DesignSystem.colors.surfaceContainerHighest },
  participantName: { color: DesignSystem.colors.textSecondary, fontSize: 11, marginTop: 5, textAlign: 'center' },
  noParticipants: { color: DesignSystem.colors.textMuted, fontSize: 13, paddingLeft: 4 },
  chatArea: { flex: 1, borderTopWidth: 1, borderTopColor: DesignSystem.colors.surfaceContainer },
  chatList: { padding: 12, paddingBottom: 4 },
  emptyChat: { color: DesignSystem.colors.textMuted, textAlign: 'center', marginTop: 20, fontSize: 14 },
  msgRow: { marginBottom: 8, maxWidth: '78%' },
  msgRowMe: { alignSelf: 'flex-end' },
  msgRowThem: { alignSelf: 'flex-start' },
  msgBubble: { borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 },
  msgBubbleMe: { backgroundColor: DesignSystem.colors.primary, borderBottomRightRadius: 4 },
  msgBubbleThem: { backgroundColor: DesignSystem.colors.surfaceContainer, borderBottomLeftRadius: 4 },
  msgSender: { color: DesignSystem.colors.primary, fontSize: 11, fontWeight: '700', marginBottom: 3 },
  msgText: { color: DesignSystem.colors.textPrimary, fontSize: 14, lineHeight: 19 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: DesignSystem.colors.surfaceContainer, backgroundColor: DesignSystem.colors.surface },
  chatInput: { flex: 1, backgroundColor: DesignSystem.colors.surfaceContainerHighest, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9, color: DesignSystem.colors.textPrimary, fontSize: 14, marginRight: 10, maxHeight: 80 },
  sendBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: DesignSystem.colors.primary, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: DesignSystem.colors.surfaceContainerHighest },
});

export default WatchTogetherScreen;