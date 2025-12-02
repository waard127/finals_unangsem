// src/App.js

import React, { useState, useEffect } from 'react'; 
import Dashboard from './components/assets/Dashboard/Dashboard.jsx'; 
import LoginSignUp from './components/assets/Loginsignin/LoginSignUp.jsx';
import ReportsLayout from './components/assets/Reports/ReportsLayout.jsx'; 
import ProfileLayout from './components/assets/Profile/ProfileLayout.jsx'; 
import ViewStuds from './components/assets/Dashboard/ViewStuds.jsx';
import Gradesheet from './components/assets/Dashboard/Gradesheet.jsx';
import MultiPageGS from './components/assets/Dashboard/MultiPageGS.jsx'; 
import VReports from './components/assets/Reports/VReports.jsx'; 
import ViewRD from './components/assets/Reports/ViewRD.jsx'; 
import LoadingAnimation from './components/assets/LoadingAnimation/LoadingAnimation.jsx'; 
import Tributes from './components/assets/Tributes/Tributes.jsx'; 
import './App.css';

import VoiceControl from './components/assets/Dashboard/VoiceControl.jsx';
import { auth } from './apiService'; 
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'; 
import CdmChatbot from './Apps.jsx'; 
import { APP_VERSION, BUILD_HASH, BUILD_DATE } from './meta'; 

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard'); 
    const [pageParams, setPageParams] = useState({}); 

    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [profileData, setProfileData] = useState(null); 
    const [isDataReady, setIsDataReady] = useState(false); 
    const [isVoiceActive, setIsVoiceActive] = useState(false);

    // --- SHARED SECTIONS STATE ---
    const [sections, setSections] = useState([
        { 
            id: 1, 
            name: 'BSIT 3D', 
            subtitle: 'Introduction to Programming', 
            students: 42, 
            color: '#3B82F6',
            coverImage: null // Default null means use color
        },
        { 
            id: 2, 
            name: 'BSCS 2A', 
            subtitle: 'Information Assurance', 
            students: 38, 
            color: '#EAB308',
            coverImage: null
        },
        { 
            id: 3, 
            name: 'BSCPE 4A', 
            subtitle: 'Computer Interaction', 
            students: 35, 
            color: '#F97316',
            coverImage: null
        }
    ]);

    useEffect(() => {
        console.log(`%c Progress Tracker v${APP_VERSION} `, 'background: #38761d; color: white; padding: 4px; border-radius: 4px;');
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setIsLoggedIn(true);
                try {
                    const response = await fetch('http://localhost:5000/api/user-sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                            photoURL: firebaseUser.photoURL || "" 
                        })
                    });
                    if (!response.ok) throw new Error('Failed to sync');
                    const mongoProfile = await response.json();
                    setProfileData({ ...mongoProfile, id: mongoProfile.uid, displayName: mongoProfile.displayName, photoURL: mongoProfile.photoURL || firebaseUser.photoURL });
                    setIsDataReady(true);
                } catch (error) {
                    setProfileData({ displayName: firebaseUser.displayName || 'Professor', email: firebaseUser.email, id: firebaseUser.uid, role: 'Offline Mode', photoURL: firebaseUser.photoURL });
                    setIsDataReady(true);
                }
            } else {
                setIsLoggedIn(false); setProfileData(null); setIsDataReady(false); 
            }
            setIsLoadingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try { await firebaseSignOut(auth); setProfileData(null); setIsLoggedIn(false); setIsVoiceActive(false); } catch (error) {}
    };

    const handlePageChange = (page, params = {}) => { setCurrentPage(page); setPageParams(params); };
    const toggleVoice = (status) => setIsVoiceActive(status);

    const renderMainContent = () => {
        if (isLoadingAuth || !profileData || !isDataReady) return <LoadingAnimation isDataReady={isDataReady} />;

        const dashboardProps = {
            onLogout: handleLogout,
            onPageChange: handlePageChange,
            profileData: profileData,
            isVoiceActive: isVoiceActive,
            onToggleVoice: () => toggleVoice(!isVoiceActive),
            sections: sections 
        };

        const profileProps = {
            onLogout: handleLogout,
            onPageChange: handlePageChange,
            profileData: profileData,
            sections: sections, 
            onUpdateSections: setSections 
        };

        switch (currentPage) {
            case 'gradesheet': return <Gradesheet onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'multipage-gradesheet': return <MultiPageGS onLogout={handleLogout} onPageChange={handlePageChange} {...pageParams} />;
            case 'view-studs': return <ViewStuds onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'reports': return <ReportsLayout onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'v-reports': return <VReports onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'view-rd': return <ViewRD onLogout={handleLogout} onPageChange={handlePageChange} studentData={pageParams.student} />;
            case 'profile': return <ProfileLayout {...profileProps} />; 
            case 'tributes': return <Tributes onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'dashboard': default: return <Dashboard {...dashboardProps} />;
        }
    };

    if (isLoggedIn) {
        return (
             <div className="dashboard-container">
                 <VoiceControl isVoiceActive={isVoiceActive} onToggle={toggleVoice} onPageChange={handlePageChange} />
                 {renderMainContent()}
                 <CdmChatbot onPageChange={handlePageChange} /> 
             </div>
        );
    } else {
        return <div className="login-page-container"><LoginSignUp onLogin={()=>{}} /></div>;
    }
}

export default App;