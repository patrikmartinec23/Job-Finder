import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div className="d-flex justify-content-center align-items-center py-5">
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="mt-2 text-muted">{message}</div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
