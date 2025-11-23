// src/components/assets/Reports/ReportsLayout.jsx (MODIFIED)

import React, { useState, useEffect } from 'react';
import Reports from './Reports.jsx'; // Import the base Reports component
// --- UPDATED IMPORT: Use the new constants for width ---
import { 
    Sidebar, 
    SIDEBAR_DEFAULT_WIDTH, 
    SIDEBAR_EXPANDED_WIDTH, // Make sure this is imported if used in Dashboard
} from '../Dashboard/Sidebar.jsx'; // Import the new Sidebar component and its constants
// -----------------------------------------------------

// Import icons needed for the header 
const Menu = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>);
const Search = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const User = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);

// The Bell icon provided by the user (Notification icon)
const Bell = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.36 17a3 3 0 1 0 3.28 0"/></svg>);

// NEW: Microphone Icon (Mic Icon)
const Mic = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>);


const ReportsLayout = ({ onLogout, onPageChange }) => {
    // Determine the expanded width for the Reports layout based on Sidebar constants
    const SIDEBAR_EXPANDED_WIDTH = 250; // Assuming 250px, should be imported from Sidebar.jsx
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const isDesktopMode = window.innerWidth >= 1024;
    
    // Logic to handle window resize for desktop mode
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarExpanded(true); // Auto-expand sidebar on desktop
            } else {
                setIsSidebarExpanded(false); // Collapse on mobile
            }
        };
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            <Sidebar 
                onLogout={onLogout} 
                onPageChange={onPageChange}
                currentPage={'reports'}
                isExpanded={isSidebarExpanded}
                setIsExpanded={setIsSidebarExpanded}
            />

            <main style={{ 
                flexGrow: 1, 
                padding: isDesktopMode ? '1.5rem 2rem' : '1rem',
                // Adjust margin based on sidebar state
                marginLeft: isDesktopMode ? (isSidebarExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_DEFAULT_WIDTH) : 0,
                transition: 'margin-left 0.3s ease-in-out'
            }}>
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    
                    {/* Menu Button and Search Bar */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: isDesktopMode ? 'auto' : '100%', order: isDesktopMode ? 1 : 2 }}>
                         {!isDesktopMode && (
                            <button
                                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                                style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}
                            >
                                <Menu style={{ width: '1.5rem', height: '1.5rem' }} />
                            </button>
                        )}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', maxWidth: isDesktopMode ? '40rem' : '100%' }}>
                            <Search style={{ position: 'absolute', left: '1rem', width: '1rem', height: '1rem', color: '#9CA3AF' }} />
                            <input
                                type="text"
                                placeholder="Search students, sections, or reports..."
                                style={{ paddingLeft: '2.5rem', paddingRight: '1rem', padding: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '0.75rem', width: '100%', fontSize: '0.875rem' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Notification, Mic, and User Icons */}
                    <div style={{ display: 'flex', gap: '1rem', minWidth: isDesktopMode ? 'auto' : '3.5rem', order: isDesktopMode ? 2 : 1 }}>
                        {/* NEW: Mic Icon added to the left of the Bell icon */}
                        <Mic style={{ width: '1.5rem', height: '1.5rem', color: '#6B7280', cursor: 'pointer' }} title="Voice Input" />
                        
                        {/* Bell Icon */}
                        <Bell style={{ width: '1.5rem', height: '1.5rem', color: '#6B7280', cursor: 'pointer' }} title="Notifications" />
                        
                        {/* User Icon */}
                        <User style={{ width: '1.5rem', height: '1.5rem', color: '#6B7280', cursor: 'pointer' }} title="User Profile" />
                    </div>
                </div>

                {/* RENDER THE REPORTS PAGE */}
                <Reports />
            </main>
        </div>
    );
};

export default ReportsLayout;