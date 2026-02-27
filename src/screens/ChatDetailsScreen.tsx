import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator, Image, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetChatMessagesQuery, useSendMessageMutation, useGetMyProfileQuery, ChatMessage } from '../store/api';
import { LinearGradient } from 'expo-linear-gradient';

const ChatDetailsScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);

    // Fetch data
    const { data: messagesData, isLoading: isMessagesLoading } = useGetChatMessagesQuery(id as string, {
        pollingInterval: 5000, // Poll every 5 seconds for new messages
    });
    const { data: myProfile } = useGetMyProfileQuery();
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

    const [newMessage, setNewMessage] = useState('');

    // Sort messages by date
    const messages = (messagesData || []).slice().sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !id) return;

        try {
            await sendMessage({ channelId: id, content: newMessage }).unwrap();
            setNewMessage('');
            // Optimistically update or wait for polling/invalidation
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const isMyMessage = (senderId: string) => {
        return myProfile?.id === senderId;
    };

    const renderItem = ({ item }: { item: ChatMessage }) => {
        const isMe = isMyMessage(item.sender_id);
        return (
            <View style={[
                styles.messageBubbleContainer,
                isMe ? styles.myMessageContainer : styles.theirMessageContainer
            ]}>
                {!isMe && (
                    <Image
                        source={{ uri: item.sender?.avatar_url || 'https://ui-avatars.com/api/?name=Music+Bud\&background=random' }}
                        style={styles.avatar}
                    />
                )}
                <LinearGradient
                    colors={isMe ? ['#1E90FF', '#007AFF'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                    style={[
                        styles.messageBubble,
                        isMe ? styles.myMessage : styles.theirMessage
                    ]}
                >
                    <Text style={styles.messageText}>{item.content}</Text>
                    <Text style={styles.timestamp}>
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </LinearGradient>
            </View>
        );
    };

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages.length]);

    if (isMessagesLoading) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" color="#1E90FF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chat</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                style={styles.inputContainer}
            >
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    placeholderTextColor="#666"
                    multiline
                />
                <TouchableOpacity
                    onPress={handleSendMessage}
                    style={[styles.sendButton, (!newMessage.trim() || isSending) && styles.sendButtonDisabled]}
                    disabled={!newMessage.trim() || isSending}
                >
                    <Text style={styles.sendButtonText}>➤</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        marginTop: 30, // Adjust for status bar
    },
    backButton: {
        padding: 8,
        width: 40,
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
    },
    messagesList: {
        padding: 16,
        paddingBottom: 20,
    },
    messageBubbleContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        maxWidth: '80%',
    },
    myMessageContainer: {
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
    },
    theirMessageContainer: {
        alignSelf: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
        alignSelf: 'flex-end',
        marginBottom: 4,
    },
    messageBubble: {
        padding: 12,
        borderRadius: 20,
    },
    myMessage: {
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        borderBottomLeftRadius: 4,
    },
    messageText: {
        color: 'white',
        fontSize: 16,
    },
    timestamp: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
    },
    input: {
        flex: 1,
        backgroundColor: '#333',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        color: 'white',
        marginRight: 10,
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        backgroundColor: '#1E90FF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#333',
    },
    sendButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: -2,
    },
});

export default ChatDetailsScreen;
