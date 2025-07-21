import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Register new user
    const register = async (
        email,
        password,
        displayName,
        additionalData = {}
    ) => {
        try {
            setError(null);
            const { user } = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // Update user profile
            await updateProfile(user, { displayName });

            // Create user document in Firestore
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName,
                createdAt: new Date(),
                ...additionalData,
            };

            await setDoc(doc(db, 'users', user.uid), userData);

            return user;
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message);
            throw err;
        }
    };

    // Sign in user
    const login = async (email, password) => {
        try {
            setError(null);
            const { user } = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            return user;
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
            throw err;
        }
    };

    // Sign in with Google
    const loginWithGoogle = async () => {
        try {
            setError(null);
            const provider = new GoogleAuthProvider();
            const { user } = await signInWithPopup(auth, provider);

            // Check if user document exists, if not create it
            const userDoc = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userDoc);

            if (!userSnapshot.exists()) {
                // Create user document for new Google users
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    firstName: user.displayName?.split(' ')[0] || '',
                    lastName:
                        user.displayName?.split(' ').slice(1).join(' ') || '',
                    photoURL: user.photoURL,
                    createdAt: new Date(),
                };
                await setDoc(userDoc, userData);
            }

            return user;
        } catch (err) {
            console.error('Google login error:', err);
            setError(err.message);
            throw err;
        }
    };

    // Sign out user
    const logout = async () => {
        try {
            setError(null);
            await signOut(auth);
        } catch (err) {
            console.error('Logout error:', err);
            setError(err.message);
            throw err;
        }
    };

    // Get user data from Firestore
    const getUserData = async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                return userDoc.data();
            }
            return null;
        } catch (err) {
            console.error('Error fetching user data:', err);
            return null;
        }
    };

    // Update user profile
    const updateUserProfile = async (updates) => {
        try {
            setError(null);
            if (currentUser) {
                // Update Firebase Auth profile
                if (updates.displayName) {
                    await updateProfile(currentUser, {
                        displayName: updates.displayName,
                    });
                }

                // Update Firestore document
                await setDoc(
                    doc(db, 'users', currentUser.uid),
                    {
                        ...updates,
                        updatedAt: new Date(),
                    },
                    { merge: true }
                );
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message);
            throw err;
        }
    };

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Get additional user data from Firestore
                const userData = await getUserData(user.uid);
                setCurrentUser({
                    ...user,
                    ...userData,
                });
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
        error,
        register,
        login,
        loginWithGoogle,
        logout,
        updateUserProfile,
        getUserData,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
