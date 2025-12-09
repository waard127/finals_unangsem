// src/components/assets/Loginsignin/LandingPage.jsx

import React, { useEffect, useState } from 'react';
import './LandingPage.css'; // Ensure this CSS file is also in the Loginsignin folder
import CdmLogo from './cdmm.png'; // <--- FIXED: Now points to the file in the same folder

const LandingPage = ({ onGetStarted }) => {
    
    // --- ANIMATION ON SCROLL LOGIC ---
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        });

        const hiddenElements = document.querySelectorAll('.animate-on-scroll');
        hiddenElements.forEach((el) => observer.observe(el));
        
        return () => hiddenElements.forEach(el => observer.unobserve(el));
    }, []);

    // --- CAROUSEL LOGIC ---
    const [activeFeature, setActiveFeature] = useState(0);
    const features = [
        { title: "Student Tracking", desc: "Monitor academic progress in real-time." },
        { title: "Secure Portal", desc: "Enterprise-grade security for your data." },
        { title: "Easy Grading", desc: "Automated tools to calculate grades instantly." },
        { title: "Instant Alerts", desc: "Notify students via Email or SMS quickly." },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [features.length]);

    return (
        <div className="landing-container">
            
            {/* HERO SECTION */}
            <header className="hero-section">
                <nav className="navbar">
                    <img src={CdmLogo} alt="CDM Logo" className="nav-logo"/>
                    <button className="nav-login-btn" onClick={onGetStarted}>Login Portal</button>
                </nav>
                
                <div className="hero-content animate-on-scroll">
                    <h1>Colegio de Montalban <br/> <span className="highlight">Professor Portal</span></h1>
                    <p>Streamlining education management with cutting-edge technology.</p>
                    <button className="cta-button" onClick={onGetStarted}>
                        Get Started
                    </button>
                </div>
            </header>

            {/* ANIMATED CAROUSEL SECTION */}
            <section className="features-section animate-on-scroll">
                <h2>Why Choose Our Portal?</h2>
                <div className="carousel-window">
                    <div 
                        className="carousel-track" 
                        style={{ transform: `translateX(-${activeFeature * 100}%)` }}
                    >
                        {features.map((feat, index) => (
                            <div className="carousel-card" key={index}>
                                <h3>{feat.title}</h3>
                                <p>{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="carousel-indicators">
                    {features.map((_, idx) => (
                        <span 
                            key={idx} 
                            className={`dot ${idx === activeFeature ? 'active' : ''}`}
                            onClick={() => setActiveFeature(idx)}
                        ></span>
                    ))}
                </div>
            </section>

            {/* INFO SECTION */}
            <section className="info-section animate-on-scroll">
                <div className="info-text">
                    <h2>Manage Less, Teach More.</h2>
                    <p>
                        Our application is designed to remove the administrative burden from professors.
                        Focus on what matters most—your students.
                    </p>
                </div>
            </section>

            {/* FOOTER */}
            <footer>
                <p>&copy; 2024 Colegio de Montalban. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;