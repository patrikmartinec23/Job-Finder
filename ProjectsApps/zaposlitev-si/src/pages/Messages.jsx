import React, { useState, useEffect, useRef } from 'react';
import { useMessages } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const Messages = () => {
    const { currentUser } = useAuth();
    const {
        conversations,
        activeConversation,
        setActiveConversation,
        messages,
        loading,
        sendMessage,
        markAsRead,
    } = useMessages();
    const [newMessage, setNewMessage] = useState('');
    const [sendLoading, setSendLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Mark conversation as read when opened
    useEffect(() => {
        if (activeConversation) {
            markAsRead(activeConversation.id);
        }
    }, [activeConversation, markAsRead]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation || sendLoading) return;

        try {
            setSendLoading(true);
            const recipientId = activeConversation.participants.find(
                (id) => id !== currentUser.uid
            );
            await sendMessage(activeConversation.id, newMessage, recipientId);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSendLoading(false);
        }
    };

    const formatMessageTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp);
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!currentUser) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="alert alert-warning text-center">
                            <h4>Authentication Required</h4>
                            <p>You must be logged in to view messages.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid mt-4">
            <div className="row">
                {/* Conversations List */}
                <div className="col-md-4 col-lg-3">
                    <div className="card h-100">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">
                                <i className="fas fa-comments me-2"></i>
                                Messages
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            {loading ? (
                                <LoadingSpinner message="Loading conversations..." />
                            ) : conversations.length === 0 ? (
                                <div className="p-3 text-center text-muted">
                                    <i className="fas fa-inbox fa-2x mb-2"></i>
                                    <p>No conversations yet</p>
                                </div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {conversations.map((conversation) => {
                                        const isUnread =
                                            conversation.unreadCount &&
                                            conversation.unreadCount[
                                                currentUser.uid
                                            ] > 0;

                                        return (
                                            <button
                                                key={conversation.id}
                                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-start ${
                                                    activeConversation?.id ===
                                                    conversation.id
                                                        ? 'active'
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    setActiveConversation(
                                                        conversation
                                                    )
                                                }
                                            >
                                                <div className="ms-2 me-auto">
                                                    <div
                                                        className={`fw-${
                                                            isUnread
                                                                ? 'bold'
                                                                : 'normal'
                                                        }`}
                                                    >
                                                        {conversation.jobTitle}
                                                    </div>
                                                    {conversation.lastMessage && (
                                                        <small
                                                            className={`text-${
                                                                isUnread
                                                                    ? 'dark'
                                                                    : 'muted'
                                                            }`}
                                                        >
                                                            {
                                                                conversation
                                                                    .lastMessage
                                                                    .text
                                                            }
                                                        </small>
                                                    )}
                                                </div>
                                                {isUnread && (
                                                    <span className="badge bg-danger rounded-pill">
                                                        <i className="fas fa-circle"></i>
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="col-md-8 col-lg-9">
                    <div className="card h-100">
                        {activeConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="card-header bg-light">
                                    <h6 className="mb-0">
                                        <i className="fas fa-briefcase me-2"></i>
                                        {activeConversation.jobTitle}
                                    </h6>
                                </div>

                                {/* Messages */}
                                <div
                                    className="card-body d-flex flex-column"
                                    style={{ height: '400px' }}
                                >
                                    <div className="flex-grow-1 overflow-auto mb-3">
                                        {messages.length === 0 ? (
                                            <div className="text-center text-muted mt-5">
                                                <i className="fas fa-comment-dots fa-3x mb-3"></i>
                                                <p>Start the conversation!</p>
                                            </div>
                                        ) : (
                                            messages.map((message) => (
                                                <div
                                                    key={message.id}
                                                    className={`d-flex mb-3 ${
                                                        message.senderId ===
                                                        currentUser.uid
                                                            ? 'justify-content-end'
                                                            : 'justify-content-start'
                                                    }`}
                                                >
                                                    <div
                                                        className={`rounded px-3 py-2 max-width-75 ${
                                                            message.senderId ===
                                                            currentUser.uid
                                                                ? 'bg-primary text-white'
                                                                : 'bg-light'
                                                        }`}
                                                        style={{
                                                            maxWidth: '75%',
                                                        }}
                                                    >
                                                        <div className="small fw-bold mb-1">
                                                            {message.senderName ||
                                                                (message.senderId ===
                                                                currentUser.uid
                                                                    ? 'You'
                                                                    : 'Recipient')}
                                                        </div>
                                                        <div>
                                                            {message.text}
                                                        </div>
                                                        <div className="small mt-1 opacity-75">
                                                            {formatMessageTime(
                                                                message.timestamp
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Message Input */}
                                    <form
                                        onSubmit={handleSendMessage}
                                        className="mt-auto"
                                    >
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Type your message..."
                                                value={newMessage}
                                                onChange={(e) =>
                                                    setNewMessage(
                                                        e.target.value
                                                    )
                                                }
                                                disabled={sendLoading}
                                            />
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={
                                                    !newMessage.trim() ||
                                                    sendLoading
                                                }
                                            >
                                                {sendLoading ? (
                                                    <span className="spinner-border spinner-border-sm" />
                                                ) : (
                                                    <i className="fas fa-paper-plane"></i>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="card-body d-flex align-items-center justify-content-center">
                                <div className="text-center text-muted">
                                    <i className="fas fa-comments fa-4x mb-3"></i>
                                    <h5>Select a conversation</h5>
                                    <p>
                                        Choose a conversation from the list to
                                        start messaging
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
