import React, { useState, useEffect } from 'react';

// --- IMPORTS FOR DASHBOARD FUNCTIONALITY ---
// NOTE: Adjust the path if your apiService is not three levels up
import { auth } from '../../../apiService';
import { 
    Sidebar, 
    SIDEBAR_DEFAULT_WIDTH, 
    SIDEBAR_EXPANDED_WIDTH,
    BarChart3Icon as ReportsIcon // Alias for clarity in METRICS_DATA
} from './Sidebar.jsx'; 
// --------------------------------------------------

// --- INLINE SVG ICONS (ONLY those needed by Dashboard main content/header/cards) ---
const Menu = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>);
const SearchIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const User = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const GraduationCap = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.012-1.84l-8-4a1 1 0 0 0-.976 0l-8 4a1 1 0 0 0 0 1.84l8 4a1 1 0 0 0 .976 0l8-4Z"/><path d="M12 19c2.33 0 5.67-.67 7-2v-3.84"/><path d="M12 19c-2.33 0-5.67-.67-7-2v-3.84"/><polyline points="7.5 7.6 12 10 16.5 7.6"/><path d="M22 17V8"/><path d="M6 17V8"/></svg>);
const BookOpen = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>);
const Users = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const TrendingUp = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>);
// The Bell icon provided by the user (Notification icon)
const Bell = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.36 17a3 3 0 1 0 3.28 0"/></svg>);
// NEW: Microphone Icon (Mic Icon)
const Mic = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>);
// ----------------------------------------------------------------------------------

// Placeholder data for metrics
const METRICS_DATA = [
    { label: 'Reports Generated', value: 45, icon: ReportsIcon, color: '#059669' },
    { label: 'Total System Users', value: 540, icon: Users, color: '#F59E0B' },
    { label: 'Active Sections Managed', value: 12, icon: BookOpen, color: '#3B82F6' },
    { label: 'Overall Performance', value: '88%', icon: TrendingUp, color: '#EF4444' },
];

// Placeholder data for Class Cards
const CLASSES_DATA = [
    { section: 'Section A', year: '1st Year', students: 40, performance: '92%', status: 'Excellent' },
    { section: 'Section B', year: '1st Year', students: 38, performance: '85%', status: 'Good' },
    { section: 'Section C', year: '2nd Year', students: 35, performance: '75%', status: 'Average' },
    { section: 'Section D', year: '2nd Year', students: 42, performance: '95%', status: 'Outstanding' },
];

// Placeholder data for Filters
const INSTITUTE_OPTIONS = ['Institute Of Computer Studies', 'Institute of Business', 'Institute of Education'];
const YEAR_LEVEL_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4rd Year'];
const SECTION_OPTIONS = ['A', 'B', 'C', 'D', 'E'];

// --- Utility Components ---

// Metric Card Component
const MetricCard = ({ label, value, icon: Icon, color }) => (
    <div style={{ 
        padding: '1.5rem', 
        backgroundColor: 'white', 
        borderRadius: '0.75rem', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        borderLeft: `5px solid ${color}`,
    }}>
        <div style={{ padding: '0.75rem', backgroundColor: color, borderRadius: '9999px' }}>
            <Icon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
        </div>
        <div>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>{label}</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: 0 }}>{value}</h3>
        </div>
    </div>
);

// Class Card Component
const ClassCard = ({ data }) => (
    <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #E5E7EB',
        transition: 'transform 0.2s',
        cursor: 'pointer'
    }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#38761d', margin: 0 }}>{data.year} - {data.section}</h4>
            <div style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '9999px',
                backgroundColor: data.status === 'Outstanding' ? '#D1FAE5' : (data.status === 'Excellent' ? '#FDE68A' : '#FEE2E2'),
                color: data.status === 'Outstanding' ? '#065F46' : (data.status === 'Excellent' ? '#B45309' : '#991B1B')
            }}>
                {data.status}
            </div>
        </div>
        <p style={{ margin: '0.5rem 0', color: '#4B5563' }}>
            <Users style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
            Students: <span style={{ fontWeight: '600' }}>{data.students}</span>
        </p>
        <p style={{ margin: '0.5rem 0', color: '#4B5563' }}>
            <ReportsIcon style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
            Average Grade: <span style={{ fontWeight: '600' }}>{data.performance}</span>
        </p>
        <button style={{ 
            width: '100%', 
            padding: '0.5rem', 
            backgroundColor: '#38761d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '0.5rem', 
            marginTop: '1rem',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'background-color 0.2s'
        }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#275d13'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#38761d'}>
            View Detailed Report
        </button>
    </div>
);

// --- Main Dashboard Component ---

