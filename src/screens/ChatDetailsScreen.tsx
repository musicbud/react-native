import React, { useState, useEffect, useRef } from 'react';
import { SafeImage } from '../components/common/SafeImage';
import {
    View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity,
    KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator,
    Image, StatusBar, Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DesignSystem } from '../theme/design_system';
import { useGetCurrentUserInfoV1AuthMeGetQuery } from '../store/api';
import { useChatSync } from '../hooks/useChatSync';

const ChatDetailsScreen = () => {
    const { id, name, avatar } = useLocalSearchParams<{ id: string; name?: string; avatar?: string }>();
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);

    const { messages, isMessagesLoading: isLoading, sendMessage, isSending } = useChatSync(id as string);
    const { data: myProfileWrapper } = useGetCurrentUserInfoV1AuthMeGetQuery();
    const [newMessage, setNewMessage] = useState('');

    const myProfile = (myProfileWrapper as any)?.data || myProfileWrapper;

    const isMe = (senderId: string) => myProfile?.id === senderId;

    const handleSend = async () => {
        if (!newMessage.trim() || !id) return;
        try {
            await sendMessage(newMessage);
            setNewMessage('');
        } catch (err) {
            console.error('Send failed:', err);
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages.length]);

    const renderItem = ({ item }: { item: any }) => {
        const mine = isMe(item.sender_id);
        const avatarUrl = item.sender?.avatar_url
            || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.sender?.username || 'U')}&background=E91E63&color=fff`;

        return (
            <View style={[styles.bubbleRow, mine ? styles.myRow : styles.theirRow]}>
                {!mine && <SafeImage source={{ uri: avatarUrl }} style={styles.avatar} />}
                <View style={styles.bubbleGroup}>
                    {!mine && (
                        <Text style={styles.senderName}>{item.sender?.username}</Text>
                    )}
                    <LinearGradient
                        colors={mine ? [DesignSystem.colors.primaryRed, DesignSystem.colors.errorRed] : [DesignSystem.colors.surfaceContainerHighest, DesignSystem.colors.surfaceContainer]}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={[styles.bubble, mine ? styles.myBubble : styles.theirBubble]}
                    >
                        <Text style={styles.messageText}>{item.content}</Text>
                    </LinearGradient>
                    <Text style={[styles.timestamp, mine && { textAlign: 'right' }]}>
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                {mine && <SafeImage source={{ uri: myProfile?.avatar_url || avatarUrl }} style={styles.avatar} />}
            </View>
        );
    };

    const chatName = name || 'Chat';
    const chatAvatar = avatar
        || `https://ui-avatars.com/api/?name=${encodeURIComponent(chatName)}&background=E91E63&color=fff`;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={22} color={DesignSystem.colors.onSurface} />
                </TouchableOpacity>
                <SafeImage source={{ uri: chatAvatar }} style={styles.headerAvatar} />
                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>{chatName}</Text>
                    <Text style={styles.headerStatus}>Online</Text>
                </View>
                <TouchableOpacity style={styles.headerAction}>
                    <Ionicons name="call" size={20} color={DesignSystem.colors.primaryRed} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerAction}>
                    <Ionicons name="ellipsis-vertical" size={20} color={DesignSystem.colors.textMuted} />
                </TouchableOpacity>
            </View>

            {/* Messages */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={DesignSystem.colors.primaryRed} />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.messagesList}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    ListEmptyComponent={
                        <View style={styles.emptyChat}>
                            <Ionicons name="chatbubbles-outline" size={48} color={DesignSystem.colors.surfaceContainerHighest} />
                            <Text style={styles.emptyChatText}>No messages yet. Say hi! 👋</Text>
                        </View>
                    }
                />
            )}

            {/* Input Bar */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputBar}>
                    <TouchableOpacity style={styles.attachBtn}>
                        <Ionicons name="attach" size={22} color={DesignSystem.colors.textMuted} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type a message..."
                        placeholderTextColor={DesignSystem.colors.textMuted}
                        multiline
                        maxLength={1000}
                    />
                    <Pressable
                        onPress={handleSend}
                        disabled={!newMessage.trim() || isSending}
                        style={({ pressed }) => [
                            styles.sendBtn,
                            (!newMessage.trim() || isSending) && styles.sendBtnDisabled,
                            pressed && { opacity: 0.8 },
                        ]}
                    >
                        {isSending
                            ? <ActivityIndicator size="small" color="white" />
                            : <Ionicons name="send" size={18} color="white" />}
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: DesignSystem.colors.backgroundPrimary },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: DesignSystem.spacing.sm, paddingVertical: DesignSystem.spacing.sm, borderBottomWidth: 1, borderBottomColor: DesignSystem.colors.borderColor },
    backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    headerAvatar: { width: 38, height: 38, borderRadius: 19, marginRight: 10, backgroundColor: DesignSystem.colors.surfaceContainer },
    headerInfo: { flex: 1 },
    headerName: { color: DesignSystem.colors.onSurface, ...DesignSystem.typography.titleMedium },
    headerStatus: { color: DesignSystem.colors.successGreen, ...DesignSystem.typography.labelSmall },
    headerAction: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    messagesList: { padding: DesignSystem.spacing.md, paddingBottom: DesignSystem.spacing.sm },
    bubbleRow: { flexDirection: 'row', marginBottom: DesignSystem.spacing.md, maxWidth: '80%', alignItems: 'flex-end' },
    myRow: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
    theirRow: { alignSelf: 'flex-start' },
    avatar: { width: 28, height: 28, borderRadius: 14, marginHorizontal: 8, backgroundColor: DesignSystem.colors.surfaceContainer },
    bubbleGroup: { flex: 1 },
    senderName: { color: DesignSystem.colors.textMuted, ...DesignSystem.typography.labelSmall, marginBottom: 3, marginLeft: 12 },
    bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: DesignSystem.radius.xl },
    myBubble: { borderBottomRightRadius: 4 },
    theirBubble: { borderBottomLeftRadius: 4 },
    messageText: { color: DesignSystem.colors.onSurface, ...DesignSystem.typography.bodyLarge },
    timestamp: { color: DesignSystem.colors.textSecondary, ...DesignSystem.typography.labelSmall, marginTop: 4, marginHorizontal: 12 },
    emptyChat: { alignItems: 'center', marginTop: 80, gap: 12 },
    emptyChatText: { color: DesignSystem.colors.textSecondary, ...DesignSystem.typography.bodyLarge },
    inputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: DesignSystem.spacing.sm, paddingVertical: DesignSystem.spacing.sm, borderTopWidth: 1, borderTopColor: DesignSystem.colors.borderColor, backgroundColor: DesignSystem.colors.surfaceContainer },
    attachBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    input: { flex: 1, backgroundColor: DesignSystem.colors.surfaceContainerHighest, borderRadius: DesignSystem.radius.full, paddingHorizontal: DesignSystem.spacing.md, paddingVertical: 10, color: DesignSystem.colors.onSurface, ...DesignSystem.typography.bodyMedium, maxHeight: 120, marginHorizontal: 8 },
    sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: DesignSystem.colors.primaryRed, justifyContent: 'center', alignItems: 'center' },
    sendBtnDisabled: { backgroundColor: DesignSystem.colors.surfaceContainerHighest },
});

export default ChatDetailsScreen;
