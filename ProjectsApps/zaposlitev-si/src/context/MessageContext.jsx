import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    updateDoc,
    doc,
    serverTimestamp,
    getDocs,
    writeBatch,
    getDoc,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const MessageContext = createContext();

export const useMessages = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessages must be used within a MessageProvider');
    }
    return context;
};

export const MessageProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch conversations for current user
    useEffect(() => {
        if (!currentUser) {
            setConversations([]);
            setUnreadCount(0);
            return;
        }

        const conversationsQuery = query(
            collection(db, 'conversations'),
            where('participants', 'array-contains', currentUser.uid)
            // Use timestamp from lastMessage for ordering
        );

        const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
            const conversationsList = [];
            let totalUnread = 0;

            snapshot.forEach((doc) => {
                const data = { id: doc.id, ...doc.data() };
                conversationsList.push(data);

                // Count unread messages based on unreadCount map
                if (data.unreadCount && data.unreadCount[currentUser.uid] > 0) {
                    totalUnread += data.unreadCount[currentUser.uid];
                }
            });

            // Sort conversations by lastMessage timestamp (newest first)
            conversationsList.sort((a, b) => {
                const timestampA =
                    a.lastMessage?.timestamp?.getTime?.() ||
                    a.lastMessage?.timestamp ||
                    0;
                const timestampB =
                    b.lastMessage?.timestamp?.getTime?.() ||
                    b.lastMessage?.timestamp ||
                    0;
                return timestampB - timestampA;
            });

            setConversations(conversationsList);
            setUnreadCount(totalUnread);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Fetch messages for active conversation
    useEffect(() => {
        if (!activeConversation) {
            setMessages([]);
            return;
        }

        const messagesQuery = query(
            collection(db, 'messages'),
            where('conversationId', '==', activeConversation.id)
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesList = [];
            snapshot.forEach((doc) => {
                messagesList.push({ id: doc.id, ...doc.data() });
            });

            // Sort messages by timestamp on the client side
            messagesList.sort((a, b) => {
                const timestampA = a.timestamp?.getTime?.() || a.timestamp || 0;
                const timestampB = b.timestamp?.getTime?.() || b.timestamp || 0;
                return timestampA - timestampB;
            });

            setMessages(messagesList);
        });

        return () => unsubscribe();
    }, [activeConversation]);

    // Create or find conversation for job application
    const createJobConversation = async (
        jobId,
        jobTitle,
        employerId,
        applicantId
    ) => {
        try {
            setLoading(true);

            // Simple conversation creation - just like how addJob works
            const conversationData = {
                jobId,
                jobTitle,
                participants: [employerId, applicantId],
                createdAt: new Date(),
                lastMessage: {
                    text: `Application for: ${jobTitle}`,
                    senderId: applicantId,
                    timestamp: new Date(),
                },
                unreadCount: {
                    [employerId]: 1, // Employer has 1 unread message
                    [applicantId]: 0, // Applicant has 0 unread messages
                },
            };

            console.log('Creating conversation with data:', conversationData);

            const docRef = await addDoc(
                collection(db, 'conversations'),
                conversationData
            );

            console.log(
                'Successfully created conversation with ID:',
                docRef.id
            );
            return { id: docRef.id, ...conversationData };
        } catch (error) {
            console.error('Error creating conversation:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Send a message
    const sendMessage = async (conversationId, text, recipientId) => {
        try {
            if (!currentUser || !text.trim()) return;

            // Get conversation to update unread counts
            const conversationRef = doc(db, 'conversations', conversationId);
            const conversationDoc = await getDoc(conversationRef);
            const conversation = conversationDoc.data();

            if (!conversation) {
                throw new Error('Conversation not found');
            }

            // Message for the messages collection
            const messageData = {
                conversationId: conversationId,
                text: text.trim(),
                senderId: currentUser.uid,
                timestamp: new Date(),
                read: false,
            };

            // Add message to messages collection
            await addDoc(collection(db, 'messages'), messageData);

            // Update conversation last message and increment recipient's unread count
            const lastMessageData = {
                text: text.trim(),
                timestamp: new Date(),
                senderId: currentUser.uid,
            };

            // Create updated unreadCount with incremented count for recipient
            const updatedUnreadCount = { ...conversation.unreadCount };
            conversation.participants.forEach((participantId) => {
                if (participantId !== currentUser.uid) {
                    // Increment unread count for other participants
                    updatedUnreadCount[participantId] =
                        (updatedUnreadCount[participantId] || 0) + 1;
                }
            });

            // Update conversation with new last message and unread counts
            await updateDoc(conversationRef, {
                lastMessage: lastMessageData,
                unreadCount: updatedUnreadCount,
            });
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    };

    // Mark messages as read
    const markAsRead = async (conversationId) => {
        try {
            if (!currentUser) return;

            const conversation = conversations.find(
                (c) => c.id === conversationId
            );

            if (!conversation) return;

            // Update unread count for current user to 0
            if (
                conversation.unreadCount &&
                conversation.unreadCount[currentUser.uid] > 0
            ) {
                const updatedUnreadCount = { ...conversation.unreadCount };
                updatedUnreadCount[currentUser.uid] = 0;

                await updateDoc(doc(db, 'conversations', conversationId), {
                    [`unreadCount.${currentUser.uid}`]: 0,
                });

                // Also mark all messages as read
                const messagesQuery = query(
                    collection(db, 'messages'),
                    where('conversationId', '==', conversationId),
                    where('senderId', '!=', currentUser.uid),
                    where('read', '==', false)
                );

                const unreadMessages = await getDocs(messagesQuery);

                // Update each message to read=true
                const batch = writeBatch(db);
                unreadMessages.forEach((message) => {
                    batch.update(doc(db, 'messages', message.id), {
                        read: true,
                    });
                });

                await batch.commit();
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const value = {
        conversations,
        activeConversation,
        setActiveConversation,
        messages,
        loading,
        unreadCount,
        createJobConversation,
        sendMessage,
        markAsRead,
    };

    return (
        <MessageContext.Provider value={value}>
            {children}
        </MessageContext.Provider>
    );
};
