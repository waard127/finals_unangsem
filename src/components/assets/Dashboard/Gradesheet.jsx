// src/components/assets/Dashboard/Gradesheet.jsx

import React, { useState } from 'react';
import './Gradesheet.css';
import { Sidebar, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';
import { AddColumnModal, AddStudentModal } from './ModalComponents'; 

// --- ICONS ---
const ArrowLeft = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>);
const Filter = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>);
const Download = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const Save = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>);
const Plus = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const Trash = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>);
const Search = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const UsersGroup = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);

// --- MOCK DATA ---
const INITIAL_DATA = [
    { id: '2024001', name: 'Anderson, James', type: 'Irregular', grades: { attendance: 95, assignment: 92, quizzes: 88, activity: 90, midterm: 87, recitation: 95, assignment2: 92, quizzes2: 88, activity2: 90, finals: 87 } },
    { id: '2024002', name: 'Bennett, Sarah', type: 'Regular', grades: { attendance: 70, assignment: 71, quizzes: 70, activity: 67, midterm: 68, recitation: 70, assignment2: 70, quizzes2: 70, activity2: 70, finals: 70 } },
    { id: '2024003', name: 'Carter, Michael', type: 'Regular', grades: { attendance: 85, assignment: 82, quizzes: 88, activity: 80, midterm: 83, recitation: 85, assignment2: 82, quizzes2: 88, activity2: 80, finals: 83 } },
];

