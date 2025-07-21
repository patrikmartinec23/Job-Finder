import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getJobById, updateJob } = useJobs();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        jobtype: 'full-time',
        salary: '',
        description: '',
        requirements: '',
    });

    // Fetch job data on component mount
    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                const jobData = await getJobById(id);

                // Check if current user is the owner
                if (!currentUser || currentUser.uid !== jobData.postedBy) {
                    navigate('/', { replace: true });
                    return;
                }

                // Populate form with existing data
                setFormData({
                    title: jobData.title || '',
                    company: jobData.company || '',
                    location: jobData.location || '',
                    jobtype: jobData.jobtype || 'full-time',
                    salary: jobData.salary || '',
                    description: jobData.description || '',
                    requirements: jobData.requirements || '',
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchJob();
        }
    }, [id, getJobById, currentUser, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const { title, company, location, description } = formData;
        if (
            !title.trim() ||
            !company.trim() ||
            !location.trim() ||
            !description.trim()
        ) {
            return 'Please fill in all required fields.';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitLoading(true);
        setError(null);

        try {
            // Convert salary to number if provided
            const updateData = {
                ...formData,
                salary: formData.salary ? Number(formData.salary) : null,
            };

            await updateJob(id, updateData);
            setSuccess(true);

            // Redirect to job detail page after successful update
            setTimeout(() => {
                navigate(`/job/${id}`);
            }, 2000);
        } catch (err) {
            setError('Failed to update job. Please try again.');
            console.error('Error updating job:', err);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (!currentUser) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="alert alert-warning text-center">
                            <h4>Authentication Required</h4>
                            <p>You must be logged in to edit a job.</p>
                            <button
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

    if (loading) {
        return <LoadingSpinner message="Loading job details..." />;
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header bg-warning text-dark">
                            <h3 className="mb-0">
                                <i className="fas fa-edit me-2"></i>
                                Edit Job Post
                            </h3>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div
                                    className="alert alert-success"
                                    role="alert"
                                >
                                    <i className="fas fa-check-circle me-2"></i>
                                    Job updated successfully! Redirecting to job
                                    details...
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    {/* Job Title */}
                                    <div className="col-12 mb-3">
                                        <label
                                            htmlFor="title"
                                            className="form-label"
                                        >
                                            Job Title{' '}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Senior React Developer"
                                            required
                                        />
                                    </div>

                                    {/* Company */}
                                    <div className="col-12 col-md-6 mb-3">
                                        <label
                                            htmlFor="company"
                                            className="form-label"
                                        >
                                            Company{' '}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Tech Company Inc."
                                            required
                                        />
                                    </div>

                                    {/* Location */}
                                    <div className="col-12 col-md-6 mb-3">
                                        <label
                                            htmlFor="location"
                                            className="form-label"
                                        >
                                            Location{' '}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="e.g. New York, NY or Remote"
                                            required
                                        />
                                    </div>

                                    {/* Job Type */}
                                    <div className="col-12 col-md-6 mb-3">
                                        <label
                                            htmlFor="jobtype"
                                            className="form-label"
                                        >
                                            Job Type
                                        </label>
                                        <select
                                            className="form-select"
                                            id="jobtype"
                                            name="jobtype"
                                            value={formData.jobtype}
                                            onChange={handleInputChange}
                                        >
                                            <option value="full-time">
                                                Full-time
                                            </option>
                                            <option value="part-time">
                                                Part-time
                                            </option>
                                            <option value="freelance">
                                                Freelance
                                            </option>
                                            <option value="contract">
                                                Contract
                                            </option>
                                            <option value="internship">
                                                Internship
                                            </option>
                                        </select>
                                    </div>

                                    {/* Salary */}
                                    <div className="col-12 col-md-6 mb-3">
                                        <label
                                            htmlFor="salary"
                                            className="form-label"
                                        >
                                            Salary (Annual)
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="salary"
                                            name="salary"
                                            value={formData.salary}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 80000"
                                            min="0"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="col-12 mb-3">
                                        <label
                                            htmlFor="description"
                                            className="form-label"
                                        >
                                            Job Description{' '}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            rows="4"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Describe the job role, responsibilities, and what you're looking for..."
                                            required
                                        ></textarea>
                                    </div>

                                    {/* Requirements */}
                                    <div className="col-12 mb-3">
                                        <label
                                            htmlFor="requirements"
                                            className="form-label"
                                        >
                                            Requirements
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="requirements"
                                            name="requirements"
                                            rows="3"
                                            value={formData.requirements}
                                            onChange={handleInputChange}
                                            placeholder="List the skills, experience, and qualifications required..."
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary me-md-2"
                                        onClick={() => navigate(`/job/${id}`)}
                                        disabled={submitLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-warning"
                                        disabled={submitLoading}
                                    >
                                        {submitLoading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save me-2"></i>
                                                Update Job
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditJob;
