import React, { useState, useRef, useEffect } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput, FlatList, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  useGetConversationDetailsV1ChatConversationsConversationIdGetQuery,
  useGetMessagesV1ChatConversationsConversationIdMessagesGetQuery,
  useSendMessageV1ChatMessagesPostMutation,
  useGetCurrentUserInfoV1AuthMeGetQuery
} from '../store/api';
import { Ionicons } from '@expo/vector-icons';
import { mapJsonToStyles } from '../utils/styleMapper';
import { DesignSystem } from '../theme/design_system';

const { width, height } = Dimensions.get('window');

const WatchPartyScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string, type?: string }>();
  const flatListRef = useRef<FlatList>(null);

  const { data: channelDetailsWrapper, isLoading: isChannelLoading } = useGetConversationDetailsV1ChatConversationsConversationIdGetQuery({ conversationId: id as string });
  const channelDetails = channelDetailsWrapper?.data;

  const { data: messagesWrapper } = useGetMessagesV1ChatConversationsConversationIdMessagesGetQuery({ conversationId: id as string });
  const messagesData = messagesWrapper?.data; // Renamed from messagesDataWrapper to messagesWrapper, and messagesData is still used below

  const { data: myProfileWrapper } = useGetCurrentUserInfoV1AuthMeGetQuery();
  const myProfile = myProfileWrapper?.data;
  const [sendMessage] = useSendMessageV1ChatMessagesPostMutation();

  const [chatInput, setChatInput] = useState('');
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);

  const messages = (messagesData || []).slice().sort((a: any, b: any) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const handleSendMessage = async () => {
    if (chatInput.trim() && id) {
      try {
        await sendMessage({
          messageSend: { conversation_id: id, content: chatInput }
        }).unwrap();
        setChatInput('');
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };
  const isMyMessage = (senderId: string) => myProfile?.id === senderId;

  // Use styleMapper to grab sizing/opacity tokens
  const overlayStyle = mapJsonToStyles({
    properties: { layout: { padding: { top: Platform.OS === 'ios' ? 50 : 20, left: 20, right: 20, bottom: 20 } } }
  });

  const renderChatMessage = ({ item }: { item: any }) => {
    const isMe = isMyMessage(item.sender_id);
    const sender = channelDetails?.participants.find((p: any) => p.id === item.sender_id);
    const senderName = sender ? (sender.first_name || sender.username) : 'Unknown';

    return (
      <View style={[styles.chatMessageContainer, isMe ? styles.myMessageContainer : styles.theirMessageContainer]}>
        {!isMe && <Text style={styles.chatSender}>{senderName}</Text>}
        <Text style={styles.chatMessage}>{item.content}</Text>
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
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  const participants = channelDetails?.participants || [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background Media Placeholder (simulating the Movie/Music Video playing) */}
      <SafeImage
        source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000' }}
        style={styles.fullBackgroundImage}
        resizeMode="cover"
      />
      <View style={styles.dimOverlay} />

      <SafeAreaView style={[styles.overlay, overlayStyle as any]}>
        {/* Header HUD */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconCircle}>
            <Ionicons name="chevron-down" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconCircle}>
              <Ionicons name="grid" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle}>
              <Ionicons name="search" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle}>
              <Ionicons name="headset" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Floating Avatars (Participants) */}
        <View style={styles.avatarsContainer}>
          {participants.slice(0, 3).map((p: any, i: number) => (
            <View key={p.id} style={styles.avatarWrapper}>
              <SafeImage source={{ uri: p.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud&background=random' }} style={styles.avatarImg} />
              <View style={styles.avatarLabel}>
                <Text style={styles.avatarText}>{isMyMessage(p.id) ? "You" : p.first_name || p.username}</Text>
              </View>
            </View>
          ))}
          {participants.length < 4 && (
            <TouchableOpacity style={[styles.avatarWrapper, styles.addAvatar]}>
              <Ionicons name="add" size={24} color="white" />
              <Text style={styles.avatarText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ flex: 1 }} />

        {/* Media Title */}
        <Text style={styles.mediaTitle}>{channelDetails?.name || 'Now Playing'}</Text>

        {/* Bottom Chat Overlay */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.chatSection}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderChatMessage}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatListContent}
          />

          <View style={styles.bottomControls}>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setIsVideoOn(!isVideoOn)}>
                <Ionicons name={isVideoOn ? "videocam" : "videocam-off"} size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, !isMicOn && styles.actionBtnActive]} onPress={() => setIsMicOn(!isMicOn)}>
                <Ionicons name={isMicOn ? "mic" : "mic-off"} size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="desktop" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.endCallBtn]} onPress={() => router.back()}>
                <Ionicons name="call" size={22} color="white" style={{ transform: [{ rotate: '135deg' }] }} />
              </TouchableOpacity>
            </View>

            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatTextInput}
                placeholder="Send a message..."
                placeholderTextColor={DesignSystem.colors.textMuted}
                value={chatInput}
                onChangeText={setChatInput}
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity onPress={handleSendMessage} disabled={!chatInput.trim()}>
                <Ionicons name="send" size={24} color={chatInput.trim() ? DesignSystem.colors.primary : DesignSystem.colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  fullBackgroundImage: { width, height, position: 'absolute' },
  dimOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: DesignSystem.colors.overlay },
  overlay: { flex: 1 },
  loadingContainer: { flex: 1, backgroundColor: DesignSystem.colors.backgroundPrimary, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerRight: { flexDirection: 'row', gap: 12 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: DesignSystem.colors.surfaceContainerHighest, justifyContent: 'center', alignItems: 'center' },
  avatarsContainer: { position: 'absolute', right: 20, top: 120, gap: 16 },
  avatarWrapper: { width: 64, height: 80, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: DesignSystem.colors.borderColor, backgroundColor: DesignSystem.colors.surfaceContainer, alignItems: 'center' },
  addAvatar: { justifyContent: 'center', borderStyle: 'dashed' },
  avatarImg: { width: '100%', height: '100%', position: 'absolute' },
  avatarLabel: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: DesignSystem.colors.overlay, paddingVertical: 4, alignItems: 'center' },
  avatarText: { color: DesignSystem.colors.textPrimary, fontSize: 10, fontWeight: '600' },
  mediaTitle: { color: DesignSystem.colors.textPrimary, fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  chatSection: { height: 280, justifyContent: 'flex-end' },
  chatListContent: { paddingVertical: 10 },
  chatMessageContainer: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 18, marginBottom: 8, maxWidth: '80%' },
  myMessageContainer: { backgroundColor: DesignSystem.colors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  theirMessageContainer: { backgroundColor: DesignSystem.colors.surfaceContainerHighest, alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  chatSender: { color: DesignSystem.colors.textMuted, fontSize: 11, marginBottom: 4, fontWeight: '600' },
  chatMessage: { color: DesignSystem.colors.textPrimary, fontSize: 15 },
  bottomControls: { backgroundColor: DesignSystem.colors.surfaceContainer, borderRadius: 24, padding: 16, marginTop: 10, borderWidth: 1, borderColor: DesignSystem.colors.borderColor },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  actionBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: DesignSystem.colors.surfaceContainerHighest, justifyContent: 'center', alignItems: 'center' },
  actionBtnActive: { backgroundColor: DesignSystem.colors.errorRed, opacity: 0.8 },
  endCallBtn: { backgroundColor: DesignSystem.colors.errorRed },
  chatInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: DesignSystem.colors.surfaceContainerHighest, borderRadius: 20, paddingHorizontal: 16, height: 44 },
  chatTextInput: { flex: 1, color: DesignSystem.colors.textPrimary, fontSize: 15, paddingRight: 10 },
});

export default WatchPartyScreen;