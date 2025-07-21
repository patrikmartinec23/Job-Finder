import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    const formatSalary = (salary) => {
        if (!salary) return 'Salary not specified';
        return `$${salary.toLocaleString()}`;
    };

    const formatDate = (date) => {
        if (!date) return '';
        const jobDate = date.toDate ? date.toDate() : new Date(date);
        return jobDate.toLocaleDateString();
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

    return (
        <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title text-primary mb-0">
                            {job.title}
                        </h5>
                        <span
                            className={`badge bg-${getJobTypeColor(
                                job.jobtype
                            )} ms-2`}
                        >
                            {job.jobtype || 'Not specified'}
                        </span>
                    </div>

                    <h6 className="card-subtitle mb-2 text-muted">
                        <i className="fas fa-building me-1"></i>
                        {job.company}
                    </h6>

                    <div className="mb-2">
                        <small className="text-muted">
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {job.location}
                        </small>
                    </div>

                    <div className="mb-2">
                        <small className="text-success fw-bold">
                            <i className="fas fa-dollar-sign me-1"></i>
                            {formatSalary(job.salary)}
                        </small>
                    </div>

                    <p className="card-text flex-grow-1">
                        {job.description?.length > 120
                            ? `${job.description.substring(0, 120)}...`
                            : job.description}
                    </p>

                    <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                                <i className="fas fa-calendar me-1"></i>
                                {formatDate(job.createdAt)}
                            </small>
                            <Link
                                to={`/job/${job.id}`}
                                className="btn btn-primary btn-sm"
                            >
                                View Details
                                <i className="fas fa-arrow-right ms-1"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
