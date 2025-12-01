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
const XIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const EditIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const UploadIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>);

// --- MOCK DATA ---
const STUDENTS_DATA = [
    { id: '2024001', name: 'Anderson, James', type: 'Regular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09874268050', email: 'A.James1@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024002', name: 'Bennett, Sarah', type: 'Regular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09482312634', email: 'bennett_s23@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024003', name: 'Carter, Michael', type: 'Regular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09855772072', email: 'mi-car67@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024004', name: 'Davis, Emily', type: 'Irregular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09567725197', email: 'dai-em123@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024005', name: 'Evans, Robert', type: 'Irregular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09389607348', email: 'robrob9@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024006', name: 'Foster, Jessica', type: 'Regular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09678396246', email: 'jesssssss@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024007', name: 'Garcia, David', type: 'Regular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09678396248', email: 'GD75935@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024008', name: 'Harris, Amanda', type: 'Regular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09988360862', email: 'Harrriiiss12@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024009', name: 'Jackson, Christopher', type: 'Irregular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09813057460', email: 'Christopher.J@gmail.com', address: 'Rodriguez,Rizal' },
    { id: '2024010', name: 'Johnson, Lisa', type: 'Irregular', course: 'Bachelor of Science in Information Technology', section: '3D', cell: '09953650990', email: 'LIZZAA@gmail.com', address: 'Rodriguez,Rizal' },
];

// Initial Attendance Mock Data (Mapped by ID)
const INITIAL_ATTENDANCE = {
    '2024001': ['P', 'P', 'A', 'SUSPENDED', 'P', 'P', 'P', 'P'],
    '2024002': ['P', 'P', 'A', 'SUSPENDED', 'P', 'A', 'A', 'P'],
    '2024003': ['P', 'P', 'P', 'SUSPENDED', 'P', 'P', 'P', 'P'],
    '2024004': ['P', 'P', 'P', 'SUSPENDED', 'A', 'L', 'P', 'P'],
    '2024005': ['P', 'L', 'P', 'SUSPENDED', 'P', 'P', 'L', 'A'],
    '2024006': ['P', 'P', 'A', 'SUSPENDED', 'L', 'A', 'P', 'P'],
    '2024007': ['A', 'P', 'P', 'SUSPENDED', 'P', 'P', 'A', 'L'],
    '2024008': ['A', 'L', 'L', 'SUSPENDED', 'A', 'P', 'P', 'P'],
    '2024009': ['A', 'P', 'P', 'SUSPENDED', 'P', 'P', 'P', 'A'],
    '2024010': ['L', 'P', 'A', 'SUSPENDED', 'P', 'P', 'P', 'P'],
};

const ATTENDANCE_DATES = ['Sept 15', 'Sept 16', 'Sept 18', 'Sept 19', 'Sept 22', 'Sept 23', 'Sep 24', 'Sept 25'];

// --- SUB-COMPONENT: ATTENDANCE CELL (Reused Logic) ---
const AttendanceCell = ({ status, onChange }) => {
    let className = 'vs-status-pill';
    let content = status;

    if (status === 'P') className += ' vs-p';
    else if (status === 'A') className += ' vs-a';
    else if (status === 'L') className += ' vs-l';
    else if (status === 'SUSPENDED' || status === 'HOLIDAY') className = 'vs-tag-full';

    const renderVisual = () => {
        if (status === 'SUSPENDED' || status === 'HOLIDAY') {
            return <div className={className}>{status}</div>;
        }
        return (
            <div className={className}>
                {content} <ChevronDown className="vs-chevron-mini"/>
            </div>
        );
    };

    return (
        <td className="vs-cell-relative">
            {renderVisual()}
            <select 
                className="vs-cell-select"
                value={status}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="P">Present (P)</option>
                <option value="A">Absent (A)</option>
                <option value="L">Late (L)</option>
                <option disabled>──────────</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="HOLIDAY">Holiday</option>
            </select>
        </td>
    );
};

// --- MODAL ---
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
                        <div className="vs-form-group"><label>Student ID</label><input type="text" placeholder="e.g. 2024001" className="vs-modal-input" required /></div>
                        <div className="vs-form-group"><label>Full Name</label><input type="text" placeholder="Last Name, First Name" className="vs-modal-input" required /></div>
                    </div>
                    <button type="submit" className="vs-modal-submit-btn">Save Student</button>
                </form>
            </div>
        </div>
    );
};


