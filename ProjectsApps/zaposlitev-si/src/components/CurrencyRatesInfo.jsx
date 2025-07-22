import React, { useState, useEffect } from 'react';
import { getFormattedExchangeRates } from '../utils/helpers';

const CurrencyRatesInfo = ({ className = '' }) => {
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                setLoading(true);
                const formattedRates = await getFormattedExchangeRates();
                setRates(formattedRates);
                setError(null);
            } catch (err) {
                setError('Failed to fetch exchange rates');
                console.error('Error fetching currency rates:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, []);

    if (loading) {
        return (
            <div className={`text-muted ${className}`}>
                <small>
                    <i className="fas fa-spinner fa-spin me-1"></i>
                    Loading exchange rates...
                </small>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`text-warning ${className}`}>
                <small>
                    <i className="fas fa-exclamation-triangle me-1"></i>
                    {error}
                </small>
            </div>
        );
    }

    return (
        <div className={`${className}`}>
            <small className="text-muted">
                <strong>Current Exchange Rates:</strong>
                <br />
                {rates &&
                    Object.entries(rates).map(([key, value]) => {
                        if (key === 'lastUpdated') {
                            return (
                                <span key={key} className="d-block mt-1">
                                    <i className="fas fa-clock me-1"></i>
                                    Last updated: {value}
                                </span>
                            );
                        }
                        return (
                            <span key={key} className="d-block">
                                {value}
                            </span>
                        );
                    })}
            </small>
        </div>
    );
};

export default CurrencyRatesInfo;
