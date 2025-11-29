// src/components/assets/Dashboard/ViewStuds.jsx

import React, { useState } from 'react';
import './ViewStuds.css';
import { Sidebar, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';

// --- ICONS ---
const SearchIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const BellIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.36 17a3 3 0 1 0 3.28 0"/></svg>);
const HelpIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);
const LinkIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>);
const CopyIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>);
const ChevronDown = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>);
const PlusIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const DownloadIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const FileTextIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>);
const XIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

// --- MOCK DATA ---
const STUDENTS_DATA = [
    { id: '2024001', name: 'Anderson, James', type: 'Regular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09874268050', email: 'A.James1@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024002', name: 'Bennett, Sarah', type: 'Regular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09482312634', email: 'bennett_s23@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024003', name: 'Carter, Michael', type: 'Regular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09855772072', email: 'mi-car67@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024004', name: 'Davis, Emily', type: 'Irregular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09567725197', email: 'dai-em123@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024005', name: 'Evans, Robert', type: 'Irregular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09389607348', email: 'robrob9@gmail.com', address: 'Rodriguez,Rizal' },
];

// --- INTERNAL MODAL COMPONENT ---
const AddStudentFormModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Student Added Successfully!');
        onClose();
    };

    return (
        <div className="vs-modal-overlay">
            <div className="vs-modal-card">
                <button className="vs-modal-close" onClick={onClose}><XIcon /></button>
                <h2 className="vs-modal-title">Add Student Information</h2>
                
                <form className="vs-modal-form" onSubmit={handleSubmit}>
                    <div className="vs-form-row">
                        <div className="vs-form-group">
                            <label>Student ID</label>
                            <input type="text" placeholder="e.g. 2024001" className="vs-modal-input" required />
                        </div>
                        <div className="vs-form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="Last Name, First Name" className="vs-modal-input" required />
                        </div>
                    </div>

                    <div className="vs-form-row">
                        <div className="vs-form-group">
                            <label>Type of Student</label>
                            <div className="vs-modal-select-wrapper">
                                <select className="vs-modal-select">
                                    <option>Regular</option>
                                    <option>Irregular</option>
                                </select>
                                <ChevronDown className="vs-modal-chevron"/>
                            </div>
                        </div>
                        <div className="vs-form-group">
                            <label>Section</label>
                            <input type="text" placeholder="e.g. 3D" className="vs-modal-input" />
                        </div>
                    </div>

                    <div className="vs-form-group">
                        <label>Course</label>
                        <input type="text" placeholder="e.g. Bachelor of Science in Information Technology" className="vs-modal-input" />
                    </div>

                    <div className="vs-form-row">
                        <div className="vs-form-group">
                            <label>Cellphone #</label>
                            <input type="text" placeholder="09xxxxxxxxx" className="vs-modal-input" />
                        </div>
                        <div className="vs-form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="student@gmail.com" className="vs-modal-input" />
                        </div>
                    </div>

                    <div className="vs-form-group">
                        <label>Home Address</label>
                        <input type="text" placeholder="City, Province" className="vs-modal-input" />
                    </div>

                    <button type="submit" className="vs-modal-submit-btn">
                        Save Student
                    </button>
                </form>
            </div>
        </div>
    );
};


const ViewStuds = ({ onLogout, onPageChange }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_COLLAPSED_WIDTH);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for modal
    
    const copyToClipboard = () => {
        const text = "https://student.progress.tracker.site/?form=student-info";
        navigator.clipboard.writeText(text);
        alert("Link copied to clipboard!");
    };

    return (
        <div className="view-studs-layout">
            <Sidebar 
                onLogout={onLogout} 
                onPageChange={onPageChange} 
                currentPage="dashboard"
                onWidthChange={setSidebarWidth} 
            />

            <div className="view-studs-main" style={{ marginLeft: sidebarWidth }}>
                <header className="vs-header">
                    <div className="vs-search-container">
                        <SearchIcon className="vs-search-icon" />
                        <input type="text" placeholder="Search students" className="vs-search-input" />
                    </div>
                    <div className="vs-header-actions">
                        <BellIcon className="vs-icon" />
                        <HelpIcon className="vs-icon" />
                    </div>
                </header>

                <div className="vs-filter-card">
                    <div className="vs-filter-group">
                        <label>Institute</label>
                        <div className="vs-select-wrapper">
                            <select defaultValue="College of Engineering"><option>College of Engineering</option></select>
                            <ChevronDown className="vs-select-arrow" size={16} />
                        </div>
                    </div>
                    <div className="vs-filter-group">
                        <label>Year Level</label>
                        <div className="vs-select-wrapper">
                            <select defaultValue="1st Year"><option>1st Year</option></select>
                            <ChevronDown className="vs-select-arrow" size={16} />
                        </div>
                    </div>
                    <div className="vs-filter-group">
                        <label>Section</label>
                        <div className="vs-select-wrapper">
                            <select defaultValue="3D"><option>3D</option></select>
                            <ChevronDown className="vs-select-arrow" size={16} />
                        </div>
                    </div>
                </div>

                <div className="vs-content-card">
                    <div className="vs-card-header">
                        <h1>BSIT -3D</h1>
                        <a href="#course" className="vs-subtitle">Introduction to Programming</a>
                    </div>

                    <div className="vs-share-banner">
                        <div className="vs-share-content">
                            <div className="vs-share-header">
                                <LinkIcon size={20} />
                                <span>Shareable Form Link</span>
                            </div>
                            <p>Share this link with students so they can submit their own information</p>
                            <div className="vs-link-row">
                                <input type="text" readOnly value="https://student.progress.tracker.site..." />
                                <button className="vs-copy-btn" onClick={copyToClipboard}><CopyIcon size={14} /> Copy Link</button>
                            </div>
                        </div>
                    </div>

                    <div className="vs-action-bar">
                        <div className="vs-accordion-header">
                            <span>Student Information</span>
                            <ChevronDown size={18} />
                        </div>
                    </div>

                    <div className="vs-buttons-row">
                        <div style={{display:'flex', gap: '0.5rem'}}>
                            {/* UPDATED BUTTON: Sets modal state to true */}
                            <button className="vs-btn vs-btn-add" onClick={() => setIsAddModalOpen(true)}>
                                <PlusIcon size={16} /> Add Student
                            </button>
                            
                            <button 
                                className="vs-btn" 
                                style={{backgroundColor: '#3B82F6', color: 'white'}} 
                                onClick={() => onPageChange('gradesheet')}
                            >
                                <FileTextIcon size={16} /> View Gradesheet
                            </button>

                        </div>

                        <button className="vs-btn vs-btn-export">
                            <DownloadIcon size={16} /> Export Full List
                        </button>
                    </div>

                    <div className="vs-table-container">
                        <table className="vs-table">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Type</th>
                                    <th>Course</th>
                                    <th>Section</th>
                                    <th>Cellphone #</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {STUDENTS_DATA.map((student) => (
                                    <tr key={student.id}>
                                        <td>{student.id}</td>
                                        <td>{student.name}</td>
                                        <td>{student.type}</td>
                                        <td className="vs-col-course">{student.course}</td>
                                        <td>{student.section}</td>
                                        <td>{student.cell}</td>
                                        <td>{student.email}</td>
                                        <td>{student.address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>

            {/* RENDER MODAL */}
            <AddStudentFormModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

        </div>
    );
};

export default ViewStuds;