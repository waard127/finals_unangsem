// src/App.js

import React, { useState, useEffect } from 'react'; 
import Dashboard from './components/assets/Dashboard/Dashboard.jsx'; 
import LoginSignUp from './components/assets/Loginsignin/LoginSignUp.jsx';
import ReportsLayout from './components/assets/Reports/ReportsLayout.jsx'; 
import ProfileLayout from './components/assets/Profile/ProfileLayout.jsx'; 
import './App.css';

// --- NEW IMPORT: Loading Animation Component ---
import LoadingAnimation from './components/assets/LoadingAnimation/LoadingAnimation.jsx'; 
// --------------------------------------------- 

// --- IMPORTS for Profile Data Fetching in App.js ---
import { auth, db } from './apiService'; 
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 
// ----------------------------------------------------

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard'); 
    const [profileData, setProfileData] = useState(null); 
    
    // NEW STATE: True when the 30s timer is complete, triggers final animation phase
    const [isDataReady, setIsDataReady] = useState(false); 
    
    // NEW STATE: True only after the final 2s exit animation is done, triggers dashboard mount
    const [showMainContent, setShowMainContent] = useState(false); 
    
    // Ref to hold data once fetched (regardless of the timer)
    const dataRef = React.useRef(null);


    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setProfileData(null); 
        // Reset flags on logout
        setIsDataReady(false);
        setShowMainContent(false); 
        setCurrentPage('dashboard');
    };

    // --- EFFECT: Handle Data Loading and 30s Timer ---
    useEffect(() => {
        if (!isLoggedIn) return;

        // 1. Start Firebase Auth Listener and Data Fetch (The REAL Loading)
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user && !profileData) { 
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    const data = docSnap.exists() ? docSnap.data() : {};
                    
                    const fetchedData = {
                        uid: user.uid,
                        displayName: user.displayName || data.fullName || 'User Name',
                        email: user.email,
                        role: data.role || 'Administrator',
                        photoURL: user.photoURL || null,
                        stats: data.stats || {
                            reportsGenerated: 45, 
                            totalSystemUsers: 540,
                            activeSectionsManaged: 12
                        },
                        id: data.employeeId || `SCH-${user.uid.substring(0, 5).toUpperCase()}` 
                    };
                    
                    // Store the data in a ref once fetched, but don't update state yet.
                    dataRef.current = fetchedData; 
                    
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                    // Store fallback data on error
                    dataRef.current = { 
                        uid: auth.currentUser?.uid || 'N/A',
                        displayName: auth.currentUser?.displayName || 'Error User',
                        email: auth.currentUser?.email || 'N/A',
                        role: 'User',
                        photoURL: null,
                        stats: { reportsGenerated: 0, totalSystemUsers: 0, activeSectionsManaged: 0 },
                        id: 'SCH-0000'
                    };
                }
            }
        });
        
        // 2. Start 30-Second Loading Timer (The SIMULATED Loading)
        const animationTimer = setTimeout(() => {
            // Once 30 seconds is up:
            
            // A. Set the state to trigger the final run-off animation (isDataReady = true)
            setIsDataReady(true);

            // B. Set the profileData state with the fetched or fallback data
            setProfileData(dataRef.current);
            
            // C. Start the 2-second delay to unmount the animation and show the Dashboard
            // This ensures the animation has time to run off screen.
            setTimeout(() => {
                setShowMainContent(true);
                setCurrentPage('dashboard');
            }, 2000); // 2000ms delay for the exit animation
            
        }, 30000); // 30000ms = 30 seconds

        // Cleanup function
        return () => {
            clearTimeout(animationTimer);
            unsubscribe();
        };

    }, [isLoggedIn]);
    // ---------------------------------------------------------------------

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderMainContent = () => {
        // Render LoadingAnimation if logged in AND showMainContent is still FALSE
        // We pass isDataReady to trigger the final animation phase at 30 seconds.
        if (isLoggedIn && !showMainContent) {
             return <LoadingAnimation isDataReady={isDataReady} />;
        }

        switch (currentPage) {
            case 'reports':
                return <ReportsLayout onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'profile':
                return <ProfileLayout 
                           onLogout={handleLogout} 
                           onPageChange={handlePageChange} 
                           profileData={profileData} 
                       />; 
            case 'dashboard':
            default:
                // profileData is guaranteed to be non-null here due to the 30s timer logic
                return <Dashboard onLogout={handleLogout} onPageChange={handlePageChange} profileData={profileData} />;
        }
    };


    if (isLoggedIn) {
        return (
             <div className="dashboard-container">
                 {renderMainContent()}
             </div>
        );
    } else {
        return (
            <div className="login-page-container">
                <LoginSignUp onLogin={handleLoginSuccess} />
            </div>
        );
    }
}

export default App;