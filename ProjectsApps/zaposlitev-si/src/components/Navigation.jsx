import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    <i className="fas fa-briefcase me-2"></i>
                    JobFinder
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-controls="navbarNav"
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className={`collapse navbar-collapse ${
                        isOpen ? 'show' : ''
                    }`}
                    id="navbarNav"
                >
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/"
                                onClick={() => setIsOpen(false)}
                            >
                                <i className="fas fa-home me-1"></i>
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/post-job"
                                onClick={() => setIsOpen(false)}
                            >
                                <i className="fas fa-plus me-1"></i>
                                Post a Job
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/about"
                                onClick={() => setIsOpen(false)}
                            >
                                <i className="fas fa-info-circle me-1"></i>
                                About
                            </Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <ThemeToggle className="nav-link border-0 bg-transparent" />
                        </li>

                        {currentUser ? (
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fas fa-user me-1"></i>
                                    {currentUser.displayName ||
                                        currentUser.email}
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={handleLogout}
                                        >
                                            <i className="fas fa-sign-out-alt me-1"></i>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <i className="fas fa-sign-in-alt me-1"></i>
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/register"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <i className="fas fa-user-plus me-1"></i>
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
