import { useState } from 'react';
import { useJobs } from '../context/JobContext';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
    const { filteredJobs, loading, error } = useJobs();
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(6);

    // Calculate pagination
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return <LoadingSpinner message="Loading jobs..." />;
    }

    return (
        <div className="container py-4">
            {/* Hero Section */}
            <div className="row mb-5">
                <div className="col-12">
                    <div className="bg-primary text-white rounded p-5 text-center">
                        <h1 className="display-4 mb-3">Find Your Dream Job</h1>
                        <p className="lead mb-0">
                            Discover thousands of job opportunities from top
                            companies
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <JobFilters />

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                </div>
            )}

            {/* Job Stats */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="h4 mb-0">
                            {filteredJobs.length === 0
                                ? 'No jobs found'
                                : `${filteredJobs.length} job${
                                      filteredJobs.length !== 1 ? 's' : ''
                                  } found`}
                        </h2>
                        {filteredJobs.length > 0 && (
                            <small className="text-muted">
                                Showing {indexOfFirstJob + 1}-
                                {Math.min(indexOfLastJob, filteredJobs.length)}{' '}
                                of {filteredJobs.length}
                            </small>
                        )}
                    </div>
                </div>
            </div>

            {/* Job Listings */}
            {filteredJobs.length === 0 ? (
                <div className="text-center py-5">
                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                    <h3 className="text-muted">No jobs match your criteria</h3>
                    <p className="text-muted">
                        Try adjusting your filters or search terms
                    </p>
                </div>
            ) : (
                <>
                    <div className="row">
                        {currentJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <nav
                            aria-label="Job listings pagination"
                            className="mt-4"
                        >
                            <ul className="pagination justify-content-center">
                                <li
                                    className={`page-item ${
                                        currentPage === 1 ? 'disabled' : ''
                                    }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                </li>

                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;
                                    return (
                                        <li
                                            key={pageNumber}
                                            className={`page-item ${
                                                currentPage === pageNumber
                                                    ? 'active'
                                                    : ''
                                            }`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() =>
                                                    handlePageChange(pageNumber)
                                                }
                                            >
                                                {pageNumber}
                                            </button>
                                        </li>
                                    );
                                })}

                                <li
                                    className={`page-item ${
                                        currentPage === totalPages
                                            ? 'disabled'
                                            : ''
                                    }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
