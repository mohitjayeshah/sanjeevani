import React, { useState, useRef, useEffect } from 'react';
import { useClinic } from '../context/ClinicContext';
import logoUrl from '../assets/logo.png';
import html2pdf from 'html2pdf.js';
import EReceipt from './EReceipt';
import { 
  LayoutDashboard, Users as UsersIcon, Activity, FileText, Settings, Bell, Search, 
  Calendar, CheckCircle, XCircle, Mic, Plus, FilePlus, ChevronLeft, Save, Printer
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.7)',
  backdropFilter: 'blur(4px)',
  zIndex: 1000,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '1rem'
};

const COMMON_DIAGNOSES = [
  "Viral Fever", "Typhoid Fever", "Dengue Fever", "Malaria",
  "Upper Respiratory Tract Infection (URTI)", "Acute Bronchitis",
  "Hypertension", "Type 2 Diabetes Mellitus", "Migraine",
  "Tension Headache", "Acute Gastroenteritis", "Acid Peptic Disease",
  "Asthma Exacerbation", "Allergic Rhinitis", "Urinary Tract Infection (UTI)",
  "Osteoarthritis", "Rheumatoid Arthritis", "Muscle Spasm"
];

const WEEKLY_TRENDS = [
  { name: 'Mon', patients: 12 },
  { name: 'Tue', patients: 18 },
  { name: 'Wed', patients: 15 },
  { name: 'Thu', patients: 22 },
  { name: 'Fri', patients: 20 },
  { name: 'Sat', patients: 28 },
  { name: 'Sun', patients: 5 },
];

const DEMOGRAPHICS = [
  { name: 'Pediatrics (<12)', value: 15 },
  { name: 'Adults (12-60)', value: 65 },
  { name: 'Seniors (60+)', value: 20 },
];
const COLORS = ['#0ea5e9', '#10b981', '#f59e0b'];

const TOP_DIAGNOSES = [
  { name: 'Viral Fever', count: 45 },
  { name: 'Hypertension', count: 32 },
  { name: 'Migraine', count: 28 },
  { name: 'Diabetes', count: 20 },
];

const DUMMY_BILLING = [
  { id: 'D101', date: '2026-06-18', patientName: 'Rahul Jain', amount: 500, status: 'Paid' },
  { id: 'D102', date: '2026-06-18', patientName: 'Anjali Desai', amount: 850, status: 'Pending' },
  { id: 'D103', date: '2026-06-17', patientName: 'Priya Sharma', amount: 500, status: 'Paid' },
  { id: 'D104', date: '2026-06-16', patientName: 'Vikash Yadav', amount: 1200, status: 'Paid' },
  { id: 'D105', date: '2026-06-16', patientName: 'Amit Patel', amount: 500, status: 'Pending' },
  { id: 'D106', date: '2026-06-15', patientName: 'Rohan Mehta', amount: 650, status: 'Paid' },
];

const COMMON_MEDICINES = {
  "Tablet": [
    "Paracetamol 500mg (Crocin, Calpol)", 
    "Paracetamol 650mg (Dolo 650, Pacimol)", 
    "Azithromycin 500mg (Azee 500, Azithral)", 
    "Amox-Clav 625mg (Augmentin 625 Duo, Moxikind-CV)", 
    "Cefixime 200mg (Zifi 200, Taxim-O)", 
    "Pantoprazole 40mg (Pan 40, Pantocid)", 
    "Omeprazole 20mg (Omez 20)", 
    "Rabeprazole 20mg (Rablet 20, Cyra)", 
    "Domperidone 10mg (Domstal)", 
    "Cetirizine 10mg (Cetzine, Alerid)", 
    "Levocetirizine 5mg (Montair LC, 1-AL)", 
    "Ibuprofen 400mg (Brufen 400)", 
    "Diclofenac 50mg (Voveran, Reactin)", 
    "Metformin 500mg (Glycomet, Gluconorm)", 
    "Telmisartan 40mg (Telma 40, Tazloc)", 
    "Amlodipine 5mg (Amlokind, Stamlo)"
  ],
  "Syrup": [
    "Levosalbutamol + Ambroxol (Ascoril LS, Asthalin AX)", 
    "Diphenhydramine (Benadryl)", 
    "Dextromethorphan (Corex DX, Grilinctus)", 
    "Antacid Gel (Gelusil, Digene, Mucaine)", 
    "Paracetamol Paediatric (Crocin DS, Calpol 250)", 
    "Ibuprofen + Paracetamol (Ibugesic Plus)", 
    "Cefixime Suspension (Zifi, Taxim-O)"
  ],
  "Capsule": [
    "Amoxicillin 500mg (Novamox)", 
    "Omeprazole 20mg (Omez)", 
    "Rabeprazole + DSR (Rablet-D, Macrabep-DSR)", 
    "B-Complex (Becosules, Neurobion Forte)", 
    "Vitamin D3 60K (Uprise-D3 60K, Calcirol)", 
    "Doxycycline 100mg (Doxiva, Doxy-1)", 
    "Itraconazole 100mg (Canditral, Itramac)"
  ],
  "Ointment": [
    "Mupirocin 2% (T-Bact, Supirocin)", 
    "Clotrimazole 1% (Candid, Surfaz)", 
    "Betamethasone (Betnovate-C)", 
    "Diclofenac Gel (Volini, Moov, Omnigel)", 
    "Fusidic Acid (Fucidin)", 
    "Ketoconazole 2% (Nizral, Ketomac)"
  ],
  "Drops": [
    "Ciprofloxacin (Ciplox Eye/Ear Drops)", 
    "Carboxymethylcellulose (Refresh Tears)", 
    "Xylometazoline (Otrivin Nasal, Nasivion)", 
    "Ear Wax Solvent (Waxolve, Clearwax)"
  ]
};