const Gradesheet = ({ onLogout, onPageChange }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_COLLAPSED_WIDTH);
    const [gradesData, setGradesData] = useState(INITIAL_DATA);
    
    // --- STATE FOR SELECTION & MODALS ---
    const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
    const [isAddRowOpen, setIsAddRowOpen] = useState(false);
    const [selectedRowIds, setSelectedRowIds] = useState([]);

    const handleHeaderClick = (title, type, term) => {
        onPageChange('multipage-gradesheet', { viewType: type, title: title, term: term });
    };

    // Toggle single row
    const toggleRowSelection = (id) => {
        setSelectedRowIds(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    // Toggle all rows
    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRowIds(gradesData.map(s => s.id));
        } else {
            setSelectedRowIds([]);
        }
    };

    // Delete Logic
    const handleDeleteSelected = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedRowIds.length} student(s)?`)) {
            const newData = gradesData.filter(student => !selectedRowIds.includes(student.id));
            setGradesData(newData);
            setSelectedRowIds([]); // Clear selection
        }
    };

    return (
        <div className="gradesheet-layout">
            <Sidebar onLogout={onLogout} onPageChange={onPageChange} currentPage="dashboard" onWidthChange={setSidebarWidth} />

            <main className="gradesheet-main" style={{ marginLeft: sidebarWidth }}>
                
                {/* --- HEADER --- */}
                <div className="gs-header-container">
                    <div className="gs-header-left">
                        <button className="gs-back-btn" onClick={() => onPageChange('view-studs')}>
                            <ArrowLeft />
                        </button>
                        <div>
                            <h1 className="gs-title">CS101 - Section A</h1>
                            <p className="gs-subtitle">Computer Science • 1st Year • Fall 2024</p>
                        </div>
                    </div>
                    <div className="gs-header-right">
                        <button className="gs-btn gs-btn-white"><Filter size={16} /> Filter</button>
                        <button className="gs-btn gs-btn-white"><Download size={16} /> Export</button>
                        <button className="gs-btn gs-btn-primary"><Save size={16} /> Save Changes</button>
                    </div>
                </div>

                {/* --- TOOLBAR --- */}
                <div className="gs-toolbar">
                    <div className="gs-tools-left">
                        {/* CONDITIONAL DELETE BUTTON */}
                        {selectedRowIds.length > 0 ? (
                            <button className="gs-tool-btn" style={{backgroundColor: '#FEE2E2', color: '#DC2626'}} onClick={handleDeleteSelected}>
                                <Trash size={14} /> Delete ({selectedRowIds.length})
                            </button>
                        ) : (
                            <>
                                <button className="gs-tool-btn" onClick={() => setIsAddColumnOpen(true)}>
                                    <Plus size={14} /> Add Column
                                </button>
                                <button className="gs-tool-btn" onClick={() => setIsAddRowOpen(true)}>
                                    <Plus size={14} /> Add Row
                                </button>
                            </>
                        )}
                        
                        <button className="gs-tool-btn">Export Excel</button>
                    </div>
                    <div className="gs-search-wrapper">
                        <Search className="gs-search-icon" size={16} />
                        <input type="text" placeholder="Search student..." className="gs-search-input" />
                    </div>
                </div>

                {/* --- TABLE --- */}
                <div className="gs-table-wrapper">
                    <table className="gs-table">
                        <thead>
                            <tr>
                                {/* CHECKBOX COLUMN HEADER */}
                                <th className="fixed-col" style={{width: '40px', paddingLeft: '1rem'}}>
                                    <input 
                                        type="checkbox" 
                                        onChange={toggleSelectAll} 
                                        checked={gradesData.length > 0 && selectedRowIds.length === gradesData.length}
                                        style={{cursor: 'pointer'}}
                                    />
                                </th>
                                <th className="fixed-col">Student ID</th>
                                <th className="fixed-col">Student Name</th>
                                <th className="fixed-col">Type of Student</th>
                                
                                {/* --- MIDTERM COLUMNS --- */}
                                <th><button className="gs-pill gs-pill-green gs-pill-clickable" onClick={() => handleHeaderClick('Attendance', 'Attendance', 'Midterm')}>Attendance</button></th>
                                <th><button className="gs-pill gs-pill-green gs-pill-clickable" onClick={() => handleHeaderClick('Assignment', 'Activity', 'Midterm')}>Assignment</button></th>
                                <th><button className="gs-pill gs-pill-green gs-pill-clickable" onClick={() => handleHeaderClick('Quiz', 'Activity', 'Midterm')}>Quizzes</button></th>
                                <th><button className="gs-pill gs-pill-green gs-pill-clickable" onClick={() => handleHeaderClick('Activity', 'Activity', 'Midterm')}>Activity</button></th>
                                <th>Midterm</th>
                                
                                {/* --- FINALS COLUMNS --- */}
                                <th><button className="gs-pill gs-pill-green gs-pill-clickable" onClick={() => handleHeaderClick('Recitation', 'Activity', 'Finals')}>Recitation</button></th>
                                <th><button className="gs-pill gs-pill-green gs-pill-clickable" onClick={() => handleHeaderClick('Assignment', 'Activity', 'Finals')}>Assignment</button></th>
                                <th><button className="gs-pill gs-pill-green gs-pill-clickable" onClick={() => handleHeaderClick('Quiz', 'Activity', 'Finals')}>Quizzes</button></th>
                                <th><button className="gs-pill gs-pill-green gs-pill-clickable" onClick={() => handleHeaderClick('Activity', 'Activity', 'Finals')}>Activity</button></th>
                                <th>Finals</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gradesData.map((student) => (
                                <tr key={student.id} style={{backgroundColor: selectedRowIds.includes(student.id) ? '#F3F4F6' : 'white'}}>
                                    {/* CHECKBOX CELL */}
                                    <td className="fixed-col" style={{paddingLeft: '1rem'}}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedRowIds.includes(student.id)}
                                            onChange={() => toggleRowSelection(student.id)}
                                            style={{cursor: 'pointer'}}
                                        />
                                    </td>
                                    <td className="fixed-col gs-id-cell">{student.id}</td>
                                    <td className="fixed-col font-bold">{student.name}</td>
                                    <td className="fixed-col">
                                        <span className={`gs-badge ${student.type === 'Regular' ? 'badge-reg' : 'badge-irreg'}`}>
                                            {student.type}
                                        </span>
                                    </td>
                                    <td><input type="text" defaultValue={student.grades.attendance} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.assignment} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.quizzes} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.activity} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.midterm} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.recitation} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.assignment2} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.quizzes2} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.activity2} className="gs-input" /></td>
                                    <td><input type="text" defaultValue={student.grades.finals} className="gs-input" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- FOOTER --- */}
                <div className="gs-footer-card">
                    <div>
                        <span className="gs-footer-label">Total Students</span>
                        <div className="gs-footer-count">{gradesData.length}</div>
                    </div>
                    <div className="gs-footer-icon-box"><UsersGroup size={24} /></div>
                </div>

            </main>

            <AddColumnModal isOpen={isAddColumnOpen} onClose={() => setIsAddColumnOpen(false)} />
            <AddStudentModal isOpen={isAddRowOpen} onClose={() => setIsAddRowOpen(false)} />

        </div>
    );
};

export default Gradesheet;