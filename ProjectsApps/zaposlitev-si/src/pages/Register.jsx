import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register, error } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [formError, setFormError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const { firstName, lastName, email, password, confirmPassword } =
            formData;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            setFormError('Please fill in all fields');
            return false;
        }

        if (!email.includes('@')) {
            setFormError('Please enter a valid email address');
            return false;
        }

        if (password.length < 6) {
            setFormError('Password must be at least 6 characters long');
            return false;
        }

        if (password !== confirmPassword) {
            setFormError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const displayName = `${formData.firstName} ${formData.lastName}`;

            await register(formData.email, formData.password, displayName, {
                firstName: formData.firstName,
                lastName: formData.lastName,
            });

            navigate('/');
        } catch (err) {
            setFormError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-5">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            {/* Header */}
                            <div className="text-center mb-4">
                                <i className="fas fa-user-plus fa-3x text-primary mb-3"></i>
                                <h1 className="h3">Create Account</h1>
                                <p className="text-muted">
                                    Join JobFinder today
                                </p>
                            </div>

                            {/* Error Messages */}
                            {(formError || error) && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    {formError || error}
                                </div>
                            )}

                            {/* Registration Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-12 col-sm-6">
                                        <label
                                            htmlFor="firstName"
                                            className="form-label"
                                        >
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="John"
                                            required
                                        />
                                    </div>

                                    <div className="col-12 col-sm-6">
                                        <label
                                            htmlFor="lastName"
                                            className="form-label"
                                        >
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Doe"
                                            required
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label
                                            htmlFor="email"
                                            className="form-label"
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john.doe@example.com"
                                            required
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label
                                            htmlFor="password"
                                            className="form-label"
                                        >
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <div className="form-text">
                                            Password must be at least 6
                                            characters long
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label
                                            htmlFor="confirmPassword"
                                            className="form-label"
                                        >
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Confirm your password"
                                            required
                                        />
                                    </div>

                                    <div className="col-12">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="agreeToTerms"
                                                required
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="agreeToTerms"
                                            >
                                                I agree to the{' '}
                                                <a
                                                    href="#"
                                                    className="text-decoration-none"
                                                >
                                                    Terms of Service
                                                </a>{' '}
                                                and{' '}
                                                <a
                                                    href="#"
                                                    className="text-decoration-none"
                                                >
                                                    Privacy Policy
                                                </a>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="d-grid">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm me-2"
                                                            role="status"
                                                        ></span>
                                                        Creating account...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-user-plus me-2"></i>
                                                        Create Account
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            {/* Divider */}
                            <hr className="my-4" />

                            {/* Additional Links */}
                            <div className="text-center">
                                <p className="mb-0">
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        className="text-decoration-none"
                                    >
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Benefits Card */}
                    <div className="card mt-3">
                        <div className="card-body">
                            <h6 className="card-title">
                                <i className="fas fa-star me-2"></i>
                                Why Join JobFinder?
                            </h6>
                            <ul className="list-unstyled small mb-0">
                                <li className="mb-1">
                                    <i className="fas fa-check text-success me-2"></i>
                                    Access to thousands of job opportunities
                                </li>
                                <li className="mb-1">
                                    <i className="fas fa-check text-success me-2"></i>
                                    Advanced job filtering and search
                                </li>
                                <li className="mb-1">
                                    <i className="fas fa-check text-success me-2"></i>
                                    Direct connection with employers
                                </li>
                                <li>
                                    <i className="fas fa-check text-success me-2"></i>
                                    Mobile-friendly experience
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
