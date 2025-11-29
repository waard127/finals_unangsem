// src/components/assets/Reports/ViewRD.jsx

import React, { useState } from 'react';
import './ViewRD.css';
import { Sidebar, SIDEBAR_DEFAULT_WIDTH } from '../Dashboard/Sidebar';

// Icons
const ArrowLeft = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>);
const AlertTriangle = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);
const Clipboard = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>);

// Simple Bar Chart Component (CSS Based)
const SimpleBarChart = () => {
    const data = [
        { label: 'Q1', score: 45, color: '#F87171' },
        { label: 'Q2', score: 60, color: '#FBBF24' },
        { label: 'Q3', score: 75, color: '#34D399' },
        { label: 'Mid', score: 50, color: '#FBBF24' },
        { label: 'Act1', score: 85, color: '#34D399' },
        { label: 'Act2', score: 30, color: '#EF4444' },
    ];

    return (
        <div className="vrd-chart-container">
            <h3>Performance Overview</h3>
            <div className="vrd-bars-wrapper">
                {data.map((item, index) => (
                    <div key={index} className="vrd-bar-group">
                        <div className="vrd-bar-track">
                            <div 
                                className="vrd-bar-fill" 
                                style={{ height: `${item.score}%`, backgroundColor: item.color }}
                            >
                                <span className="vrd-bar-tooltip">{item.score}%</span>
                            </div>
                        </div>
                        <span className="vrd-bar-label">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ViewRD = ({ onLogout, onPageChange }) => {
    const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);

    return (
        <div className="vrd-layout">
            <Sidebar 
                onLogout={onLogout} 
                onPageChange={onPageChange}
                currentPage="reports"
                onWidthChange={setSidebarWidth}
            />

            <main className="vrd-main" style={{ marginLeft: sidebarWidth }}>
                
                {/* Header */}
                <div className="vrd-header">
                    <button className="vrd-back-btn" onClick={() => onPageChange('v-reports')}>
                        <ArrowLeft /> Back to List
                    </button>
                    <div className="vrd-student-profile">
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Student" className="vrd-avatar" />
                        <div>
                            <h1>Carol Martinez</h1>
                            <p>ID: CS2023001 • High Risk</p>
                        </div>
                    </div>
                </div>

                <div className="vrd-grid">
                    {/* Left Column: Missing & Low Scores */}
                    <div className="vrd-col-left">
                        
                        {/* Missing Outputs Card */}
                        <div className="vrd-card vrd-danger-border">
                            <div className="vrd-card-header">
                                <AlertTriangle size={20} color="#EF4444" />
                                <h2>Missing Outputs</h2>
                            </div>
                            <ul className="vrd-list">
                                <li>
                                    <span>Assignment #3: Data Structures</span>
                                    <span className="vrd-tag-red">Missing</span>
                                </li>
                                <li>
                                    <span>Quiz #2: Arrays</span>
                                    <span className="vrd-tag-red">Missing</span>
                                </li>
                                <li>
                                    <span>Lab Activity #4</span>
                                    <span className="vrd-tag-red">Missing</span>
                                </li>
                            </ul>
                        </div>

                        {/* Low Scores Card */}
                        <div className="vrd-card vrd-warning-border">
                            <div className="vrd-card-header">
                                <Clipboard size={20} color="#F59E0B" />
                                <h2>Low Score Outputs</h2>
                            </div>
                            <ul className="vrd-list">
                                <li>
                                    <span>Quiz #1: Intro to C++</span>
                                    <span className="vrd-tag-orange">45/100</span>
                                </li>
                                <li>
                                    <span>Midterm Exam</span>
                                    <span className="vrd-tag-orange">50/100</span>
                                </li>
                            </ul>
                        </div>

                    </div>

                    {/* Right Column: Analytics */}
                    <div className="vrd-col-right">
                        <div className="vrd-card vrd-chart-card">
                            <SimpleBarChart />
                        </div>
                        
                        <div className="vrd-card">
                            <h3>Instructor Notes</h3>
                            <p className="vrd-notes">
                                Student is struggling with basic syntax and logic formulation. 
                                Attendance has dropped significantly in the last two weeks. 
                                Recommended for remedial classes on Fridays.
                            </p>
                            <button className="vrd-action-btn">Send Warning Email</button>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default ViewRD;