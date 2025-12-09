// src/components/assets/Loginsignin/LoginSignUp.jsx

import React, { useState, useEffect } from 'react';
import './LoginSignUp.css';
import MyBackgroundImage from './cdmBack.png'; 
import Cdm from './cdmm.png';

// FIREBASE IMPORTS
import { auth, db } from '../../../apiService'; 
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    GoogleAuthProvider, 
    signInWithPopup,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 

const LoginSignUp = ({ onLogin }) => { 

    const [isLoginView, setIsLoginView] = useState(true);
    const [isResetView, setIsResetView] = useState(false); // Toggle for Forgot Password
    
    // Auth States
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Reset Password States
    const [resetMethod, setResetMethod] = useState('email'); // 'email' or 'sms'
    const [resetAttempts, setResetAttempts] = useState(0);
    const [isLockedOut, setIsLockedOut] = useState(false);
    const [lockoutTimer, setLockoutTimer] = useState(0);

    // UI States
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    
    // --- SPAM PROTECTION LOGIC ---
    useEffect(() => {
        let timer;
        if (isLockedOut && lockoutTimer > 0) {
            timer = setInterval(() => {
                setLockoutTimer((prev) => prev - 1);
            }, 1000);
        } else if (lockoutTimer === 0) {
            setIsLockedOut(false);
        }
        return () => clearInterval(timer);
    }, [isLockedOut, lockoutTimer]);

    const checkSpamLimit = () => {
        if (isLockedOut) return false;

        // Thresholds
        const SOFT_LIMIT = 3;
        const HARD_LIMIT = 6;

        const newAttempts = resetAttempts + 1;
        setResetAttempts(newAttempts);

        if (newAttempts >= HARD_LIMIT) {
            setIsLockedOut(true);
            setLockoutTimer(300); // 5 Minutes Hard Ban
            setError('CRITICAL WARNING: Too many requests. Access blocked for 5 minutes.');
            return false;
        } else if (newAttempts >= SOFT_LIMIT) {
            setIsLockedOut(true);
            setLockoutTimer(30); // 30 Seconds Soft Ban
            setError('Please slow down. You are sending requests too quickly.');
            return false;
        }
        return true;
    };

    // Function to clear states and switch the view (Login <-> Signup)
    const switchView = () => {
        setIsLoginView(!isLoginView);
        setIsResetView(false);
        setError('');
        setSuccessMsg('');
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };
    
    // --- LOGIC FOR GOOGLE SIGN-IN ---
    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        const provider = new GoogleAuthProvider();
        
        try {
            await signInWithPopup(auth, provider);
            console.log('Google Sign-In successful');
            onLogin(); 
        } catch (firebaseError) {
            console.error("Google Sign-In Error: ", firebaseError);
            if (firebaseError.code === 'auth/popup-closed-by-user') {
                 setError('Google sign-in window closed. Please try again.');
            } else {
                 setError('Google Sign-In failed: ' + firebaseError.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC FOR EMAIL/PASSWORD LOGIN ---
    const handleLogin = async (e) => { 
        e.preventDefault(); 
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Please fill in both Email and Password.');
            setLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Firebase Login successful');
            onLogin(); 
        } catch (firebaseError) {
            console.error('Login Failed:', firebaseError.message);
            if (firebaseError.code === 'auth/invalid-credential' || firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
                setError('Invalid Email or Password.');
            } else {
                setError('Login failed: ' + firebaseError.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC FOR SIGN UP ---
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== confirmPassword) {
             setError("Passwords do not match.");
             setLoading(false);
             return;
        }
        if (password.length < 6) {
             setError("Password must be at least 6 characters.");
             setLoading(false);
             return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create User Document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                fullName: fullName,
                email: email,
                role: 'teacher', 
                createdAt: new Date()
            });

            console.log('Account created successfully!');
            onLogin(); 
        } catch (firebaseError) {
            console.error("Signup Error: ", firebaseError);
            if (firebaseError.code === 'auth/email-already-in-use') {
                 setError('This email is already registered. Please login.');
            } else {
                 setError(firebaseError.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC FOR PASSWORD RESET (EMAIL & SMS) ---
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        // 1. Check Spam Limits
        if (!checkSpamLimit()) return;

        setLoading(true);

        try {
            if (resetMethod === 'email') {
                if (!email) throw new Error("Please enter your email address.");
                
                await sendPasswordResetEmail(auth, email);
                setSuccessMsg(`Reset link sent to ${email}. Check your inbox or spam folder.`);
            } 
            else if (resetMethod === 'sms') {
                if (!phoneNumber) throw new Error("Please enter your mobile number.");
                
                // NOTE: Actual SMS sending requires a backend (e.g., Twilio) or Firebase Phone Auth integration.
                // This is a simulation of the successful UI flow.
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
                console.log(`Simulating SMS send to ${phoneNumber}`);
                
                setSuccessMsg(`OTP Code sent to ${phoneNumber}. (SMS Feature requires backend integration)`);
            }
        } catch (err) {
            setError(err.message.replace('Firebase:', '').trim());
        } finally {
            setLoading(false);
        }
    };
    
    return (
       <div className="login-wrapper"
           style={{
               backgroundImage: `url(${MyBackgroundImage})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               minHeight: '100vh',
               padding: '2rem',
           }}
       >
           <div className="container">
                {/* Logo Area */}
                <div className="logo-area">
                    <img src={Cdm} alt="Colegio de Montalban Logo" className="logo-image" />
                </div>

                {/* Auth Form Card */}
                <div className={`login-card ${isLockedOut ? 'shaking-warning' : ''}`}>
                    
                    {/* Header Text Logic */}
                    <h2>
                        {isResetView ? 'Reset Password' : (isLoginView ? 'Professor Portal' : 'Create Account')}
                    </h2>
                    
                    <p style={{marginBottom: '1.5rem'}}>
                        {isResetView 
                            ? 'Recover your account access safely.'
                            : (isLoginView 
                                ? 'Welcome back! Please login to access your dashboard.' 
                                : 'Join us and track your student progress')}
                    </p>

                    {/* --- VIEW 1: PASSWORD RESET FORM --- */}
                    {isResetView ? (
                        <form onSubmit={handlePasswordReset}>
                            
                            {/* Reset Method Toggles */}
                            <div className="reset-toggles">
                                <button 
                                    type="button" 
                                    className={resetMethod === 'email' ? 'active' : ''}
                                    onClick={() => {setResetMethod('email'); setError(''); setSuccessMsg('');}}
                                >
                                    Via Email
                                </button>
                                <button 
                                    type="button" 
                                    className={resetMethod === 'sms' ? 'active' : ''}
                                    onClick={() => {setResetMethod('sms'); setError(''); setSuccessMsg('');}}
                                >
                                    Via SMS
                                </button>
                            </div>

                            {resetMethod === 'email' ? (
                                <div className="form-group">
                                    <label htmlFor="resetEmail">Email Address</label>
                                    <input
                                        type="email"
                                        id="resetEmail"
                                        placeholder="Enter your registered email"
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                    />
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label htmlFor="resetPhone">Mobile Number</label>
                                    <input
                                        type="tel"
                                        id="resetPhone"
                                        placeholder="+63 900 000 0000"
                                        value={phoneNumber} 
                                        onChange={(e) => setPhoneNumber(e.target.value)} 
                                    />
                                </div>
                            )}

                            {/* LOCKOUT COUNTER */}
                            {isLockedOut && (
                                <div className="lockout-timer">
                                    Please wait {lockoutTimer}s before trying again.
                                </div>
                            )}

                            {/* MESSAGES */}
                            {error && <div className="error-message">{error}</div>}
                            {successMsg && <div className="success-message">{successMsg}</div>}

                            <button type="submit" className="login-btn" disabled={loading || isLockedOut}>
                                {loading ? 'Sending...' : 'Send Reset Code'}
                            </button>

                            <div className="signup-area">
                                <button 
                                    type="button"
                                    onClick={() => { setIsResetView(false); setError(''); setSuccessMsg(''); }}
                                    style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    ) : (
                        
                    /* --- VIEW 2: LOGIN & SIGNUP FORMS --- */
                    <form onSubmit={isLoginView ? handleLogin : handleSignUp}> 

                        {/* FULL NAME (Sign Up Only) */}
                        {!isLoginView && (
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    placeholder="Ex. Juan Dela Cruz"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        )}

                        {/* EMAIL FIELD */}
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                required
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>

                        {/* PASSWORD FIELD */}
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder={isLoginView ? 'Enter your password' : 'Create a password'}
                                required
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>
                        
                        {/* CONFIRM PASSWORD (Sign Up Only) */}
                        {!isLoginView && (
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Repeat your password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        )}

                        {/* ERROR DISPLAY */}
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        {/* FORGOT PASSWORD LINK (Login Only) */}
                        {isLoginView && (
                            <div className="options-row" style={{justifyContent: 'flex-end'}}>
                                <div className="forgot-password">
                                    <button 
                                        type="button" 
                                        onClick={() => { setIsResetView(true); setError(''); }}
                                        style={{background: 'none', border:'none', color:'#3B82F6', cursor:'pointer', padding:0, fontWeight: 500}}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading 
                                ? (isLoginView ? 'Logging in...' : 'Creating Account...') 
                                : (isLoginView ? 'Login' : 'Sign Up')
                            }
                        </button>

                        <div className="separator">Or continue with</div>
                        
                        <button 
                             type="button"
                             className="google-btn" 
                             onClick={handleGoogleSignIn} 
                             disabled={loading}
                        >
                             Sign in with Google
                        </button>
                    </form>
                    )}

                    {/* SWITCH VIEW BUTTON (Hidden during Reset Mode) */}
                    {!isResetView && (
                        <div className="signup-area">
                            <p>{isLoginView ? "Don't have an account?" : "Already have an account?"}</p>
                            <button 
                                 onClick={switchView}
                                 style={{ 
                                     background: 'none', 
                                     border: 'none', 
                                     color: '#007bff', 
                                     fontWeight: 'bold', 
                                     cursor: 'pointer', 
                                     textDecoration: 'underline',
                                     fontSize: '0.9rem',
                                     padding: '0',
                                     marginLeft: '5px'
                                 }}
                            >
                                 {isLoginView ? 'Sign up' : 'Login here'}
                            </button>
                        </div>
                    )}
                </div>
           </div>
       </div>
    );
};

export default LoginSignUp;