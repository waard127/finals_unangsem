// src/components/assets/Dashboard/ViewStuds.jsx

import React, { useState, useEffect } from 'react'; // ADD useEffect
import './ViewStuds.css';
import { Sidebar, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';

// --- ICONS (KEEP EXISTING) ---
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

// --- MOCK DATA (REMOVED) ---
const ATTENDANCE_DATES = ['Sept 15', 'Sept 16', 'Sept 18', 'Sept 19', 'Sept 22', 'Sept 23', 'Sep 24', 'Sept 25'];


// --- UTILITY: API CALL FOR POSTING STUDENT ---
const addStudentToDB = async (studentData) => {
    // You may need to change 'http://localhost:5000' to your server's address
    const API_URL = 'http://localhost:5000/api/students'; 
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData),
        });
        
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to add student to database.');
        }
        return responseData;
    } catch (error) {
        console.error('API Error:', error);
        alert(`Error: ${error.message}`);
        return null;
    }
};


// --- SUB-COMPONENT: ATTENDANCE CELL (KEEP EXISTING) ---
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


// --- MODAL (FIXED - Hooks moved before conditional return) ---
const AddStudentFormModal = ({ isOpen, onClose, onStudentAdded }) => { 
    
    // **FIXED**: Call useState unconditionally at the top of the function
    const [formData, setFormData] = useState({
        id: '', // Student ID
        name: '', // Student Name
        type: 'Regular', // Type of Student
        course: '', // Course
        section: '', // Section & Year
        cell: '', // Cellphone #
        email: '', // Email
        address: '' // Home Address
    });

    if (!isOpen) return null; // Conditional return is now safe

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // *** IMPORTANT ***
        // Replace 'MOCK_PROF_ID_123' with the actual UID of the logged-in professor
        const PROFESSOR_UID = 'MOCK_PROF_ID_123'; 

        const payload = {
            id: formData.id,
            name: formData.name,
            type: formData.type,
            course: formData.course,
            section: formData.section,
            cell: formData.cell,
            email: formData.email,
            address: formData.address,
            professorUid: PROFESSOR_UID // Add the professor's UID
        };

        const newStudent = await addStudentToDB(payload);

        if (newStudent) {
            onStudentAdded(newStudent);
            onClose();
            // Reset form
            setFormData({
                id: '', name: '', type: 'Regular', course: '', 
                section: '', cell: '', email: '', address: ''
            });
        }
    };

    return (
        <div className="vs-modal-overlay">
            <div className="vs-modal-card">
                <button className="vs-modal-close" onClick={onClose}><XIcon /></button>
                <h2 className="vs-modal-title">Add Student Information</h2>
                <form className="vs-modal-form" onSubmit={handleSubmit}>
                    <div className="vs-form-row">
                        <div className="vs-form-group"><label>Student ID</label><input type="text" name="id" value={formData.id} onChange={handleChange} placeholder="e.g. 2024001" className="vs-modal-input" required /></div>
                        <div className="vs-form-group"><label>Student Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Last Name, First Name" className="vs-modal-input" required /></div>
                    </div>
                    <div className="vs-form-row">
                        <div className="vs-form-group">
                            <label>Type of Student</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="vs-modal-select" required>
                                <option value="Regular">Regular</option>
                                <option value="Irregular">Irregular</option>
                            </select>
                        </div>
                        <div className="vs-form-group"><label>Course</label><input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="e.g. BSIT" className="vs-modal-input" required /></div>
                    </div>
                    <div className="vs-form-row">
                        <div className="vs-form-group"><label>Section & Year</label><input type="text" name="section" value={formData.section} onChange={handleChange} placeholder="e.g. 3D" className="vs-modal-input" required /></div>
                        <div className="vs-form-group"><label>Cellphone #</label><input type="text" name="cell" value={formData.cell} onChange={handleChange} placeholder="e.g. 09123456789" className="vs-modal-input" /></div>
                    </div>
                    <div className="vs-form-row">
                        <div className="vs-form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="student@email.com" className="vs-modal-input" /></div>
                        <div className="vs-form-group"><label>Home Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="e.g. Rodriguez, Rizal" className="vs-modal-input" /></div>
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
    
    // --- STATE FOR LIVE DATA (NEW) ---
    const [students, setStudents] = useState([]); 
    const [isLoading, setIsLoading] = useState(true); 
    
    // We use an empty object for attendance since the mock data was removed.
    const [attendanceData, setAttendanceData] = useState({}); 

    // Mocking the current active section filter for fetching data
    const PROFESSOR_UID = 'MOCK_PROF_ID_123'; 
    const CURRENT_SECTION_FILTER = '3D'; // Fetch only for '3D' section for now

    // --- FETCH STUDENTS LOGIC (NEW) ---
    const fetchStudents = async () => {
        setIsLoading(true);
        // Using the new API route to fetch students
        const API_URL = `http://localhost:5000/api/students/${PROFESSOR_UID}/${CURRENT_SECTION_FILTER}`; 

        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch students.');
            
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error('Fetch Students Error:', error);
            // Optionally set an error message in state
        } finally {
            setIsLoading(false);
        }
    };
    
    // Fetch data when component mounts and whenever the list needs a refresh
    useEffect(() => {
        fetchStudents();
    }, [viewOption]); 

    // Handler to update the list immediately after a successful add
    const handleStudentAdded = (newStudent) => {
        setStudents(prev => {
            // Add the new student and sort the list (e.g., by name)
            const updatedList = [...prev, newStudent];
            return updatedList.sort((a, b) => a.name.localeCompare(b.name));
        });
    };
    
    // Logic to handle changing attendance status (Keep existing)
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
    
    // 1. Toolbar Rendering (Keep existing)
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
        return null;
    };

    // 2. Extra Header Button (Keep existing)
    const renderRightHeaderButton = () => {
        if (viewOption === 'Attendance') {
             return (
                <button className="vs-btn vs-btn-export">
                    <DownloadIcon size={16} /> Attendance Sheet
                </button>
             );
        }
        return null;
    };

    // 3. Table Rendering (UPDATED TO USE `students` STATE)
    const renderTable = () => {
        
        if (isLoading) {
            return <div style={{padding: '2rem', textAlign: 'center'}}>Loading student data...</div>;
        }

        if (viewOption === 'Student Information') {
            if (students.length === 0) {
                 return <div style={{padding: '2rem', textAlign: 'center'}}>No students found for this section. Click "Add Student" to begin.</div>;
            }
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
                        {/* ITERATE OVER THE LIVE `students` STATE */}
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td className="vs-id-text">{student.id}</td>
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
             if (students.length === 0) {
                 return <div style={{padding: '2rem', textAlign: 'center'}}>No students found for attendance tracking.</div>;
            }
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
                        {students.map((student) => { 
                            // Attendance records will be empty or fetched separately in a real app
                            const records = attendanceData[student.id] || []; 
                            return (
                                <tr key={student.id}>
                                    <td className="fixed-col vs-id-text">{student.id}</td>
                                    <td className="fixed-col" style={{fontWeight: '600'}}>{student.name}</td>
                                    <td className="fixed-col">{student.type}</td>
                                    {ATTENDANCE_DATES.map((_, idx) => (
                                        <AttendanceCell 
                                            key={idx}
                                            status={records[idx] || 'A'} 
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
                
                {/* 1. Header (Keep existing) */}
                <header className="vs-header">
                    <div className="vs-search-container">
                        <SearchIcon className="vs-search-icon" />
                        <input type="text" placeholder="Search students" className="vs-search-input" />
                    </div>
                    
                    {/* Toolbar for Attendance Mode (Top Left in screenshot) */}
                    {viewOption === 'Attendance' && (
                        <div className="vs-top-toolbar">
                            <button className="vs-btn vs-btn-white-outline" onClick={() => alert("Add Column Logic")}>
                                <PlusIcon size={14}/> Add Column
                            </button>
                            <button className="vs-btn vs-btn-white-outline" onClick={() => alert("Export Excel")}>
                                <UploadIcon size={14}/> Export Excel
                            </button>
                        </div>
                    )}

                    <div className="vs-header-actions">
                        <BellIcon className="vs-icon" />
                        <HelpIcon className="vs-icon" />
                    </div>
                </header>

                {/* 2. Floating Filter Bar (Keep existing) */}
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
                    {/* Title Row (Keep existing) */}
                    {viewOption === 'Student Information' && (
                        <div className="vs-card-header">
                            <h1>BSIT -3D</h1>
                            <span className="vs-subtitle">Introduction to Programming</span>
                        </div>
                    )}

                    {/* Share Banner (Keep existing) */}
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

                    {/* Dropdown Menu & Contextual Buttons (Keep existing) */}
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

                    {/* Add Student Button (Info View Only) (Keep existing) */}
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

                    {/* Legend (Only for Attendance) (Keep existing) */}
                    {viewOption === 'Attendance' && (
                        <div className="vs-legend">
                            <div className="vs-legend-item"><span className="vs-p-pill">P</span> Present</div>
                            <div className="vs-legend-item"><span className="vs-a-pill">A</span> Absent</div>
                            <div className="vs-legend-item"><span className="vs-l-pill">L</span> Absent (Late)</div>
                        </div>
                    )}

                </div>
            </div>

            {/* UPDATED Modal with new prop */}
            <AddStudentFormModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onStudentAdded={handleStudentAdded} 
            />
        </div>
    );
};

export default ViewStuds;