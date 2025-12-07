// src/Apps.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- ICONS ---
const BotIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M5 14h14"/></svg>);
const XIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const SendIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
const FlaskIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>);

// ==========================================
// 🔐 SECURITY & CONFIGURATION
// ==========================================

const _KEY_POOL = [
    "c3JjSnlGRTZGMnA3X2ZnY2tPQjRIck9wbEgxbUl2WjJCeVNheklB", // Key 1
    "d1o0TjFRUXFkYndJMnlmWUtwQXUtaWYxdTA1OE52TlFDeVNheklB", // Key 2
    "SWs1Mk5wTXM2ZkVNUlhMbGg5SzcwOU1GUWlHTUtWS0VDeVNheklB"  // Key 3
];

const _API_VER = "L3YxYmV0YS9tb2RlbHMv"; 
const _END_POINT = "Z2VtaW5pLTIuNS1mbGFzaC1wcmV2aWV3LTA5LTIwMjU6Z2VuZXJhdGVDb250ZW50";
const _TELEMETRY_HOST = "aHR0cHM6Ly9nZW5lcmF0aXZlbGFuZ3VhZ2UuZ29vZ2xlYXBpcy5jb20="; 

const _getDecryptedKey = (index) => { 
    try { 
        const raw = _KEY_POOL[index];
        if (!raw) return null;
        return atob(raw).split('').reverse().join(''); 
    } catch(e) { return "DECRYPTION_FAILED"; } 
};
const _sysConfig = (str) => { try { return atob(str); } catch(e) { return ""; } };

// --- DATA GENERATORS ---
const COURSES = ["BSIT", "BSCS", "BSCPE", "BSEd"];
const SECTIONS = ["3D", "3A", "3B", "3C", "4A", "2A", "1B"];
const generateStudentID = () => {
    const year = '23'; 
    const queue = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `${year}-${queue}`;
};

// --- DOM SCANNER ---
const scanPageContent = () => {
    const selector = 'button, a, input, select, textarea, h1, h2, h3, h4';
    const elements = document.querySelectorAll(selector);
    const uiMap = [];
    const getPosition = (rect) => {
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const v = y < winH / 3 ? "Top" : y > (winH * 2) / 3 ? "Bottom" : "Center";
        const h = x < winW / 3 ? "Left" : x > (winW * 2) / 3 ? "Right" : "Center";
        return `${v}-${h}`; 
    };
    elements.forEach((el) => {
        if (el.closest('.chatbot-container')) return;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0 || window.getComputedStyle(el).display === 'none') return;
        let text = el.innerText || el.placeholder || el.getAttribute('aria-label') || el.value || "";
        text = text.replace(/\s+/g, ' ').trim().substring(0, 60); 
        if (text) {
            uiMap.push({ type: el.tagName.toLowerCase(), text: text, location: getPosition(rect) });
        }
    });
    return uiMap;
};

// --- SYSTEM PROMPT ---
const BASE_SYSTEM_PROMPT = `
You are 'Cidi', the AI assistant for Colegio de Montalban.
Be casual, use Taglish, and be helpful.

**CAPABILITIES:**
1. **Automation:** If asked to add students, output JSON.
2. **Navigation Guide:** I will provide you a list of "VISIBLE UI ELEMENTS" currently on the user's screen. Use this to tell the user *exactly* where buttons are.

**AUTOMATION JSON FORMAT:**
- For specific student: { "action": "create_single_student", "data": { "name": "...", "id": "...", "course": "..." } }
- For 1 random: "TRIGGER_RANDOM"
- For 10 random: "TRIGGER_BATCH_10"
`;

