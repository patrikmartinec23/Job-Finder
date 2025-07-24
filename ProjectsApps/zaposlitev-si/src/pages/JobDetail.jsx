import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ApplyToJob from '../components/ApplyToJob';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getJobById, deleteJob } = useJobs();
    const { currentUser } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                const jobData = await getJobById(id);
                setJob(jobData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id, getJobById]);

    const formatSalary = (salary) => {
        if (!salary) return 'Salary not specified';
        return `$${salary.toLocaleString()}`;
    };

    const formatDate = (date) => {
        if (!date) return '';
        const jobDate = date.toDate ? date.toDate() : new Date(date);
        return jobDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getJobTypeColor = (type) => {
        switch (type) {
            case 'full-time':
                return 'success';
            case 'part-time':
                return 'warning';
            case 'freelance':
                return 'info';
            case 'contract':
                return 'secondary';
            default:
                return 'primary';
        }
    };

    const handleDeleteJob = async () => {
        if (
            !window.confirm(
                'Are you sure you want to delete this job post? This action cannot be undone.'
            )
        ) {
            return;
        }

        try {
            setDeleteLoading(true);
            await deleteJob(id);
            navigate('/', { replace: true });
        } catch (err) {
            setError('Failed to delete job post. Please try again.');
            console.error('Error deleting job:', err);
        } finally {
            setDeleteLoading(false);
        }
    };

    // Check if current user is the owner of this job
    const isOwner = currentUser && job && currentUser.uid === job.postedBy;

    if (loading) {
        return <LoadingSpinner message="Loading job details..." />;
    }

    if (error) {
        return (
            <div className="container py-4">
                <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/')}
                >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Jobs
                </button>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="container py-4">
                <div className="alert alert-warning" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Job not found
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/')}
                >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Jobs
                </button>
            </div>
        );
    }

    return (
        <div className="container py-4">
            {/* Back Button */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate('/')}
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            Back to Jobs
                        </button>

                        <div className="d-flex gap-2">
                            {/* Apply Button - show if not owner and user is logged in */}
                            {!isOwner && currentUser && (
                                <button
                                    className="btn btn-success"
                                    onClick={() => setShowApplyModal(true)}
                                >
                                    <i className="fas fa-paper-plane me-2"></i>
                                    Apply for Job
                                </button>
                            )}

                            {/* Owner Actions */}
                            {isOwner && (
                                <>
                                    <button
                                        className="btn btn-outline-warning"
                                        onClick={() =>
                                            navigate(`/edit-job/${id}`)
                                        }
                                        disabled={deleteLoading}
                                    >
                                        <i className="fas fa-edit me-2"></i>
                                        Edit Job
                                    </button>
                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={handleDeleteJob}
                                        disabled={deleteLoading}
                                    >
                                        {deleteLoading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                ></span>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-trash me-2"></i>
                                                Delete Job
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card shadow">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-12 col-md-8">
                                    <h1 className="h2 text-primary mb-2">
                                        {job.title}
                                    </h1>
                                    <h2 className="h4 text-muted mb-3">
                                        <i className="fas fa-building me-2"></i>
                                        {job.company}
                                    </h2>
                                    <div className="row g-3">
                                        <div className="col-auto">
                                            <span
                                                className={`badge bg-${getJobTypeColor(
                                                    job.jobtype
                                                )} fs-6`}
                                            >
                                                {job.jobtype || 'Not specified'}
                                            </span>
                                        </div>
                                        <div className="col-auto">
                                            <span className="text-muted">
                                                <i className="fas fa-map-marker-alt me-1"></i>
                                                {job.location}
                                            </span>
                                        </div>
                                        <div className="col-auto">
                                            <span className="text-success fw-bold">
                                                <i className="fas fa-dollar-sign me-1"></i>
                                                {formatSalary(job.salary)}
                                            </span>
                                        </div>
                                        <div className="col-auto">
                                            <span className="text-muted">
                                                <i className="fas fa-calendar me-1"></i>
                                                Posted{' '}
                                                {formatDate(job.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 text-md-end">
                                    <div className="d-flex flex-column gap-2">
                                        {!isOwner && (
                                            <button className="btn btn-success btn-lg">
                                                <i className="fas fa-paper-plane me-2"></i>
                                                Apply Now
                                            </button>
                                        )}
                                        {isOwner && (
                                            <>
                                                <button
                                                    className="btn btn-warning btn-lg"
                                                    onClick={() =>
                                                        navigate(
                                                            `/edit-job/${id}`
                                                        )
                                                    }
                                                    disabled={deleteLoading}
                                                >
                                                    <i className="fas fa-edit me-2"></i>
                                                    Edit Job
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={handleDeleteJob}
                                                    disabled={deleteLoading}
                                                >
                                                    {deleteLoading ? (
                                                        <>
                                                            <span
                                                                className="spinner-border spinner-border-sm me-2"
                                                                role="status"
                                                            ></span>
                                                            Deleting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-trash me-2"></i>
                                                            Delete Job
                                                        </>
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Details */}
            <div className="row">
                <div className="col-12 col-lg-8">
                    {/* Job Description */}
                    <div className="card shadow mb-4">
                        <div className="card-header">
                            <h3 className="h5 mb-0">
                                <i className="fas fa-file-alt me-2"></i>
                                Job Description
                            </h3>
                        </div>
                        <div className="card-body">
                            <div className="job-description">
                                {job.description ? (
                                    job.description
                                        .split('\n')
                                        .map((paragraph, index) => (
                                            <p key={index}>{paragraph}</p>
                                        ))
                                ) : (
                                    <p className="text-muted">
                                        No description provided.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Requirements */}
                    {job.requirements && (
                        <div className="card shadow mb-4">
                            <div className="card-header">
                                <h3 className="h5 mb-0">
                                    <i className="fas fa-list-check me-2"></i>
                                    Requirements
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className="requirements">
                                    {job.requirements
                                        .split('\n')
                                        .map((requirement, index) => (
                                            <p key={index}>{requirement}</p>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Benefits */}
                    {job.benefits && (
                        <div className="card shadow mb-4">
                            <div className="card-header">
                                <h3 className="h5 mb-0">
                                    <i className="fas fa-gift me-2"></i>
                                    Benefits
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className="benefits">
                                    {job.benefits
                                        .split('\n')
                                        .map((benefit, index) => (
                                            <p key={index}>{benefit}</p>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="col-12 col-lg-4">
                    {/* Company Info */}
                    <div className="card shadow mb-4">
                        <div className="card-header">
                            <h3 className="h5 mb-0">
                                <i className="fas fa-building me-2"></i>
                                Company Information
                            </h3>
                        </div>
                        <div className="card-body">
                            <h4 className="h6">{job.company}</h4>
                            {job.companyDescription && (
                                <p className="text-muted small">
                                    {job.companyDescription}
                                </p>
                            )}
                            {job.companyWebsite && (
                                <a
                                    href={job.companyWebsite}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-primary btn-sm"
                                >
                                    <i className="fas fa-external-link-alt me-1"></i>
                                    Visit Website
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Apply */}
                    <div className="card shadow">
                        <div className="card-header">
                            <h3 className="h5 mb-0">
                                <i className="fas fa-paper-plane me-2"></i>
                                Quick Apply
                            </h3>
                        </div>
                        <div className="card-body">
                            {!isOwner && currentUser ? (
                                <>
                                    <p className="text-muted small mb-3">
                                        Ready to apply? Click the button below
                                        to submit your application.
                                    </p>
                                    <button
                                        className="btn btn-success w-100 mb-2"
                                        onClick={() => setShowApplyModal(true)}
                                    >
                                        <i className="fas fa-paper-plane me-2"></i>
                                        Apply Now
                                    </button>
                                </>
                            ) : !currentUser ? (
                                <>
                                    <p className="text-muted small mb-3">
                                        Please log in to apply for this job.
                                    </p>
                                    <button
                                        className="btn btn-primary w-100 mb-2"
                                        onClick={() => navigate('/login')}
                                    >
                                        <i className="fas fa-sign-in-alt me-2"></i>
                                        Login to Apply
                                    </button>
                                </>
                            ) : (
                                <p className="text-muted small">
                                    This is your job posting.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <ApplyToJob
                    job={job}
                    onClose={() => setShowApplyModal(false)}
                />
            )}
        </div>
    );
};

export default JobDetail;
