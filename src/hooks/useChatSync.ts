import { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import {
    useGetConversationsV1ChatConversationsGetQuery,
    useGetMessagesV1ChatConversationsConversationIdMessagesGetQuery,
    useSendMessageV1ChatMessagesPostMutation,
    useMarkMessageReadV1ChatMessagesMessageIdReadPutMutation,
    useSendTypingIndicatorV1ChatConversationsConversationIdTypingPostMutation,
    useGetCurrentUserInfoV1AuthMeGetQuery
} from '../store/api';
import { getBaseUrl } from '../store/apibase';

/**
 * A custom hook to encapsulate Chat data synchronization logic.
 * This acts as a Service Layer between UI components and RTK Query generated endpoints,
 * providing features like polling (for basic pseudo-realtime sync) and grouped message actions.
 */
export const useChatSync = (conversationId?: string) => {
    // Current user context
    const { data: myProfileWrapper } = useGetCurrentUserInfoV1AuthMeGetQuery();
    const myProfile = (myProfileWrapper as any)?.data || myProfileWrapper;
    const userId = myProfile?.id;

    // Fetch conversations array
    const {
        data: conversationsWrapper,
        error: conversationsError,
        isLoading: isConversationsLoading,
        refetch: refetchConversations
    } = useGetConversationsV1ChatConversationsGetQuery(
        {},
        // Example: Poll conversations every 10s if we don't have true websockets active
        { pollingInterval: 10000, skip: !!conversationId }
    );

    // Fetch messages for a specific conversation
    const {
        data: messagesWrapper,
        isLoading: isMessagesLoading,
        refetch: refetchMessages
    } = useGetMessagesV1ChatConversationsConversationIdMessagesGetQuery(
        { conversationId: conversationId || '' },
        {
            skip: !conversationId,
            pollingInterval: 3000 // Poll more frequently when inside a specific chat
        }
    );

    const [sendMessageMutation, { isLoading: isSending }] = useSendMessageV1ChatMessagesPostMutation();
    const [markReadMutation] = useMarkMessageReadV1ChatMessagesMessageIdReadPutMutation();
    const [sendTypingMutation] = useSendTypingIndicatorV1ChatConversationsConversationIdTypingPostMutation();

    // Safely extract the raw data
    const conversations = useMemo(() => {
        return conversationsWrapper?.data || (Array.isArray(conversationsWrapper) ? conversationsWrapper : []);
    }, [conversationsWrapper]);

    const messages = useMemo(() => {
        const msgsData = messagesWrapper?.data || (Array.isArray(messagesWrapper) ? messagesWrapper : []);
        return [...msgsData].sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }, [messagesWrapper]);

    // Derived filtered lists
    const watchParties = useMemo(() => conversations.filter((c: any) => c.is_watch_party), [conversations]);
    const directMessages = useMemo(() => conversations.filter((c: any) => !c.is_watch_party), [conversations]);

    // WebSocket state
    const ws = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const base = getBaseUrl().replace('http', 'ws');
        const wsUrl = `${base}/ws/chat?user_id=${userId}`;

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log("WebSocket connected");
            setIsConnected(true);
        };

        ws.current.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                console.log("WS message received:", data);

                // When we receive an event, we refetch to ensure RTK Query cache is fresh
                if (data.type === 'message' || data.type === 'typing') {
                    if (conversationId) {
                        refetchMessages();
                    }
                    refetchConversations();
                }
            } catch (err) {
                console.error("Failed to parse WS message", err);
            }
        };

        ws.current.onerror = (e) => {
            console.error("WebSocket error:", e);
        };

        ws.current.onclose = () => {
            console.log("WebSocket disconnected");
            setIsConnected(false);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }
        };
    }, [userId, conversationId, refetchMessages, refetchConversations]);

    // Actions
    const sendMessage = useCallback(async (content: string) => {
        if (!conversationId || !content.trim()) return null;
        try {
            const result = await sendMessageMutation({
                messageSend: {
                    conversation_id: conversationId,
                    content: content.trim()
                }
            }).unwrap();
            return result;
        } catch (e) {
            console.error('Failed to send message:', e);
            throw e;
        }
    }, [conversationId, sendMessageMutation]);

    const markMessageAsRead = useCallback(async (messageId: string) => {
        try {
            await markReadMutation({ messageId }).unwrap();
        } catch (e) {
            console.error('Failed to mark message as read:', e);
        }
    }, [markReadMutation]);

    const setTypingStatus = useCallback(async (isTyping: boolean) => {
        if (!conversationId) return;
        try {
            await sendTypingMutation({ conversationId, isTyping }).unwrap();
        } catch (e) {
            console.error('Failed to send typing status:', e);
        }
    }, [conversationId, sendTypingMutation]);

    return {
        // Data
        conversations,
        watchParties,
        directMessages,
        messages,

        // Status
        isConversationsLoading,
        isMessagesLoading,
        isSending,
        conversationsError,

        // Actions
        refetchConversations,
        refetchMessages,
        sendMessage,
        markMessageAsRead,
        setTypingStatus,
        isConnected, // Provide web socket connection status to UI
    };
};
