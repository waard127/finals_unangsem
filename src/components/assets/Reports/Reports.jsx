// src/components/assets/Reports/Reports.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Reports.css';

// --- ICONS ---
const FileTextIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
);

const UsersIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);

const ChevronDown = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

const ArrowRight = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);


const Reports = ({ onPageChange }) => { // <--- Added onPageChange prop
    // State for filters
    const [institute, setInstitute] = useState('College of Engineering');
    const [yearLevel, setYearLevel] = useState('1st Year');
    const [section, setSection] = useState('All Sections');

    // Mock Data for Classes
    const CLASSES = [
        {
            id: 1,
            code: 'CS 101 - A',
            name: 'Introduction to Programming',
            atRisk: 3
        },
    ];

    // Navigation Handler
    const handleClassClick = (classId) => {
        console.log(`Navigating to report details for Class ID: ${classId}`);
        // Navigate to the VReports page only if a function is provided
        if (typeof onPageChange === 'function') {
            onPageChange('v-reports');
        } else {
            console.warn('Reports: onPageChange prop is not a function, navigation skipped.');
        }
    };

    return (
        <div className="reports-page-container">
            
            {/* 1. Filter Card (Clean White Floating Card) */}
            <div className="rep-filter-card">
                <div className="rep-filter-group">
                    <label>Institute</label>
                    <div className="rep-select-wrapper">
                        <select value={institute} onChange={(e) => setInstitute(e.target.value)}>
                            <option>College of Engineering</option>
                            <option>Institute of Education</option>
                            <option>Institute of Business</option>
                        </select>
                        <ChevronDown className="rep-chevron" />
                    </div>
                </div>

                <div className="rep-filter-group">
                    <label>Year Level</label>
                    <div className="rep-select-wrapper">
                        <select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)}>
                            <option>1st Year</option>
                            <option>2nd Year</option>
                            <option>3rd Year</option>
                            <option>4th Year</option>
                        </select>
                        <ChevronDown className="rep-chevron" />
                    </div>
                </div>

                <div className="rep-filter-group">
                    <label>Section</label>
                    <div className="rep-select-wrapper">
                        <select value={section} onChange={(e) => setSection(e.target.value)}>
                            <option>All Sections</option>
                            <option>Section A</option>
                            <option>Section B</option>
                        </select>
                        <ChevronDown className="rep-chevron" />
                    </div>
                </div>
            </div>

            {/* 2. Main Content Card */}
            <div className="rep-main-card">
                <div className="rep-card-header">
                    <h2>Assess Student</h2>
                    <p>Manage your sections and track student progress</p>
                </div>

                <div className="rep-grid">
                    {CLASSES.map((cls) => (
                        <div key={cls.id} className="rep-class-card">
                            <div className="rep-class-icon-box">
                                <FileTextIcon className="rep-class-icon" />
                            </div>
                            
                            <h3 className="rep-class-code">{cls.code}</h3>
                            <p className="rep-class-name">{cls.name}</p>
                            
                            <div className="rep-card-footer">
                                <div className="rep-at-risk">
                                    <UsersIcon /> 
                                    <span>At-Risk Students - {cls.atRisk}</span>
                                </div>
                                <button 
                                    className="rep-view-link" 
                                    onClick={() => handleClassClick(cls.id)}
                                >
                                    View <ArrowRight />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Reports;

Reports.propTypes = {
    onPageChange: PropTypes.func,
};