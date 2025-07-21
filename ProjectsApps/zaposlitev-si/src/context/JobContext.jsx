import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    collection,
    getDocs,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    where,
} from 'firebase/firestore';
import { db } from '../services/firebase';

const JobContext = createContext();

export const useJobs = () => {
    const context = useContext(JobContext);
    if (!context) {
        throw new Error('useJobs must be used within a JobProvider');
    }
    return context;
};

export const JobProvider = ({ children }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        jobType: '',
        location: '',
        salaryRange: '',
    });

    // Fetch all jobs from Firestore
    const fetchJobs = async () => {
        try {
            setLoading(true);
            const jobsCollection = collection(db, 'jobs');
            const jobsQuery = query(
                jobsCollection,
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(jobsQuery);

            const jobsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setJobs(jobsData);
            setError(null);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    // Add a new job
    const addJob = async (jobData) => {
        try {
            const jobWithTimestamp = {
                ...jobData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const docRef = await addDoc(
                collection(db, 'jobs'),
                jobWithTimestamp
            );
            const newJob = { id: docRef.id, ...jobWithTimestamp };
            setJobs((prevJobs) => [newJob, ...prevJobs]);
            return newJob;
        } catch (err) {
            console.error('Error adding job:', err);
            throw new Error('Failed to add job');
        }
    };

    // Get a single job by ID
    const getJobById = async (jobId) => {
        try {
            const jobDoc = doc(db, 'jobs', jobId);
            const jobSnapshot = await getDoc(jobDoc);

            if (jobSnapshot.exists()) {
                return { id: jobSnapshot.id, ...jobSnapshot.data() };
            } else {
                throw new Error('Job not found');
            }
        } catch (err) {
            console.error('Error fetching job:', err);
            throw new Error('Failed to fetch job');
        }
    };

    // Update a job
    const updateJob = async (jobId, updates) => {
        try {
            const jobDoc = doc(db, 'jobs', jobId);
            const updateData = {
                ...updates,
                updatedAt: new Date(),
            };

            await updateDoc(jobDoc, updateData);
            setJobs((prevJobs) =>
                prevJobs.map((job) =>
                    job.id === jobId ? { ...job, ...updateData } : job
                )
            );
        } catch (err) {
            console.error('Error updating job:', err);
            throw new Error('Failed to update job');
        }
    };

    // Delete a job
    const deleteJob = async (jobId) => {
        try {
            await deleteDoc(doc(db, 'jobs', jobId));
            setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
        } catch (err) {
            console.error('Error deleting job:', err);
            throw new Error('Failed to delete job');
        }
    };

    // Filter jobs based on current filters
    const getFilteredJobs = () => {
        return jobs.filter((job) => {
            const matchesSearch =
                !filters.search ||
                job.title
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) ||
                job.company
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) ||
                job.description
                    .toLowerCase()
                    .includes(filters.search.toLowerCase());

            const matchesJobType =
                !filters.jobType || job.jobtype === filters.jobType;
            const matchesLocation =
                !filters.location ||
                job.location
                    .toLowerCase()
                    .includes(filters.location.toLowerCase());

            const matchesSalary =
                !filters.salaryRange ||
                (job.salary >= getSalaryRange(filters.salaryRange).min &&
                    job.salary <= getSalaryRange(filters.salaryRange).max);

            return (
                matchesSearch &&
                matchesJobType &&
                matchesLocation &&
                matchesSalary
            );
        });
    };

    // Helper function to convert salary range string to min/max values
    const getSalaryRange = (range) => {
        switch (range) {
            case '0-30000':
                return { min: 0, max: 30000 };
            case '30000-50000':
                return { min: 30000, max: 50000 };
            case '50000-80000':
                return { min: 50000, max: 80000 };
            case '80000+':
                return { min: 80000, max: Infinity };
            default:
                return { min: 0, max: Infinity };
        }
    };

    // Update filters
    const updateFilters = (newFilters) => {
        setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            search: '',
            jobType: '',
            location: '',
            salaryRange: '',
        });
    };

    // Fetch jobs on component mount
    useEffect(() => {
        fetchJobs();
    }, []);

    const value = {
        jobs,
        loading,
        error,
        filters,
        filteredJobs: getFilteredJobs(),
        fetchJobs,
        addJob,
        getJobById,
        updateJob,
        deleteJob,
        updateFilters,
        clearFilters,
    };

    return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};
