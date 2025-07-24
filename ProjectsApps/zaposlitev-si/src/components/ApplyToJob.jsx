import React, { useState } from 'react';
import { useMessages } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ApplyToJob = ({ job, onClose }) => {
    const { currentUser } = useAuth();
    const { createJobConversation, sendMessage } = useMessages();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Create conversation
            const conversation = await createJobConversation(
                job.id,
                job.title,
                job.postedBy,
                currentUser.uid
            );

            // Send initial message if provided
            if (message.trim()) {
                await sendMessage(conversation.id, message, job.postedBy);
            }

            // Navigate to messages
            navigate('/messages');
            onClose();
        } catch (err) {
            setError('Failed to send application. Please try again.');
            console.error('Error applying to job:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return (
            <div
                className="modal fade show d-block"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Login Required</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p>You need to be logged in to apply for jobs.</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="fas fa-paper-plane me-2"></i>
                            Apply to Job
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <form onSubmit={handleApply}>
                        <div className="modal-body">
                            {error && (
                                <div className="alert alert-danger">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                            )}

                            <div className="mb-3">
                                <strong>Position:</strong> {job.title}
                            </div>
                            <div className="mb-3">
                                <strong>Company:</strong> {job.company}
                            </div>

                            <div className="mb-3">
                                <label
                                    htmlFor="applicationMessage"
                                    className="form-label"
                                >
                                    Cover Message (Optional)
                                </label>
                                <textarea
                                    className="form-control"
                                    id="applicationMessage"
                                    rows="4"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Write a brief message to the employer about why you're interested in this position..."
                                />
                            </div>

                            <div className="alert alert-info">
                                <i className="fas fa-info-circle me-2"></i>
                                Your application will create a conversation with
                                the employer where you can exchange messages.
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Applying...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-paper-plane me-2"></i>
                                        Send Application
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplyToJob;