const ViewStuds = ({ onLogout, onPageChange }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_COLLAPSED_WIDTH);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // --- STATE FOR VIEW SWITCHING ---
    const [viewOption, setViewOption] = useState('Student Information');
    
    // --- STATE FOR ATTENDANCE ---
    const [attendanceData, setAttendanceData] = useState(INITIAL_ATTENDANCE);

    // Logic to handle changing attendance status
    const handleStatusChange = (studentId, dayIndex, newStatus) => {
        const currentRecords = [...(attendanceData[studentId] || [])];
        currentRecords[dayIndex] = newStatus;
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: currentRecords
        }));
    };

    const copyToClipboard = () => {
        const text = "https://student.progress.tracker.site/?form=student-info";
        navigator.clipboard.writeText(text);
        alert("Link copied to clipboard!");
    };

    const handleEditClick = (studentName) => {
        alert(`Edit feature for ${studentName} coming soon!`);
    };

    // --- RENDER HELPERS ---
    
    // 1. Toolbar Rendering (Changes based on View)
    const renderToolbarButtons = () => {
        if (viewOption === 'Student Information') {
            return (
                <>
                    <button className="vs-btn vs-btn-add" onClick={() => setIsAddModalOpen(true)}>
                        <PlusIcon size={16} /> Add Student
                    </button>
                    <button className="vs-btn vs-btn-export">
                        <DownloadIcon size={16} /> Export Full List
                    </button>
                </>
            );
        } else if (viewOption === 'Attendance') {
            return (
                <>
                    <button className="vs-btn vs-btn-white" onClick={() => alert("Add Column Logic")}>
                        <PlusIcon size={16} /> Add Column
                    </button>
                    <button className="vs-btn vs-btn-white" onClick={() => alert("Export Excel")}>
                        <UploadIcon size={16} /> Export Excel
                    </button>
                </>
            );
        }
        // Add other cases for Quizzes/Midterm later
        return null;
    };

    // 2. Extra Header Button (Attendance Sheet Green Button)
    const renderRightHeaderButton = () => {
        if (viewOption === 'Attendance') {
             // In attendance mode, we show the big green "Attendance Sheet" button on the far right
             // Or "Export Full List" moves here? 
             // Based on screenshot 91a581.png, there is a big green "Attendance Sheet" button
             return (
                <button className="vs-btn vs-btn-export">
                    <DownloadIcon size={16} /> Attendance Sheet
                </button>
             );
        }
        return null;
    };

    // 3. Table Rendering
    const renderTable = () => {
        if (viewOption === 'Student Information') {
            return (
                <table className="vs-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Type of Student</th>
                            <th>Course</th>
                            <th>Section & Year</th>
                            <th>Cellphone #</th>
                            <th>Email</th>
                            <th>Home Address</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {STUDENTS_DATA.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td style={{fontWeight: '600'}}>{student.name}</td>
                                <td>{student.type}</td>
                                <td className="vs-col-course">{student.course}</td>
                                <td style={{textAlign:'center'}}>{student.section}</td>
                                <td>{student.cell}</td>
                                <td>{student.email}</td>
                                <td>{student.address}</td>
                                <td style={{textAlign: 'center'}}>
                                    <button className="vs-edit-btn" onClick={() => handleEditClick(student.name)}>
                                        <EditIcon size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else if (viewOption === 'Attendance') {
            return (
                <table className="vs-table">
                    <thead>
                        <tr>
                            <th className="fixed-col">Student ID</th>
                            <th className="fixed-col">Student Name</th>
                            <th className="fixed-col">Type of Student</th>
                            {ATTENDANCE_DATES.map((date, idx) => (
                                <th key={idx} style={{textAlign: 'center'}}>{date}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {STUDENTS_DATA.map((student) => {
                            const records = attendanceData[student.id] || [];
                            return (
                                <tr key={student.id}>
                                    <td className="fixed-col vs-id-text">{student.id}</td>
                                    <td className="fixed-col" style={{fontWeight: '600'}}>{student.name}</td>
                                    <td className="fixed-col">{student.type}</td>
                                    {ATTENDANCE_DATES.map((_, idx) => (
                                        <AttendanceCell 
                                            key={idx}
                                            status={records[idx] || 'A'} // Default to Absent if undefined
                                            onChange={(newStatus) => handleStatusChange(student.id, idx, newStatus)}
                                        />
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            );
        }
        return <div style={{padding: '2rem', textAlign: 'center'}}>Feature coming soon for {viewOption}</div>;
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
                
                {/* 1. Header (Search + Icons) */}
                <header className="vs-header">
                    <div className="vs-search-container">
                        <SearchIcon className="vs-search-icon" />
                        <input type="text" placeholder="Search students" className="vs-search-input" />
                    </div>
                    
                    {/* Toolbar for Attendance Mode (Top Left in screenshot) */}
                    {viewOption === 'Attendance' && (
                        <div className="vs-top-toolbar">
                            <button className="vs-btn vs-btn-white-outline">
                                <PlusIcon size={14}/> Add Column
                            </button>
                            <button className="vs-btn vs-btn-white-outline">
                                <UploadIcon size={14}/> Export Excel
                            </button>
                        </div>
                    )}

                    <div className="vs-header-actions">
                        <BellIcon className="vs-icon" />
                        <HelpIcon className="vs-icon" />
                    </div>
                </header>

                {/* 2. Floating Filter Bar */}
                <div className="vs-floating-filter-bar">
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
                            <select defaultValue="All Sections"><option>All Sections</option></select>
                            <ChevronDown className="vs-select-arrow" size={16} />
                        </div>
                    </div>
                </div>

                {/* 3. Main Content Card */}
                <div className="vs-content-card">
                    {/* Title Row */}
                    {viewOption === 'Student Information' && (
                        <div className="vs-card-header">
                            <h1>BSIT -3D</h1>
                            <span className="vs-subtitle">Introduction to Programming</span>
                        </div>
                    )}

                    {/* Share Banner (Only for Student Info) */}
                    {viewOption === 'Student Information' && (
                        <div className="vs-share-banner">
                            <div className="vs-share-content">
                                <div className="vs-share-header">
                                    <LinkIcon size={20} />
                                    <span>Shareable Form Link</span>
                                </div>
                                <p>Share this link with students so they can submit their own information</p>
                                <div className="vs-link-row">
                                    <input type="text" readOnly value="https://student.progress.tracker.site/?form=student-info..." />
                                    <button className="vs-copy-btn" onClick={copyToClipboard}><CopyIcon size={14} /> Copy Link</button>
                                </div>
                                <p className="vs-link-note">Students who use this link will be automatically assigned to Computing Science Institute - selected 3D section</p>
                            </div>
                        </div>
                    )}

                    {/* Dropdown Menu & Contextual Buttons */}
                    <div className="vs-controls-row">
                        {/* Dropdown */}
                        <div className="vs-dropdown-wrapper">
                             <select 
                                className="vs-section-dropdown"
                                value={viewOption}
                                onChange={(e) => setViewOption(e.target.value)}
                            >
                                <option>Student Information</option>
                                <option>Attendance</option>
                                <option>Assignment</option>
                                <option>Quizzes</option>
                                <option>Activities</option>
                                <option>Midterm</option>
                                <option>Finals</option>
                            </select>
                            <ChevronDown className="vs-dropdown-arrow" size={18} />
                        </div>

                        {/* Right Side Button (Attendance Sheet or Export) */}
                        {viewOption === 'Attendance' ? (
                            <button className="vs-btn vs-btn-export">
                                <DownloadIcon size={16} /> Attendance Sheet
                            </button>
                        ) : null}
                    </div>

                    {/* Add Student Button (Info View Only) */}
                    {viewOption === 'Student Information' && (
                         <div className="vs-buttons-row">
                             <button className="vs-btn vs-btn-add" onClick={() => setIsAddModalOpen(true)}>
                                <PlusIcon size={16} /> Add Student
                            </button>
                             <button className="vs-btn vs-btn-export">
                                <DownloadIcon size={16} /> Export Full List
                            </button>
                         </div>
                    )}

                    {/* Dynamic Table */}
                    <div className="vs-table-container">
                        {renderTable()}
                    </div>

                    {/* Legend (Only for Attendance) */}
                    {viewOption === 'Attendance' && (
                        <div className="vs-legend">
                            <div className="vs-legend-item"><span className="vs-p-pill">P</span> Present</div>
                            <div className="vs-legend-item"><span className="vs-a-pill">A</span> Absent</div>
                            <div className="vs-legend-item"><span className="vs-l-pill">L</span> Absent (Late)</div>
                        </div>
                    )}

                </div>
            </div>

            <AddStudentFormModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div>
    );
};

export default ViewStuds;