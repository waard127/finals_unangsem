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

// --- NEW: Inline SVG Icons for the Chatbot Widget ---
const BotIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
    </svg>
); 

const XIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
);

const SendIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M15 9l-4 4"/>
    </svg>
);
// ----------------------------------------------------


// --- UPDATED: CDM Chatbot Component (Placeholder) ---
const GeminiChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    
    // State to hold the chat history (Placeholder)
    const [chatHistory, setChatHistory] = useState([
        { 
            type: 'bot', 
            text: "Hello! I'm the **CDM Chatbot placeholder**. My services are temporarily offline for maintenance. Please check back later!"
        }
    ]);
    
    // Ref and effect for auto-scrolling
    const chatBodyRef = React.useRef(null);
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [chatHistory, isOpen]);
    
    
    const handleSend = () => {
        if (message.trim()) {
            const userMessage = message.trim();
            // 1. Add user message to history
            setChatHistory(prev => [...prev, { type: 'user', text: userMessage }]);
            setMessage(''); 
            
            // 2. Add placeholder bot response
            setTimeout(() => {
                setChatHistory(prev => [...prev, { 
                    type: 'bot', 
                    text: "I received your message. I am currently operating in placeholder mode and cannot provide real answers. Thank you for your patience."
                }]);
            }, 500); // Simulate network delay
        }
    };

    // Render function for chat messages
    const renderMessage = (msg, index) => (
        <div 
            key={index} 
            className={`chat-message ${msg.type}`}
            // Basic inline styling for user messages
            style={msg.type === 'user' ? { 
                alignSelf: 'flex-end', 
                backgroundColor: '#38761d', 
                color: 'white',
                borderBottomRightRadius: '2px'
            } : {}}
        >
            {msg.text}
        </div>
    );

    return (
        <div className="chatbot-container">
            {/* Chat Window (Appears when isOpen is true) */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span className="chat-title">CDM Chatbot</span> {/* Updated title */}
                        <XIcon className="close-btn" onClick={() => setIsOpen(false)} />
                    </div>
                    
                    <div className="chat-body" ref={chatBodyRef}>
                        {chatHistory.map(renderMessage)}
                    </div>
                    
                    <div className="chat-input-area">
                        <input
                            type="text"
                            placeholder="Send a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <SendIcon className="send-btn" onClick={handleSend} />
                    </div>
                </div>
            )}
            
            {/* Floating Button (Always visible) */}
            <div 
                className={`floating-btn ${isOpen ? 'is-open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title={isOpen ? "Close Chat" : "CDM Chat support"}
            >
                <BotIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                {!isOpen && <span className="btn-label">CDM Chat</span>} {/* Updated label */}
            </div>
        </div>
    );
};
// ---------------------------------------------------------------------


const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // State to track the current view
    const [currentPage, setCurrentPage] = useState('dashboard'); 
    // State to store pre-loaded profile data (null initially to indicate loading)
    const [profileData, setProfileData] = useState(null); 

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setProfileData(null); // Clear data on logout
        setCurrentPage('dashboard');
    };

    // --- EFFECT: Fetch user profile data once upon successful login (Data Pre-loading) ---
    useEffect(() => {
        if (!isLoggedIn) return;

        // Listener for Firebase Auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // Only fetch if a user is logged in and profile data hasn't been fetched yet
            if (user && !profileData) { 
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);

                    // FIX: Determine the photo URL, prioritizing Firebase Auth's photoURL
                    const photoURL = user.photoURL || null; 
                    
                    // --- DEBUG LOG: Crucial for diagnosing the photo issue ---
                    console.log("--- Profile Data Fetch Debug ---");
                    console.log("Firebase User Photo URL:", user.photoURL);
                    console.log("Is photoURL null/empty:", !photoURL);
                    console.log("----------------------------------");
                    // --------------------------------------------------------

                    const data = docSnap.exists() ? docSnap.data() : {};
                    
                    setProfileData({
                        uid: user.uid,
                        displayName: user.displayName || data.fullName || 'User Name',
                        email: user.email,
                        role: data.role || 'Administrator',
                        photoURL: photoURL, // FIX: photoURL is now correctly stored
                        stats: data.stats || {
                            reportsGenerated: 45, 
                            totalSystemUsers: 540,
                            activeSectionsManaged: 12
                        },
                        id: data.employeeId || `SCH-${user.uid.substring(0, 5).toUpperCase()}` 
                    });
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                    setProfileData({
                        uid: auth.currentUser?.uid || 'N/A',
                        displayName: auth.currentUser?.displayName || 'Error User',
                        email: auth.currentUser?.email || 'N/A',
                        role: 'User',
                        photoURL: null,
                        stats: { reportsGenerated: 0, totalSystemUsers: 0, activeSectionsManaged: 0 },
                        id: 'SCH-0000'
                    });
                }
            }
            // Set initial page once login and initial data load attempt is complete
            setCurrentPage('dashboard');
        });

        return () => unsubscribe();
    }, [isLoggedIn, profileData]);
    // ---------------------------------------------------------------------

    // Function to switch the main content view
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderMainContent = () => {
        // Show Loading Indicator while initial data loads
        if (isLoggedIn && !profileData) {
             return <LoadingAnimation />;
        }

        switch (currentPage) {
            case 'reports':
                return <ReportsLayout onLogout={handleLogout} onPageChange={handlePageChange} />;
            case 'profile':
                // PASS PRE-LOADED DATA
                return <ProfileLayout 
                           onLogout={handleLogout} 
                           onPageChange={handlePageChange} 
                           profileData={profileData} 
                       />; 
            case 'dashboard':
            default:
                // Passing profileData here as well for dashboard greeting/display
                return <Dashboard onLogout={handleLogout} onPageChange={handlePageChange} profileData={profileData} />;
        }
    };

    // Conditional rendering for the chatbot: show only if logged in AND profile data is loaded.
    const showChatbot = isLoggedIn && profileData;

    if (isLoggedIn) {
        return (
             <div className="dashboard-container">
                 {renderMainContent()}
                 {/* Renders the floating chatbot widget only when NOT on the loading screen */}
                 {showChatbot && <GeminiChatbot />} 
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