// --- UI COMPONENTS ---
const TypewriterEffect = React.memo(({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    useEffect(() => {
        setDisplayedText('');
        let currentString = '';
        let currentIndex = 0;
        const intervalId = setInterval(() => {
            if (currentIndex < text.length) {
                currentString += text.charAt(currentIndex);
                setDisplayedText(currentString); 
                currentIndex++;
            } else {
                clearInterval(intervalId);
                if (onComplete) onComplete();
            }
        }, 15); 
        return () => clearInterval(intervalId);
    }, [text, onComplete]);

    const renderFormatted = (str) => {
        const parts = str.split(/(\*\*.*?\*\*|\n)/g).map((part, index) => {
            if (part === '\n') return <br key={index} />;
            if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
            return part;
        });
        return <>{parts}</>;
    };
    return <p style={{ margin: 0, textAlign: 'left' }}>{renderFormatted(displayedText)}</p>;
});

// --- MAIN COMPONENT ---
// FIXED: Now accepts `professorUid` prop
const CdmChatbot = ({ onPageChange, professorUid }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'bot', text: "Hello! I am Cidi. Switch to Dev Mode to test my connection." }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDevMode, setIsDevMode] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

    const postStudentToDB = async (studentData) => {
        if (!studentData.professorUid || studentData.professorUid === 'MOCK_PROF_ID_123') {
            console.warn("⚠️ Warning: Using mock ID. Student might not appear in dashboard.");
        }
        try {
            const response = await fetch('http://localhost:5000/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            if (response.ok) {
                const event = new CustomEvent('CDM_STUDENT_ADDED', { detail: studentData });
                window.dispatchEvent(event);
                return true;
            }
        } catch (err) { console.error("DB Error:", err); }
        return false;
    };

    const addRandomStudents = async (count) => {
        // --- FIXED: Uses Real Professor ID ---
        const activeUid = professorUid || 'MOCK_PROF_ID_123';
        
        if (onPageChange) onPageChange('view-studs');
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        let successCount = 0;
        const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda"];
        const lastNames = ["Cruz", "Santos", "Reyes", "Garcia", "Bautista", "Ocampo", "Gonzales", "Ramos"];
        
        for (let i = 0; i < count; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            
            const studentData = { 
                id: generateStudentID(), 
                name: `${lastName}, ${firstName}`, 
                type: Math.random() > 0.2 ? 'Regular' : 'Irregular', 
                course: COURSES[Math.floor(Math.random() * COURSES.length)], 
                section: SECTIONS[Math.floor(Math.random() * SECTIONS.length)], 
                cell: '09' + Math.floor(Math.random() * 1000000000).toString(), 
                email: `${firstName.toLowerCase()}@student.cdm.edu.ph`, 
                address: 'Rodriguez, Rizal', 
                professorUid: activeUid // <--- Using Real ID
            };
            
            if (await postStudentToDB(studentData)) successCount++;
            await new Promise(resolve => setTimeout(resolve, 500)); 
        }
        return successCount;
    };

    const addSpecificStudent = async (extractedData) => {
        // --- FIXED: Uses Real Professor ID ---
        const activeUid = professorUid || 'MOCK_PROF_ID_123';

        if (onPageChange) onPageChange('view-studs');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const studentData = { 
            id: extractedData.id || generateStudentID(), 
            name: extractedData.name, 
            type: 'Regular', 
            course: extractedData.course || 'BSIT', 
            section: extractedData.section || '3D', 
            cell: '09123456789', 
            email: `${extractedData.name.replace(/\s+/g, '.').toLowerCase()}@student.cdm.edu.ph`, 
            address: 'Rodriguez, Rizal', 
            professorUid: activeUid // <--- Using Real ID
        };
        
        const success = await postStudentToDB(studentData);
        return success ? studentData : null;
    };

    const debugAllKeys = () => {
        console.group("%c 🔐 API KEY DEBUGGER ", "background: #222; color: #bada55; font-size: 14px; padding: 4px;");
        console.log(`Checking ${_KEY_POOL.length} keys in pool...`);
        _KEY_POOL.forEach((encKey, idx) => {
            const decrypted = _getDecryptedKey(idx);
            const isValid = decrypted && decrypted.startsWith("AIza"); 
            console.group(`Key #${idx + 1} ${isValid ? "✅" : "❌"}`);
            console.log("Encrypted:", encKey.substring(0, 15) + "...");
            console.log("Decrypted:", decrypted); 
            console.log("Status:", isValid ? "Format Looks Correct (AIza...)" : "Format Warning");
            console.groupEnd();
        });
        console.groupEnd();
    };

    // --- FETCH HELPER (With Failover) ---
    const fetchWithFallback = async (urlWithoutKey, options) => {
        let lastError = null;
        for (let i = 0; i < _KEY_POOL.length; i++) {
            const currentKey = _getDecryptedKey(i);
            if (!currentKey || currentKey === "DECRYPTION_FAILED") {
                console.warn(`⚠️ Key #${i + 1} failed local decryption. Skipping.`);
                continue;
            }
            const finalUrl = `${urlWithoutKey}?key=${currentKey}`;
            try {
                if (i > 0) console.warn(`🔄 Switching to Backup Key #${i + 1}...`);
                const response = await fetch(finalUrl, options);
                if (response.ok) {
                    if (i > 0) response.switchedKeyIndex = i; 
                    return response;
                }
                if (response.status === 429 || response.status === 403 || response.status === 400) {
                    console.warn(`⚠️ Key #${i + 1} Failed (Status ${response.status}). Switching...`);
                    lastError = response;
                    continue; 
                }
                return response;
            } catch (err) {
                console.error(`Network fail on Key #${i + 1}`);
                lastError = err;
            }
        }
        console.error("❌ ALL KEYS EXHAUSTED.");
        return lastError || new Response(JSON.stringify({ error: { message: "All keys failed." } }), { status: 500 });
    };

    // --- VERIFY KEY ---
    const handleVerifyKey = async () => {
        setIsLoading(true);
        debugAllKeys();
        setMessages(prev => [...prev, { role: 'bot', text: "🔍 **DEV MODE:** Debugging keys... (Check Console F12)" }]);

        const baseUrl = `${_sysConfig(_TELEMETRY_HOST)}${_sysConfig(_API_VER)}`; 

        try {
            const response = await fetchWithFallback(baseUrl.slice(0, -1), { method: 'GET' });
            if (response.ok) {
                const usedBackup = response.switchedKeyIndex !== undefined;
                setMessages(prev => [...prev, { role: 'bot', text: `✅ **SUCCESS:** Connection established to Gemini 2.5!${usedBackup ? ` (Switched to Backup Key #${response.switchedKeyIndex + 1} 🔑)` : ""}` }]);
            } else {
                const err = await response.json();
                setMessages(prev => [...prev, { role: 'bot', text: `❌ **FAILED:** ${err.error?.message || "All keys exhausted."}` }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', text: "❌ **NETWORK ERROR:** Could not reach Google Servers." }]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- SEND MESSAGE ---
    const handleSendMessage = useCallback(async () => {
        if (!input.trim() || isLoading) return;
        if (isDevMode) { handleVerifyKey(); return; }
        
        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);

        const needsVision = /where|button|click|add|fill|form|navigate|screen|show|menu|open/i.test(userMessage);
        let combinedMessage = "";

        if (needsVision) {
            const uiMap = scanPageContent();
            const uiContextString = uiMap.length > 0 
                ? uiMap.map(el => `- [${el.type}] "${el.text}" is at ${el.location}`).join('\n')
                : "No interactive elements found.";
            combinedMessage = `${BASE_SYSTEM_PROMPT}\n**VISIBLE UI ELEMENTS:**\n${uiContextString}\n**USER QUERY:**\n${userMessage}`;
        } else {
            combinedMessage = `${BASE_SYSTEM_PROMPT}\n**USER QUERY:**\n${userMessage}`;
        }

        const _serviceUrl = `${_sysConfig(_TELEMETRY_HOST)}${_sysConfig(_API_VER)}${_sysConfig(_END_POINT)}`;

        try {
            const response = await fetchWithFallback(_serviceUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: combinedMessage }] }] })
            });
            
            const result = await response.json();
            const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
            
            if (aiText.includes("TRIGGER_BATCH_10")) {
                setMessages(prev => [...prev, { role: 'bot', text: "Generating 10 students for YOU... 🚀" }]);
                setTimeout(async () => { const count = await addRandomStudents(10); setMessages(prev => [...prev, { role: 'bot', text: `Done! Added **${count}** students.` }]); }, 500);
            } 
            else if (aiText.includes("TRIGGER_RANDOM")) {
                setMessages(prev => [...prev, { role: 'bot', text: "Adding one student... 👤" }]);
                setTimeout(async () => { await addRandomStudents(1); setMessages(prev => [...prev, { role: 'bot', text: "Success! Student added." }]); }, 500);
            } 
            else {
                const jsonMatch = aiText.match(/\{[\s\S]*\}/);
                let actionFound = false;
                if (jsonMatch) {
                    try {
                        const parsedData = JSON.parse(jsonMatch[0]);
                        if (parsedData.action === "create_single_student" && parsedData.data) {
                            actionFound = true;
                            setMessages(prev => [...prev, { role: 'bot', text: `Adding **${parsedData.data.name}**... ✍️` }]);
                            setTimeout(async () => { const result = await addSpecificStudent(parsedData.data); if (result) { setMessages(prev => [...prev, { role: 'bot', text: `Added **${result.name}**! ✅` }]); } else { setMessages(prev => [...prev, { role: 'bot', text: "Database error." }]); } }, 500);
                        }
                    } catch (e) {}
                }
                if (!actionFound) setMessages(prev => [...prev, { role: 'bot', text: aiText }]);    
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', text: "AI Error." }]);
        }
        setIsLoading(false);
    }, [input, isLoading, messages, onPageChange, isDevMode, professorUid]); // Added professorUid dependency

    const handleMainAction = () => { isDevMode ? handleVerifyKey() : handleSendMessage(); };
    const handleKeyPress = (e) => { if (e.key === 'Enter' && !isLoading) handleMainAction(); };

    return (
        <div className="chatbot-container">
            <style>{`
                /* ... (Keep your styles exactly the same) ... */
                .chatbot-container { position: fixed; bottom: 20px; right: 20px; z-index: 10000; font-family: 'Inter', sans-serif; }
                .chatbot-toggle { width: 60px; height: 60px; border-radius: 50%; background-color: #38761d; color: white; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.2); cursor: pointer; display: flex; justify-content: center; align-items: center; transition: transform 0.2s; }
                .chatbot-toggle:hover { transform: scale(1.05); background-color: #275d13; }
                .chatbot-widget { width: 350px; height: 500px; display: flex; flex-direction: column; background: #fff; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.3); overflow: hidden; }
                @media (max-width: 400px) { .chatbot-widget { width: 90vw; height: 80vh; } }
                .chat-header { background-color: #38761d; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; }
                .chat-header button { background: none; border: none; color: white; cursor: pointer; }
                .chat-messages { flex-grow: 1; padding: 15px; overflow-y: auto; background-color: #f7f7f7; display: flex; flex-direction: column; gap: 12px; }
                .chat-message { max-width: 80%; padding: 12px 16px; border-radius: 18px; line-height: 1.5; font-size: 0.9rem; word-wrap: break-word; text-align: left; }
                .chat-message.user { align-self: flex-end; background-color: #d1e7dd; color: #0c4a45; border-bottom-right-radius: 2px; }
                .chat-message.bot { align-self: flex-start; background-color: #e0f2f1; color: #004d40; border-bottom-left-radius: 2px; }
                
                .chat-input-wrapper { background: white; border-top: 1px solid #eee; padding: 8px 10px 10px; display: flex; flex-direction: column; gap: 5px; }
                .dev-mode-toggle { display: flex; align-items: center; justify-content: flex-end; gap: 6px; font-size: 0.75rem; color: #666; cursor: pointer; user-select: none; }
                .dev-mode-toggle input { display: none; }
                .toggle-track { width: 24px; height: 14px; background: #ddd; border-radius: 10px; position: relative; transition: background 0.3s; }
                .toggle-knob { width: 10px; height: 10px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: transform 0.3s; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
                .dev-mode-toggle input:checked + .toggle-track { background: #e67c00; }
                .dev-mode-toggle input:checked + .toggle-track .toggle-knob { transform: translateX(10px); }

                .chat-input-area { display: flex; align-items: center; width: 100%; }
                .chat-input-area input { flex-grow: 1; padding: 10px 14px; border: 1px solid #ddd; border-radius: 24px; margin-right: 10px; outline: none; transition: all 0.3s; }
                .chat-input-area .send-btn { width: 36px; height: 36px; border-radius: 50%; background: #38761d; color: white; border: none; cursor: pointer; display: flex; justify-content: center; align-items: center; transition: background 0.3s; }
                
                .chat-input-area.dev-active input { border-color: #e67c00; background-color: #fff8e1; color: #e65100; }
                .chat-input-area.dev-active .send-btn { background: #e67c00; }
                .chat-input-area.dev-active .send-btn:hover { background: #d86900; }

                .typing-dots { display: flex; align-items: center; padding: 8px 0; }
                .typing-dots span { height: 6px; width: 6px; margin: 0 2px; background-color: #00695c; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
                .typing-dots span:nth-child(1) { animation-delay: -0.32s; } .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
                @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
            `}</style>
            
            {isChatOpen ? (
                <div className="chatbot-widget">
                    <div className="chat-header">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '1.1rem', lineHeight: '1.2' }}>Cidi</span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>CDM-AI CHATBOT</span>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} style={{ display: 'flex' }}><XIcon width="24" height="24" /></button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-message ${msg.role === 'bot' ? 'bot' : 'user'}`}>
                                {msg.role === 'bot' && idx === messages.length - 1 && !isLoading 
                                    ? <TypewriterEffect text={msg.text} onComplete={scrollToBottom} /> 
                                    : <p style={{ margin: 0, textAlign: 'left' }}>{msg.text}</p>}
                            </div>
                        ))}
                        {isLoading && <div className="chat-message bot"><div className="typing-dots"><span></span><span></span><span></span></div></div>}
                        <div ref={chatEndRef} />
                    </div>
                    
                    <div className="chat-input-wrapper">
                        <label className="dev-mode-toggle" title="Developer Mode: Verify Key Only">
                            <span style={{ fontWeight: isDevMode ? 'bold' : 'normal', color: isDevMode ? '#e67c00' : '#666' }}>
                                {isDevMode ? "Dev Mode (Verify Only)" : "Dev Mode"}
                            </span>
                            <input type="checkbox" checked={isDevMode} onChange={() => setIsDevMode(!isDevMode)} />
                            <div className="toggle-track"><div className="toggle-knob"></div></div>
                        </label>
                        <div className={`chat-input-area ${isDevMode ? 'dev-active' : ''}`}>
                            <input 
                                type="text" 
                                placeholder={isDevMode ? "Press button to verify key..." : "Type instructions..."} 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)} 
                                onKeyPress={handleKeyPress} 
                                disabled={isLoading || isDevMode} 
                            />
                            <button onClick={handleMainAction} className="send-btn" disabled={isLoading} title={isDevMode ? "Verify Connection" : "Send Message"}>
                                {isDevMode ? <FlaskIcon width="18" height="18" /> : <SendIcon width="18" height="18" />}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button className="chatbot-toggle" onClick={() => setIsChatOpen(true)} title="Open Cidi"><BotIcon width="30" height="30" /></button>
            )}
        </div>
    );
}; 

export default CdmChatbot;