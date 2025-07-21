import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle, error } = useAuth();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
        if (!formData.email || !formData.password) {
            setFormError('Please fill in all fields');
            return false;
        }

        if (!formData.email.includes('@')) {
            setFormError('Please enter a valid email address');
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
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setFormError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);
            setFormError('');
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            setFormError(err.message);
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            {/* Header */}
                            <div className="text-center mb-4">
                                <i className="fas fa-sign-in-alt fa-3x text-primary mb-3"></i>
                                <h1 className="h3">Welcome Back</h1>
                                <p className="text-muted">
                                    Sign in to your account
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

                            {/* Login Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
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
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
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
                                </div>

                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="rememberMe"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="rememberMe"
                                    >
                                        Remember me
                                    </label>
                                </div>

                                <div className="d-grid">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading || googleLoading}
                                    >
                                        {loading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                ></span>
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-sign-in-alt me-2"></i>
                                                Sign In
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Google Sign In */}
                            <div className="mt-3">
                                <div className="text-center mb-2">
                                    <small className="text-muted">or</small>
                                </div>
                                <div className="d-grid">
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={handleGoogleLogin}
                                        disabled={loading || googleLoading}
                                    >
                                        {googleLoading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                ></span>
                                                Signing in with Google...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fab fa-google me-2"></i>
                                                Continue with Google
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Divider */}
                            <hr className="my-4" />

                            {/* Additional Links */}
                            <div className="text-center">
                                <p className="mb-2">
                                    <Link
                                        to="/forgot-password"
                                        className="text-decoration-none"
                                    >
                                        Forgot your password?
                                    </Link>
                                </p>
                                <p className="mb-0">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/register"
                                        className="text-decoration-none"
                                    >
                                        Sign up here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Demo Credentials */}
                    <div className="card mt-3">
                        <div className="card-body">
                            <h6 className="card-title">
                                <i className="fas fa-info-circle me-2"></i>
                                Demo Credentials
                            </h6>
                            <p className="card-text small text-muted mb-2">
                                For testing purposes, you can use:
                            </p>
                            <div className="small">
                                <strong>Email:</strong> demo@jobfinder.com
                                <br />
                                <strong>Password:</strong> demo123456
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