const DoctorDashboard = ({ user, onLogout }) => {
  const { users: USERS, appointments, records: MEDICAL_RECORDS, addMedicalRecord, updateAppointmentStatus, getPatientHistory } = useClinic();
  
  // --- Data States ---
  const [activeConsult, setActiveConsult] = useState(null);
  
  // --- UI States ---
  const [activeModule, setActiveModule] = useState('appointments');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('queue'); // 'queue', 'finished', 'cancelled'
  const [isIPD, setIsIPD] = useState(false); // OPD vs IPD toggle
  const [isDictating, setIsDictating] = useState(false);
  const [isDictatingAdvice, setIsDictatingAdvice] = useState(false);
  const [dictationLang, setDictationLang] = useState('en-IN');
  
  const today = new Date().toISOString().split('T')[0];
  const myAppointments = appointments.filter(a => a.doctorId === user.id && a.date === today);

  useEffect(() => {
    if (!activeConsult && myAppointments.length > 0) {
      const ongoing = myAppointments.find(a => a.status === 'in-consultation');
      if (ongoing) {
        setActiveConsult(ongoing);
        setSymptoms(ongoing.reason || '');
      }
    }
  }, [myAppointments, activeConsult]);
  
  // --- Consultation States ---
  const [vitals, setVitals] = useState({ spo2: '', pulse: '', bp: '', weight: '', height: '' });
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [medications, setMedications] = useState([]);
  const [currentMed, setCurrentMed] = useState({ type: 'Tablet', name: '', frequency: '1-0-1', duration: '5 days' });
  const [feedback, setFeedback] = useState('');
  const [fee, setFee] = useState('500');

  // --- Print Preview States ---
  const [showPreview, setShowPreview] = useState(false);
  const [viewingRecord, setViewingRecord] = useState(null);

  const printRef = useRef();
  
  const waitingPatients = myAppointments.filter(a => a.status === 'waiting');
  const completedPatients = myAppointments.filter(a => a.status === 'completed' || a.status === 'done');
  const cancelledPatients = []; // Mocked empty for now

  // --- Helpers ---
  const handleFeatureComingSoon = (featureName) => {
    alert(`${featureName} is currently locked in this demo prototype. This module will be enabled in Phase 3.`);
  };

  const addMedication = () => {
    if (currentMed.name.trim() !== '') {
      setMedications([...medications, currentMed]);
      setCurrentMed({ type: 'Tablet', name: '', frequency: '1-0-1', duration: '5 days' });
    }
  };

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleStartConsult = (app) => {
    updateAppointmentStatus(app.id, 'in-consultation');
    setActiveConsult(app);
    setSymptoms(app.reason || '');
    setDiagnosis('');
    setMedications([]);
    setVitals({ spo2: '98', pulse: '72', bp: '120/80', weight: '65', height: '170' });
    setCurrentMed({ type: 'Tablet', name: '', frequency: '1-0-1', duration: '5 days' });
    setFeedback('');
    setFee('500');
    setShowPreview(false);
  };

  // --- VoiceRx Ref ---
  const recognitionRef = useRef(null);
  const isManuallyStoppedRx = useRef(true);
  const accumulatedTranscriptRx = useRef('');

  useEffect(() => {
    return () => {
      isManuallyStoppedRx.current = true;
      if (recognitionRef.current) recognitionRef.current.stop();
      isManuallyStoppedAdvice.current = true;
      if (recognitionAdviceRef.current) recognitionAdviceRef.current.stop();
    };
  }, []);

  const toggleVoiceRx = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Dictation. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (!isManuallyStoppedRx.current) {
      isManuallyStoppedRx.current = true;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      const finalPayload = symptoms.trim();
      if (finalPayload.length > 10) {
        try {
          const res = await fetch('http://localhost:8000/parse-dictation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: finalPayload })
          });
          const aiData = await res.json();
          
          if (aiData.diagnosis && aiData.diagnosis !== 'Not specified') setDiagnosis(aiData.diagnosis);
          if (aiData.medications && Array.isArray(aiData.medications)) {
            setMedications(prev => {
              const newMeds = [...prev];
              aiData.medications.forEach(aiMed => {
                if (!newMeds.find(m => m.name.toLowerCase() === aiMed.name.toLowerCase())) {
                  newMeds.push(aiMed);
                }
              });
              return newMeds;
            });
          }
        } catch (err) {
          console.error("AI Parsing Failed: " + err.message);
        }
      }
      setIsDictating(false);
      return;
    }

    isManuallyStoppedRx.current = false;
    accumulatedTranscriptRx.current = symptoms ? symptoms + ' ' : '';

    const initRecognition = () => {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true; 
      recognition.interimResults = true;
      recognition.lang = dictationLang;

      recognition.onstart = () => {
        setIsDictating(true);
      };

      recognition.onresult = (event) => {
        let finalBurst = '';
        let interimBurst = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalBurst += event.results[i][0].transcript;
          } else {
            interimBurst += event.results[i][0].transcript;
          }
        }
        
        if (finalBurst) {
          accumulatedTranscriptRx.current += finalBurst;
        }
        
        const liveText = accumulatedTranscriptRx.current + interimBurst;
        setSymptoms(liveText.trim());
      };

      recognition.onend = () => {
        if (!isManuallyStoppedRx.current) {
          try {
            initRecognition();
          } catch (err) {
            console.error("Auto-restart failed:", err);
          }
        } else {
          setIsDictating(false);
        }
      };

      recognition.onerror = (event) => {
        console.error("Microphone Error: ", event.error);
      };

      recognition.start();
    };

    initRecognition();
  };

  const recognitionAdviceRef = useRef(null);
  const isManuallyStoppedAdvice = useRef(true);
  const accumulatedTranscriptAdvice = useRef('');

  const toggleVoiceRxAdvice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Dictation.");
      return;
    }

    if (!isManuallyStoppedAdvice.current) {
      isManuallyStoppedAdvice.current = true;
      if (recognitionAdviceRef.current) {
        recognitionAdviceRef.current.stop();
      }
      setIsDictatingAdvice(false);
      return;
    }

    isManuallyStoppedAdvice.current = false;
    accumulatedTranscriptAdvice.current = feedback ? feedback + ' ' : '';

    const initRecognition = () => {
      const recognition = new SpeechRecognition();
      recognitionAdviceRef.current = recognition;
      recognition.continuous = true; 
      recognition.interimResults = true;
      recognition.lang = dictationLang;

      recognition.onstart = () => {
        setIsDictatingAdvice(true);
      };

      recognition.onresult = (event) => {
        let finalBurst = '';
        let interimBurst = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalBurst += event.results[i][0].transcript;
          } else {
            interimBurst += event.results[i][0].transcript;
          }
        }
        
        if (finalBurst) {
          accumulatedTranscriptAdvice.current += finalBurst;
        }
        
        const liveText = accumulatedTranscriptAdvice.current + interimBurst;
        setFeedback(liveText.trim());
      };

      recognition.onend = () => {
        if (!isManuallyStoppedAdvice.current) {
          try {
            initRecognition();
          } catch (err) {
            console.error("Auto-restart failed:", err);
          }
        } else {
          setIsDictatingAdvice(false);
        }
      };

      recognition.onerror = (event) => {
        console.error("Microphone Error: ", event.error);
      };

      recognition.start();
    };

    initRecognition();
  };

  const handleViewRecord = (app) => {
    const record = MEDICAL_RECORDS.find(r => r.patientId === app.patientId && r.date === today && r.doctorId === user.id);
    if (record) setViewingRecord(record);
    else alert('Record details are only available for newly generated prescriptions in this session.');
  };

  const confirmDownload = () => {
    const element = printRef.current;
    const opt = {
      margin:       0.5,
      filename:     `Consultation_${activeConsult.id}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      const newRecord = {
        patientId: activeConsult.patientId,
        doctorId: user.id,
        clinicId: user.clinicId,
        diagnosis: diagnosis || 'General Checkup',
        prescription: medications.map(m => `${m.type} ${m.name} - ${m.frequency} for ${m.duration}`).join('\n'),
        receipt: {
          amount: parseInt(fee, 10) || 500,
          status: 'Pending',
        }
      };
      
      addMedicalRecord(newRecord);
      updateAppointmentStatus(activeConsult.id, 'completed');

      setActiveConsult(null);
      setShowPreview(false);
    });
  };

  // --- Render Sub-Components ---
  
  const renderSidebar = () => (
    <div style={{ width: '260px', backgroundColor: '#0f172a', color: '#94a3b8', display: 'flex', flexDirection: 'column', height: '100vh', flexShrink: 0 }}>
      <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ width: 36, height: 36, backgroundColor: 'white', borderRadius: '8px', padding: '4px' }}>
          <img src={logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h2 style={{ color: 'white', margin: 0, fontSize: '1.2rem', letterSpacing: '0.05em' }}>SANJEEVANI</h2>
      </div>
      
      <div style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <button onClick={() => setActiveModule('appointments')} className="sidebar-btn" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeModule === 'appointments' ? '#0284c7' : 'transparent', color: activeModule === 'appointments' ? 'white' : 'inherit', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, textAlign: 'left' }}>
          <Calendar size={20} /> Appointments
        </button>
        <button onClick={() => setActiveModule('patients')} className="sidebar-btn" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeModule === 'patients' ? '#0284c7' : 'transparent', color: activeModule === 'patients' ? 'white' : 'inherit', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, textAlign: 'left' }}>
          <UsersIcon size={20} /> Patients
        </button>
        <button onClick={() => setActiveModule('analytics')} className="sidebar-btn" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeModule === 'analytics' ? '#0284c7' : 'transparent', color: activeModule === 'analytics' ? 'white' : 'inherit', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, textAlign: 'left' }}>
          <Activity size={20} /> Analytics
        </button>
        <button onClick={() => setActiveModule('billing')} className="sidebar-btn" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeModule === 'billing' ? '#0284c7' : 'transparent', color: activeModule === 'billing' ? 'white' : 'inherit', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, textAlign: 'left' }}>
          <FileText size={20} /> Billings
        </button>
      </div>

      {/* Removed old logout section */}
    </div>
  );

  const renderTopHeader = () => (
    <div style={{ height: '70px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '8px 16px', borderRadius: '8px', width: '300px' }}>
        <Search size={18} color="#94a3b8" />
        <input 
          type="text" 
          placeholder="Search by patient name..." 
          style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '0.9rem' }}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <button onClick={() => setIsIPD(false)} style={{ padding: '6px 16px', border: 'none', borderRadius: '4px', background: !isIPD ? 'white' : 'transparent', color: !isIPD ? '#0f172a' : '#64748b', fontWeight: 600, cursor: 'pointer', boxShadow: !isIPD ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>OPD</button>
          <button onClick={() => setIsIPD(true)} style={{ padding: '6px 16px', border: 'none', borderRadius: '4px', background: isIPD ? 'white' : 'transparent', color: isIPD ? '#0f172a' : '#64748b', fontWeight: 600, cursor: 'pointer', boxShadow: isIPD ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>IPD</button>
        </div>
        
        <button onClick={() => alert('No new notifications')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}><Bell size={20} color="#64748b" /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{user.name}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Cardiologist</p>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '1.1rem' }}>
            {user.name.charAt(0)}
          </div>
          <button className="btn" onClick={onLogout} style={{ marginLeft: '12px', padding: '6px 16px', background: 'transparent', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>Logout</button>
        </div>
      </div>
    </div>
  );

  const getActiveList = () => {
    if (activeTab === 'queue') return waitingPatients;
    if (activeTab === 'finished') return completedPatients;
    return cancelledPatients;
  };

  const displayList = getActiveList().filter(app => {
    const patient = USERS.find(u => u.id === app.patientId);
    if (searchQuery && !patient?.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const renderDashboardQueue = () => (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0284c7 100%)', borderRadius: '12px', padding: '2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', boxShadow: '0 10px 25px rgba(2, 132, 199, 0.2)' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>Welcome, Dr. {user.name.split(' ')[1] || user.name.split(' ')[0]}!</h1>
          <p style={{ margin: 0, color: '#bae6fd', fontSize: '1rem' }}>You have {waitingPatients.length} patients in the {isIPD ? 'IPD' : 'OPD'} queue today.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => alert('Please ask the Receptionist (Front Desk) to register new appointments.')} style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><Plus size={18} /> New Appointment</button>
        </div>
      </div>

      {/* Main Content Card */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 1rem' }}>
          <button onClick={() => setActiveTab('queue')} style={{ padding: '1rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'queue' ? '2px solid #0284c7' : '2px solid transparent', color: activeTab === 'queue' ? '#0284c7' : '#64748b', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} /> Queue ({waitingPatients.length})
          </button>
          <button onClick={() => setActiveTab('finished')} style={{ padding: '1rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'finished' ? '2px solid #10b981' : '2px solid transparent', color: activeTab === 'finished' ? '#10b981' : '#64748b', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} /> Finished ({completedPatients.length})
          </button>
          <button onClick={() => setActiveTab('cancelled')} style={{ padding: '1rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'cancelled' ? '2px solid #dc2626' : '2px solid transparent', color: activeTab === 'cancelled' ? '#dc2626' : '#64748b', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={18} /> Cancelled (0)
          </button>
        </div>

        {/* Table Header */}
        <div style={{ padding: '1rem 1.5rem', display: 'grid', gridTemplateColumns: '60px 2fr 1fr 1fr 1fr', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
          <div>#</div>
          <div>Patient Name</div>
          <div>Contact</div>
          <div>Visit Type</div>
          <div style={{ textAlign: 'right' }}>Action</div>
        </div>

        {/* Table Body */}
        <div style={{ minHeight: '400px' }}>
          {displayList.length > 0 ? displayList.map((app, index) => {
            const patient = USERS.find(u => u.id === app.patientId);
            return (
              <div key={app.id} style={{ padding: '1rem 1.5rem', display: 'grid', gridTemplateColumns: '60px 2fr 1fr 1fr 1fr', borderBottom: '1px solid #f1f5f9', alignItems: 'center', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.background = 'white'}>
                <div style={{ color: '#94a3b8', fontWeight: 600 }}>{index + 1}</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>{patient?.name}</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Token #{app.token} • {app.reason}</p>
                </div>
                <div style={{ color: '#475569', fontSize: '0.9rem' }}>+91 {patient?.mobile}</div>
                <div>
                  <span style={{ padding: '4px 10px', background: isIPD ? '#e0e7ff' : '#f1f5f9', color: isIPD ? '#4338ca' : '#475569', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>{isIPD ? 'Admitted' : 'New Visit'}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {activeTab === 'queue' ? (
                    <button onClick={() => handleStartConsult(app)} style={{ padding: '6px 16px', border: '1px solid #0284c7', color: '#0284c7', background: 'white', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => {e.target.style.background = '#0284c7'; e.target.style.color = 'white'}} onMouseOut={(e) => {e.target.style.background = 'white'; e.target.style.color = '#0284c7'}}>Consult</button>
                  ) : (
                    <button onClick={() => handleViewRecord(app)} style={{ padding: '6px 16px', border: '1px solid #cbd5e1', color: '#475569', background: 'white', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>View</button>
                  )}
                </div>
              </div>
            );
          }) : (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
              <CheckCircle size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <p style={{ fontSize: '1.1rem', margin: 0 }}>No patients in this list.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderClinicalConsultation = () => {
    const patient = USERS.find(u => u.id === activeConsult.patientId);
    const history = getPatientHistory(patient.id);
    
    return (
      <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header - The Star of the Show (Subtle Depth) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'linear-gradient(to right, #f8fafc, #f0fdfa)', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(204, 251, 241, 0.6)', boxShadow: '0 10px 30px rgba(15, 118, 110, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => { setActiveConsult(null); updateAppointmentStatus(activeConsult.id, 'waiting'); }} className="btn btn-secondary" style={{ width: 40, height: 40, padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={20} /></button>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-main)' }}>{patient?.name}</h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Token #{activeConsult.token} • {isIPD ? 'IPD Ward B2' : 'OPD'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => alert('Draft saved successfully to local memory.')} className="btn btn-secondary"><Save size={16} /> Save Draft</button>
            <button onClick={() => setShowPreview(true)} className="btn btn-primary"><Printer size={16} /> Preview & Print</button>
          </div>
        </div>

        {/* Two-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: Vitals & Context */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}><Activity size={18} color="#0284c7" /> Vitals</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>SPO2 (%)</label><input type="text" style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', marginTop: '4px' }} value={vitals.spo2} onChange={e => setVitals({...vitals, spo2: e.target.value})} /></div>
                <div><label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Pulse (/min)</label><input type="text" style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', marginTop: '4px' }} value={vitals.pulse} onChange={e => setVitals({...vitals, pulse: e.target.value})} /></div>
                <div><label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>BP (mmHg)</label><input type="text" style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', marginTop: '4px' }} value={vitals.bp} onChange={e => setVitals({...vitals, bp: e.target.value})} /></div>
                <div><label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Weight (kg)</label><input type="text" style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', marginTop: '4px' }} value={vitals.weight} onChange={e => setVitals({...vitals, weight: e.target.value})} /></div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}><FileText size={18} color="#10b981" /> Medical History</h3>
              
              {history.length > 0 ? history.map(h => (
                <div key={h.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>{h.date} - {h.diagnosis}</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{h.prescription}</p>
                </div>
              )) : (
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>No past records found.</p>
              )}
            </div>
            
            <div className="card">
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}><Activity size={18} color="#8b5cf6" /> E-Lab Results</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', margin: 0 }}>No recent lab reports available.</p>
              <button onClick={() => setFeedback(prev => prev + (prev ? '\n' : '') + 'Recommended Lab Tests: Complete Blood Count (CBC), Lipid Profile.')} style={{ marginTop: '1rem', width: '100%', padding: '8px', background: '#f8fafc', border: '1px dashed #cbd5e1', color: '#0284c7', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>+ Order Routine Test</button>
            </div>
          </div>

          {/* RIGHT COLUMN: Action & Rx */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="card" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select 
                  style={{ padding: '8px', borderRadius: '20px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.85rem', color: '#475569', outline: 'none' }}
                  value={dictationLang}
                  onChange={e => setDictationLang(e.target.value)}
                  disabled={isDictating}
                >
                  <option value="en-IN">English</option>
                  <option value="hi-IN">Hindi</option>
                  <option value="mr-IN">Marathi</option>
                </select>
                <button onClick={toggleVoiceRx} style={{ background: isDictating ? '#fee2e2' : '#f0f9ff', color: isDictating ? '#dc2626' : '#0284c7', border: 'none', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}>
                  <Mic size={16} className={isDictating ? 'pulse-anim' : ''} /> {isDictating ? 'Listening...' : 'Dictate Symptoms'}
                </button>
              </div>
              
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: '#0f172a' }}>Clinical Notes</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Symptoms / Chief Complaints</label>
                <textarea style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '80px', fontFamily: 'inherit' }} value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="Type symptoms here..." />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Diagnosis</label>
                <input list="diagnosis-list" type="text" style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: 600, color: '#0f172a', fontSize: '1rem' }} value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="Search or type diagnosis (ICD-10)..." />
                <datalist id="diagnosis-list">
                  {COMMON_DIAGNOSES.map(d => <option key={d} value={d} />)}
                </datalist>
              </div>
            </div>

            <div className="card">
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Medication (Rx)
              </h3>
              
              {/* Add Med Row */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                <select style={{ width: '90px', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white' }} value={currentMed.type} onChange={e => setCurrentMed({...currentMed, type: e.target.value})}>
                  <option>Tablet</option>
                  <option>Syrup</option>
                  <option>Capsule</option>
                  <option>Ointment</option>
                  <option>Drops</option>
                </select>
                <input list="med-list" type="text" style={{ flex: 1, padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} placeholder="Search medicine..." value={currentMed.name} onChange={e => setCurrentMed({...currentMed, name: e.target.value})} />
                <datalist id="med-list">
                  {(COMMON_MEDICINES[currentMed.type] || []).map(m => <option key={m} value={m} />)}
                </datalist>
                <select style={{ width: '100px', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white' }} value={currentMed.frequency} onChange={e => setCurrentMed({...currentMed, frequency: e.target.value})}>
                  <option>1-0-1</option>
                  <option>1-1-1</option>
                  <option>1-0-0</option>
                  <option>0-0-1</option>
                  <option>SOS</option>
                </select>
                <input type="text" style={{ width: '100px', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} placeholder="Days" value={currentMed.duration} onChange={e => setCurrentMed({...currentMed, duration: e.target.value})} />
                <button onClick={addMedication} style={{ padding: '8px 16px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Add</button>
              </div>

              {/* Rx Table */}
              {medications.length > 0 ? (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                      <tr>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Medicine</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Frequency</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Duration</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {medications.map((m, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>{m.type}</span>
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>{m.name}</span>
                          </td>
                          <td style={{ padding: '12px', color: '#475569' }}>{m.frequency}</td>
                          <td style={{ padding: '12px', color: '#475569' }}>{m.duration}</td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <button onClick={() => removeMedication(i)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}><XCircle size={18} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
                  No medications added yet. Use VoiceRx or manual entry.
                </div>
              )}
              
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', margin: 0 }}>Doctor's Advice / Care Plan</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select 
                      style={{ padding: '4px 8px', borderRadius: '20px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.75rem', color: '#475569', outline: 'none' }}
                      value={dictationLang}
                      onChange={e => setDictationLang(e.target.value)}
                      disabled={isDictatingAdvice}
                    >
                      <option value="en-IN">English</option>
                      <option value="hi-IN">Hindi</option>
                      <option value="mr-IN">Marathi</option>
                    </select>
                    <button 
                      onClick={toggleVoiceRxAdvice}
                      className={`btn ${isDictatingAdvice ? 'pulse-anim' : ''}`}
                      style={{ 
                        background: isDictatingAdvice ? '#fee2e2' : '#f1f5f9', 
                        color: isDictatingAdvice ? '#dc2626' : '#0284c7', 
                        border: 'none', 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Mic size={14} /> {isDictatingAdvice ? 'Listening...' : 'Dictate Advice'}
                    </button>
                  </div>
                </div>
                <textarea style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '60px', fontFamily: 'inherit' }} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Type care instructions..." />
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  const renderPreviewModal = () => (
    <div style={overlayStyle}>
      <div style={{width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', background: '#e2e8f0', borderRadius: '4px', position: 'relative', animation: 'fadeIn 0.2s ease'}}>
        
        <div style={{position: 'sticky', top: 0, background: '#0f172a', color: 'white', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10}}>
          <h3 style={{margin: 0, fontSize: '1rem', fontWeight: 500}}>Document Preview</h3>
          <div style={{display: 'flex', gap: '10px'}}>
            <button className="btn" style={{background: 'transparent', color: 'white', border: '1px solid #334155'}} onClick={() => setShowPreview(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={confirmDownload} style={{background: '#0284c7', borderColor: '#0284c7'}}>Approve & Print Document</button>
          </div>
        </div>
        
        <div style={{padding: '2rem', display: 'flex', justifyContent: 'center'}}>
          <div ref={printRef} style={{ 
            width: '100%', 
            maxWidth: '800px', 
            padding: '40px 50px', 
            fontFamily: '"Times New Roman", Times, serif', 
            color: '#1e293b', 
            background: '#fff', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', opacity: 0.03, fontSize: '120px', fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
              SANJEEVANI
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #0f172a', paddingBottom: '20px', marginBottom: '25px' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: 60, height: 60, backgroundColor: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h1 style={{ margin: 0, fontSize: '26px', textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a', fontWeight: '800' }}>SWASTHYA CARE CLINIC</h1>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569' }}>124 Healthcare Avenue, Mumbai, Maharashtra 400001 • Ph: +91 800 555 1234</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: 'bold' }}>{user.name}</h2>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#475569' }}>Cardiologist • Reg No: MH-1245</p>
              </div>
            </div>
            
            <div style={{ marginBottom: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: '#f8fafc', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Patient Name</p>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>{USERS.find(u => u.id === activeConsult?.patientId)?.name}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Date & Token</p>
                <p style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>{today} • <strong style={{color: '#0284c7'}}>Token #{activeConsult?.token}</strong></p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Mobile Number</p>
                <p style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>+91 {USERS.find(u => u.id === activeConsult?.patientId)?.mobile}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Consultation Type</p>
                <p style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>{isIPD ? 'Inpatient (IPD) Visit' : 'Standard OPD Visit'}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '35px' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px' }}>Vitals Recorded</h3>
                <div style={{ display: 'flex', gap: '15px', fontSize: '13px' }}>
                  <span><strong style={{color: '#475569'}}>SPO2:</strong> {vitals.spo2}%</span>
                  <span><strong style={{color: '#475569'}}>BP:</strong> {vitals.bp}</span>
                  <span><strong style={{color: '#475569'}}>Pulse:</strong> {vitals.pulse}</span>
                </div>
                <h3 style={{ margin: '15px 0 8px 0', fontSize: '13px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px' }}>Chief Complaints</h3>
                <p style={{ margin: 0, lineHeight: '1.6', fontSize: '14px', color: '#1e293b' }}>{symptoms || 'None reported.'}</p>
              </div>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', textTransform: 'uppercase', color: '#0284c7', letterSpacing: '0.5px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px' }}>Clinical Diagnosis</h3>
                <p style={{ margin: 0, lineHeight: '1.6', fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>{diagnosis || 'Pending evaluation.'}</p>
              </div>
            </div>

            <div style={{ marginBottom: '40px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-20px', top: '-10px', fontSize: '60px', fontFamily: 'serif', color: '#0284c7', opacity: 0.1, pointerEvents: 'none' }}>
                Rx
              </div>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '24px', fontFamily: 'serif', color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: '8px', display: 'inline-block', paddingRight: '20px' }}>Rx</h3>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '10px 5px', borderBottom: '2px solid #cbd5e1', textAlign: 'left', width: '5%', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>#</th>
                    <th style={{ padding: '10px 5px', borderBottom: '2px solid #cbd5e1', textAlign: 'left', width: '50%', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Medicine Name</th>
                    <th style={{ padding: '10px 5px', borderBottom: '2px solid #cbd5e1', textAlign: 'left', width: '25%', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Frequency</th>
                    <th style={{ padding: '10px 5px', borderBottom: '2px solid #cbd5e1', textAlign: 'left', width: '20%', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.length > 0 ? medications.map((m, i) => (
                    <tr key={i}>
                      <td style={{ padding: '12px 5px', borderBottom: '1px dashed #e2e8f0', color: '#64748b' }}>0{i + 1}</td>
                      <td style={{ padding: '12px 5px', borderBottom: '1px dashed #e2e8f0', fontWeight: 'bold', color: '#0f172a', fontSize: '15px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'normal', display: 'block', marginBottom: '2px' }}>{m.type}</span>
                        {m.name}
                      </td>
                      <td style={{ padding: '12px 5px', borderBottom: '1px dashed #e2e8f0', color: '#1e293b', fontWeight: '500' }}>{m.frequency}</td>
                      <td style={{ padding: '12px 5px', borderBottom: '1px dashed #e2e8f0', color: '#1e293b' }}>{m.duration}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" style={{ padding: '20px', textAlign: 'center', fontStyle: 'italic', color: '#94a3b8' }}>No medications prescribed during this visit.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {feedback && (
              <div style={{ marginBottom: '40px', background: '#f0fdf4', padding: '15px', borderLeft: '4px solid #10b981' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.5px' }}>Doctor's Advice & Care Plan</h3>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '14px', color: '#1e293b' }}>{feedback}</p>
              </div>
            )}

            <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <div style={{ border: '1px solid #cbd5e1', padding: '15px', borderRadius: '4px', maxWidth: '300px' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold' }}>Consultation Fee</p>
                  <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>₹{fee} <span style={{fontSize: '12px', fontWeight: 'normal', color: '#64748b'}}>To be paid at desk</span></h2>
                </div>
                <p style={{ margin: '15px 0 0 0', fontSize: '10px', color: '#94a3b8' }}>Valid for 15 days from date of issue. This is a computer generated document.</p>
              </div>
              
              <div style={{ textAlign: 'center', padding: '0 20px' }}>
                <div style={{ borderBottom: '1px solid #0f172a', width: '150px', marginBottom: '10px' }}></div>
                <h3 style={{ margin: '0', fontSize: '14px', color: '#0f172a' }}>{user.name}</h3>
                <p style={{ margin: '0', fontSize: '11px', color: '#64748b' }}>Authorized Signature</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );

  const renderPatientDirectory = () => {
    const myPatientIds = new Set(appointments.filter(a => a.doctorId === user.id).map(a => a.patientId));
    let patients = USERS.filter(u => u.role === 'patient' && myPatientIds.has(u.id));
    
    if (searchQuery) {
      patients = patients.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    return (
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Master Patient Directory</h2>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left' }}>Patient Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Mobile</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Lifetime Visits</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => {
                const history = getPatientHistory(p.id);
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: '12px' }}>{p.mobile}</td>
                    <td style={{ padding: '12px' }}>{history.length} Visits</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button style={{ padding: '6px 16px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }} onClick={() => { setActiveModule('appointments'); setSearchQuery(p.name); }}>Filter Queue</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    const todaysRecords = MEDICAL_RECORDS.filter(r => r.date === today && r.doctorId === user.id);
    const revenue = todaysRecords.reduce((sum, r) => sum + (r.receipt?.amount || 0), 0);
    const totalMyRecords = MEDICAL_RECORDS.filter(r => r.doctorId === user.id).length;

    // Doctor-specific dummy values
    const getDummyValue = (realValue, multiplier, base) => {
      if (realValue > 0) return realValue;
      const seed = user.id ? user.id.charCodeAt(0) + (user.id.charCodeAt(user.id.length - 1) || 0) : 42;
      return base + (seed % multiplier);
    };

    const displayConsultations = getDummyValue(todaysRecords.length, 12, 10);
    const displayPrescriptions = getDummyValue(totalMyRecords, 150, 300);
    const displayRevenue = getDummyValue(revenue, 5000, 8000);

    return (
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Activity size={24} color="#0284c7" /> My Analytics Dashboard</h2>
        
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Consultations Today</h3>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0' }}>{displayConsultations}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>↑ 12% vs yesterday</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Prescriptions</h3>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0' }}>{displayPrescriptions}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>↑ 5% vs last month</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estimated Revenue (Today)</h3>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0' }}>₹{displayRevenue}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Includes pending invoices</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          
          {/* Main Trend Chart */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#0f172a', fontSize: '1.1rem', marginTop: 0, marginBottom: '1.5rem' }}>Weekly Consultations Trend</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={WEEKLY_TRENDS} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                  <Line type="monotone" dataKey="patients" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: 'white'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Demographics Pie */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', flex: 1 }}>
              <h3 style={{ color: '#0f172a', fontSize: '1.1rem', marginTop: 0, marginBottom: '0.5rem' }}>Patient Demographics</h3>
              <div style={{ height: '220px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={DEMOGRAPHICS} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {DEMOGRAPHICS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px', color: '#64748b'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderBilling = () => {
    const myRecords = MEDICAL_RECORDS.filter(r => r.doctorId === user.id);
    
    // Combine real and dummy data for demonstration
    const combinedBilling = [
      ...myRecords.map(r => ({
        id: `R${r.id}`,
        date: r.date,
        patientName: USERS.find(u => u.id === r.patientId)?.name || 'Unknown',
        amount: r.receipt?.amount || 500,
        status: r.receipt?.status || 'Pending'
      })),
      ...DUMMY_BILLING
    ];

    const totalRevenue = combinedBilling.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.amount, 0);
    const pendingAmount = combinedBilling.filter(b => b.status === 'Pending').reduce((sum, b) => sum + b.amount, 0);

    return (
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><FileText size={24} color="#0284c7" /> Billing Ledger</h2>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16} /> New Invoice</button>
        </div>

        {/* Billing Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderLeft: '4px solid #10b981' }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total Revenue (MTD)</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a' }}>₹{totalRevenue}</h3>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderLeft: '4px solid #f59e0b' }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Outstanding Pending</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a' }}>₹{pendingAmount}</h3>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderLeft: '4px solid #0ea5e9' }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Invoices Generated</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a' }}>{combinedBilling.length}</h3>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left' }}>Invoice ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Patient</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {combinedBilling.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: 500, color: '#64748b' }}>INV-{b.id}</td>
                  <td style={{ padding: '12px' }}>{b.date}</td>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>{b.patientName}</td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>₹{b.amount}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: b.status === 'Paid' ? '#dcfce7' : '#fee2e2', color: b.status === 'Paid' ? '#166534' : '#991b1b' }}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    if (activeModule === 'patients') return renderPatientDirectory();
    if (activeModule === 'analytics') return renderAnalytics();
    if (activeModule === 'billing') return renderBilling();
    
    // Default: 'appointments'
    return activeConsult ? renderClinicalConsultation() : renderDashboardQueue();
  };

  return (
    <div className="theme-doctor" style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-color)', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. Static Left Sidebar */}
      {renderSidebar()}

      {/* 2. Main Area (Header + Scrollable Content) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {renderTopHeader()}

        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {renderMainContent()}
        </div>
      </div>

      {showPreview && renderPreviewModal()}
      
      {viewingRecord && (
        <div style={overlayStyle}>
          <div style={{width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', background: '#fff', borderRadius: '8px', position: 'relative', animation: 'fadeIn 0.2s ease'}}>
            <div style={{position: 'sticky', top: 0, background: '#0f172a', color: 'white', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10}}>
              <h3 style={{margin: 0, fontSize: '1rem', fontWeight: 500}}>Patient Record View</h3>
              <button className="btn" style={{background: 'transparent', color: 'white', border: '1px solid #334155'}} onClick={() => setViewingRecord(null)}>Close</button>
            </div>
            <div style={{padding: '2rem'}}>
              <EReceipt record={viewingRecord} />
            </div>
          </div>
        </div>
      )}

      {/* Global Style for pulsing animation */}
      <style>{`
        @keyframes pulse-anim {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; color: #dc2626; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pulse-anim {
          animation: pulse-anim 1s infinite;
        }
        .sidebar-btn:hover { background: rgba(255,255,255,0.05) !important; color: white !important; }
      `}</style>
    </div>
  );
};

export default DoctorDashboard;
