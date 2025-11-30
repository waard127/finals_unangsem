// src/components/assets/Profile/Profile.jsx

import React, { useState, useEffect } from 'react';
import './Profile.css';

// Icons
const TrophyIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V22"/><path d="M14 14.66V22"/><path d="M8 9h8"/><path d="M12 2v10.5"/></svg>);
const FileTextIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>);
const UsersIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const EditIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);

const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const parts = fullName.split(' ').filter(p => p); 
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
}

const Profile = ({ profileData }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        if (profileData) {
            setName(profileData.displayName || 'User Name');
            setEmail(profileData.email || 'user@school.edu.ph');
            setId(profileData.id || profileData.uid || 'N/A');
            setRole(profileData.role || 'Professor');
        }
    }, [profileData]);

    if (!profileData) return <div className="pro-loading">Loading Profile...</div>;

    const initials = getInitials(name);
    const fallbackAvatar = `https://ui-avatars.com/api/?name=${initials}&background=38761d&color=fff&size=128&bold=true`;
    
    // Stats Logic
    const stats = profileData.stats || {};
    const reportsCount = stats.reportsGenerated || 0; 
    const totalUsers = stats.totalSystemUsers || 0;
    const activeSections = stats.activeSectionsManaged || 0;

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        alert("Update functionality coming soon!");
    };

    return (
        <div className="pro-container">
            
            {/* 1. TOP "IDENTITY" CARD */}
            <div className="pro-identity-card">
                <div className="pro-id-left">
                    <div className="pro-avatar-wrapper">
                        <img 
                            src={profileData.photoURL || fallbackAvatar} 
                            alt="Profile" 
                            className="pro-avatar"
                            onError={(e) => { e.target.onerror = null; e.target.src = fallbackAvatar; }} 
                        />
                        <button className="pro-edit-avatar-btn"><EditIcon /></button>
                    </div>
                    <div className="pro-user-text">
                        <h2 className="pro-name">{name}</h2>
                        <span className="pro-role-badge">{role}</span>
                        <p className="pro-id-text">ID: {id}</p>
                    </div>
                </div>

                <div className="pro-id-right">
                    {/* Horizontal Metrics similar to Dashboard */}
                    <div className="pro-stat-item">
                        <div className="pro-stat-icon-box" style={{background: '#DCFCE7', color: '#166534'}}>
                            <FileTextIcon />
                        </div>
                        <div>
                            <span className="pro-stat-val">{reportsCount}</span>
                            <span className="pro-stat-lbl">Reports</span>
                        </div>
                    </div>
                    <div className="pro-stat-item">
                        <div className="pro-stat-icon-box" style={{background: '#DBEAFE', color: '#1E40AF'}}>
                            <UsersIcon />
                        </div>
                        <div>
                            <span className="pro-stat-val">{activeSections}</span>
                            <span className="pro-stat-lbl">Sections</span>
                        </div>
                    </div>
                    <div className="pro-stat-item">
                        <div className="pro-stat-icon-box" style={{background: '#FEF3C7', color: '#B45309'}}>
                            <TrophyIcon />
                        </div>
                        <div>
                            <span className="pro-stat-val">{totalUsers}</span>
                            <span className="pro-stat-lbl">Users</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. BOTTOM "SETTINGS" CARD */}
            <div className="pro-settings-card">
                <div className="pro-card-header">
                    <h3>Personal Information</h3>
                    <p>Update your photo and personal details here.</p>
                </div>

                <form className="pro-form" onSubmit={handleUpdateProfile}>
                    <div className="pro-form-grid">
                        <div className="pro-form-group">
                            <label>Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="pro-form-group">
                            <label>Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="pro-form-group">
                            <label>Role (Read Only)</label>
                            <input type="text" value={role} disabled className="pro-input-disabled" />
                        </div>

                        <div className="pro-form-group">
                            <label>System ID (Read Only)</label>
                            <input type="text" value={id} disabled className="pro-input-disabled" />
                        </div>
                    </div>

                    <div className="pro-form-actions">
                        <button type="button" className="pro-btn-cancel">Cancel</button>
                        <button type="submit" className="pro-btn-save">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;