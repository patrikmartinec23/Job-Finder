import React from 'react';
import { useJobs } from '../context/JobContext';

const JobFilters = () => {
    const { filters, updateFilters, clearFilters } = useJobs();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateFilters({ [name]: value });
    };

    const handleClearFilters = () => {
        clearFilters();
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-warning">
                <h5 className="card-title mb-0">
                    <i className="fas fa-filter me-2"></i>
                    Filter Jobs
                </h5>
            </div>
            <div className="card-body">
                <form>
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <label htmlFor="search" className="form-label">
                                <i className="fas fa-search me-1"></i>
                                Search
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="search"
                                name="search"
                                placeholder="Job title, company, or keyword..."
                                value={filters.search}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <label htmlFor="location" className="form-label">
                                <i className="fas fa-map-marker-alt me-1"></i>
                                Location
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="location"
                                name="location"
                                placeholder="City, state, or remote..."
                                value={filters.location}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <label htmlFor="jobType" className="form-label">
                                <i className="fas fa-briefcase me-1"></i>
                                Job Type
                            </label>
                            <select
                                className="form-select"
                                id="jobType"
                                name="jobType"
                                value={filters.jobType}
                                onChange={handleInputChange}
                            >
                                <option value="">All Types</option>
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="freelance">Freelance</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                            </select>
                        </div>

                        <div className="col-12 col-md-6">
                            <label htmlFor="salaryRange" className="form-label">
                                <i className="fas fa-dollar-sign me-1"></i>
                                Salary Range
                            </label>
                            <select
                                className="form-select"
                                id="salaryRange"
                                name="salaryRange"
                                value={filters.salaryRange}
                                onChange={handleInputChange}
                            >
                                <option value="">All Salaries</option>
                                <option value="0-30000">$0 - $30,000</option>
                                <option value="30000-50000">
                                    $30,000 - $50,000
                                </option>
                                <option value="50000-80000">
                                    $50,000 - $80,000
                                </option>
                                <option value="80000+">$80,000+</option>
                            </select>
                        </div>

                        <div className="col-12">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handleClearFilters}
                            >
                                <i className="fas fa-times me-1"></i>
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobFilters;