const Dashboard = ({ onLogout, onPageChange, profileData }) => {
    // Determine the expanded width for the Dashboard layout based on Sidebar constants
    const SIDEBAR_EXPANDED_WIDTH = 250; // Assuming 250px, should be imported from Sidebar.jsx

    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const isDesktopMode = window.innerWidth >= 1024;

    const [filterState, setFilterState] = useState({
        institute: '',
        yearLevel: '',
        section: ''
    });

    const handleFilterChange = (e) => {
        setFilterState({
            ...filterState,
            [e.target.name]: e.target.value
        });
    };

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

    // Get Greeting Time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            <Sidebar 
                onLogout={onLogout} 
                onPageChange={onPageChange}
                currentPage={'dashboard'}
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
                            <SearchIcon style={{ position: 'absolute', left: '1rem', width: '1rem', height: '1rem', color: '#9CA3AF' }} />
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

                {/* Main Dashboard Content */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                        {getGreeting()}, {profileData?.displayName || 'Administrator'}!
                    </h1>
                    <p style={{ fontSize: '1rem', color: '#6B7280', margin: '0.25rem 0 0 0' }}>
                        Welcome back to your data dashboard.
                    </p>
                </div>
                
                {/* Metrics Cards */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isDesktopMode ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)', 
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {/* Using profileData for dynamic metrics, falling back to placeholders */}
                    <MetricCard 
                        label={METRICS_DATA[0].label} 
                        value={profileData?.stats?.reportsGenerated || METRICS_DATA[0].value} 
                        icon={METRICS_DATA[0].icon} 
                        color={METRICS_DATA[0].color} 
                    />
                    <MetricCard 
                        label={METRICS_DATA[1].label} 
                        value={profileData?.stats?.totalSystemUsers || METRICS_DATA[1].value} 
                        icon={METRICS_DATA[1].icon} 
                        color={METRICS_DATA[1].color} 
                    />
                    <MetricCard 
                        label={METRICS_DATA[2].label} 
                        value={profileData?.stats?.activeSectionsManaged || METRICS_DATA[2].value} 
                        icon={METRICS_DATA[2].icon} 
                        color={METRICS_DATA[2].color} 
                    />
                    {/* Overall Performance is typically calculated, keeping it static for now */}
                    <MetricCard 
                        label={METRICS_DATA[3].label} 
                        value={METRICS_DATA[3].value} 
                        icon={METRICS_DATA[3].icon} 
                        color={METRICS_DATA[3].color} 
                    />
                </div>

                {/* Filters and Class Cards */}
                <div style={{ 
                    backgroundColor: 'white', 
                    padding: '1.5rem', 
                    borderRadius: '0.75rem', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    marginBottom: '2rem' 
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Section Quick View</h2>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        
                        {/* Institute Filter */}
                        <select 
                            name="institute"
                            value={filterState.institute} 
                            onChange={handleFilterChange} 
                            style={{ padding: '0.5rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', minWidth: '150px' }}
                        >
                            <option value="">Select Institute</option>
                            {INSTITUTE_OPTIONS.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                        </select>

                        {/* Year Level Filter */}
                        <select 
                            name="yearLevel"
                            value={filterState.yearLevel} 
                            onChange={handleFilterChange}
                            style={{ padding: '0.5rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', minWidth: '150px' }}
                        >
                            <option value="">Select Year Level</option>
                            {YEAR_LEVEL_OPTIONS.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>

                        {/* Section Filter */}
                        <select 
                            name="section"
                            value={filterState.section} 
                            onChange={handleFilterChange}
                            style={{ padding: '0.5rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', minWidth: '150px' }}
                        >
                            <option value="">Select Section</option>
                            {SECTION_OPTIONS.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                        </select>
                    </div>

                    {/* Class Cards Grid */}
                    {(filterState.institute && filterState.yearLevel && filterState.section) ? (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: isDesktopMode ? 'repeat(4, 1fr)' : 'repeat(1, 1fr)', 
                            gap: '1.5rem' 
                        }}>
                            {CLASSES_DATA.map((classData, index) => (
                                <ClassCard key={index} data={classData} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#F9FAFB', borderRadius: '0.75rem', boxShadow: 'inset 0 1px 3px 0 rgba(0, 0, 0, 0.05)', border: '1px dashed #D1D5DB' }}>
                            <GraduationCap style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', color: '#38761d' }} />
                            <p style={{ fontSize: '1.125rem', color: '#4B5563', fontWeight: '500' }}>
                                Choose the <span style={{ fontWeight: 'bold', color: '#059669' }}>Institute</span>, <span style={{ fontWeight: 'bold', color: '#059669' }}>Year Level</span>, and <span style={{ fontWeight: 'bold', color: '#059669' }}>Section</span> to see your data.
                            </p>
                        </div>
                    )}
                </div>
                
            </main>
        </div>
    );
};

export default Dashboard;