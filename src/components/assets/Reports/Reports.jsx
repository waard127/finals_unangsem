// src/components/assets/Reports/Reports.jsx

import React, { useState, useMemo } from 'react'; 
import PropTypes from 'prop-types';
import './Reports.css';

// --- ICONS (unchanged) ---
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


// --- CORE FUNCTION LOGIC (Processes Real Data) ---
// This function takes your full list of student data and returns only the sections 
// that have students who meet the AT_RISK_THRESHOLD (3 or more absences).
const getAtRiskSections = (allStudentsData) => {
    // Threshold: 3 or more absences
    const AT_RISK_THRESHOLD = 3; 
    const sectionsMap = new Map();

    allStudentsData.forEach(student => {
        // Only process students who are absent 3 or more times
        if (student.absences >= AT_RISK_THRESHOLD) {
            const sectionKey = student.section; // The unique section name (e.g., 'BSIT 2D')
            
            if (!sectionsMap.has(sectionKey)) {
                // Initialize the section entry
                sectionsMap.set(sectionKey, {
                    id: sectionKey, 
                    code: student.code || student.section, // e.g., 'BSIT 2D'
                    name: student.section,
                    course: student.course,
                    riskCount: 0,
                    atRiskStudents: [] // Array to hold only the filtered students
                });
            }
            const section = sectionsMap.get(sectionKey);
            section.riskCount += 1;
            // Add the at-risk student to this section's list
            section.atRiskStudents.push(student);
        }
    });

    return Array.from(sectionsMap.values());
};

// --- SIMULATION OF REAL API DATA STRUCTURE ---
// NOTE: In your real application, this array (or similar structure) would be the result 
// of an API call (e.g., fetched via useQuery, useEffect, or passed as a prop from a parent).
const STUDENT_API_DATA = [
    { id: '2024001', name: 'Anderson, James', section: 'BSIT 2D', course: 'Bachelor of Science in Information Technology (2nd Year)', code: 'BSIT 2D', absences: 1, gpa: '3.0', attendance: '98%', avatar: 'https://i.pravatar.cc/150?img=1' },
    // Student with 3 absences -> Triggers 'BSIT 2D' card
    { id: '2024002', name: 'Klein Ortega', section: 'BSIT 2D', course: 'Bachelor of Science in Information Technology (2nd Year)', code: 'BSIT 2D', absences: 3, gpa: '2.5', attendance: '90%', avatar: 'https://i.pravatar.cc/150?img=2' },
    // Students for the 'CS 101 - A' card
    { id: '2024003', name: 'Carol Martinez', section: 'CS 101 - A', course: 'Introduction to Programming', code: 'CS 101 - A', absences: 12, gpa: '2.7', attendance: '68%', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '2024004', name: 'David Chen', section: 'CS 101 - A', course: 'Introduction to Programming', code: 'CS 101 - A', absences: 7, gpa: '2.0', attendance: '75%', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: '2024005', name: 'Michael Brown', section: 'CS 101 - A', course: 'Introduction to Programming', code: 'CS 101 - A', absences: 5, gpa: '2.5', attendance: '82%', avatar: 'https://i.pravatar.cc/150?img=5' },
    // Student not at-risk in a different section
    { id: '2024006', name: 'Sarah Wilson', section: 'BSIT 3A', course: 'Bachelor of Science in Information Technology (3rd Year)', code: 'BSIT 3A', absences: 2, gpa: '3.5', attendance: '95%', avatar: 'https://i.pravatar.cc/150?img=6' },
];


const Reports = ({ onPageChange }) => { 
    const [institute, setInstitute] = useState('College of Engineering');
    const [yearLevel, setYearLevel] = useState('1st Year');
    const [section, setSection] = useState('All Sections');

    // 💡 IMPLEMENTATION: This processes the real data to get only the at-risk sections
    const atRiskSections = useMemo(() => getAtRiskSections(STUDENT_API_DATA), []);
    const CLASSES_TO_DISPLAY = atRiskSections; 

    // Navigation Handler
    const handleClassClick = (classData) => {
        // CRITICAL FIX: Pass the section details (header info) and the filtered list of atRiskStudents
        if (typeof onPageChange === 'function') {
            onPageChange('v-reports', { 
                sectionData: classData, // Section details for VReports header
                atRiskStudents: classData.atRiskStudents // Filtered list of students with >= 3 absences for VReports table
            });
        }
    };

    return (
        <div className="reports-page-container">
            
            {/* 1. Filter Card (unchanged) */}
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
                {/* ... other filters ... */}
            </div>

            {/* 2. Main Content Card */}
            <div className="rep-main-card">
                <div className="rep-card-header">
                    <h2>Assess Student</h2>
                    <p>Manage your sections and track student progress</p>
                </div>

                <div className="rep-grid">
                    {CLASSES_TO_DISPLAY.length === 0 ? (
                        <div className="rep-no-data">
                            <h3>No At-Risk Sections</h3>
                            <p>All sections are currently performing well (no students with 3 or more absences).</p>
                        </div>
                    ) : (
                        CLASSES_TO_DISPLAY.map((cls) => (
                            <div key={cls.id} className="rep-class-card">
                                <div className="rep-class-icon-box">
                                    <FileTextIcon className="rep-class-icon" />
                                </div>
                                
                                {/* FIX: Use dynamic data for the class code (e.g., BSIT 2D) */}
                                <h3 className="rep-class-code">{cls.code}</h3>
                                <p className="rep-class-name">{cls.course || 'Unknown Course'}</p>
                                
                                <div className="rep-card-footer">
                                    <div className="rep-at-risk">
                                        <UsersIcon /> 
                                        {/* FIX: Use the dynamic riskCount */}
                                        <span>At-Risk Students - {cls.riskCount}</span>
                                    </div>
                                    <button 
                                        className="rep-view-link" 
                                        onClick={() => handleClassClick(cls)} // Pass the entire class object
                                    >
                                        View <ArrowRight />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
};

export default Reports;

Reports.propTypes = {
    onPageChange: PropTypes.func,
};