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
        <div className={`currency-rates-info ${className}`}>
            <div className="p-3">
                <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-exchange-alt me-2 text-primary"></i>
                    <strong className="small">Live Exchange Rates</strong>
                </div>
                <div className="row small text-muted">
                    <div className="col-6">
                        {rates &&
                            Object.entries(rates).map(([key, value]) => {
                                if (
                                    key === 'lastUpdated' ||
                                    key.includes('to USD')
                                ) {
                                    return null;
                                }
                                return (
                                    <div key={key} className="mb-1">
                                        {value}
                                    </div>
                                );
                            })}
                    </div>
                    <div className="col-6">
                        {rates &&
                            Object.entries(rates).map(([key, value]) => {
                                if (
                                    key === 'lastUpdated' ||
                                    key.includes('USD to')
                                ) {
                                    return null;
                                }
                                if (key.includes('to USD')) {
                                    return (
                                        <div key={key} className="mb-1">
                                            {value}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                    </div>
                </div>
                {rates && rates.lastUpdated && (
                    <div className="text-center mt-2 pt-2 border-top">
                        <small className="text-muted">
                            <i className="fas fa-clock me-1"></i>
                            Updated: {rates.lastUpdated}
                        </small>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrencyRatesInfo;
