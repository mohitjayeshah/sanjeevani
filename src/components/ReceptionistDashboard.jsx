import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import logoUrl from '../assets/logo.png';
import { Search, UserPlus, CalendarPlus, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.7)',
  backdropFilter: 'blur(4px)',
  zIndex: 1000,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '1rem'
};

const ReceptionistDashboard = ({ user, onLogout }) => {
  const { users, appointments, records, registerPatient, getPatientByPhone, addAppointment, updateAppointmentStatus, updateRecordReceiptStatus } = useClinic();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [smartSearchPhone, setSmartSearchPhone] = useState('');
  const [smartSearchResult, setSmartSearchResult] = useState(null);
  
  const [showRegister, setShowRegister] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', mobile: '' });
  
  const [showBook, setShowBook] = useState(false);
  const [newApp, setNewApp] = useState({ patientId: '', doctorId: '', reason: '' });
  
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const clinicAppointments = appointments.filter(a => a.clinicId === user.clinicId && a.date === today);
  const clinicPatients = users.filter(u => u.clinicId === user.clinicId && u.role === 'patient');
  const clinicDoctors = users.filter(u => u.clinicId === user.clinicId && u.role === 'doctor');

  // Stats
  const todaysRecords = records.filter(r => r.clinicId === user.clinicId && r.date === today);
  const paidRecords = todaysRecords.filter(r => r.receipt?.status === 'Paid');
  const dailyRevenue = paidRecords.reduce((sum, r) => sum + (r.receipt?.amount || 0), 0);
  const waitTimeEstimate = clinicAppointments.filter(a => a.status === 'waiting').length * 15;

  const handleSmartSearch = (e) => {
    e.preventDefault();
    if (!smartSearchPhone) return;
    const patient = getPatientByPhone(smartSearchPhone);
    if (patient && patient.clinicId === user.clinicId) {
      setSmartSearchResult(patient);
    } else {
      setSmartSearchResult('NOT_FOUND');
      setNewPatient({ name: '', mobile: smartSearchPhone });
      setShowRegister(true);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.mobile) return;
    registerPatient({ name: newPatient.name, mobile: newPatient.mobile, clinicId: user.clinicId });
    setNewPatient({ name: '', mobile: '' });
    setShowRegister(false);
    setSmartSearchResult(null);
    setSmartSearchPhone('');
  };

  const handleBook = (e) => {
    e.preventDefault();
    if (!newApp.patientId || !newApp.doctorId || !newApp.reason) return;
    addAppointment({
      patientId: newApp.patientId,
      doctorId: newApp.doctorId,
      clinicId: user.clinicId,
      reason: newApp.reason
    });
    setNewApp({ patientId: '', doctorId: '', reason: '' });
    setShowBook(false);
    setSmartSearchResult(null);
  };

  return (
    <div className="app-wrapper theme-receptionist" style={{animation: 'fadeIn 0.3s ease'}}>
      
      {/* Enterprise Top Nav */}
      <div className="top-nav">
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <div style={{ width: 44, height: 44, backgroundColor: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <img src={logoUrl} alt="Sanjeevani Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{fontSize: '1.25rem', margin: 0, letterSpacing: '0.05em', color: '#ffffff'}}>SANJEEVANI</h1>
          <span style={{color: '#475569'}}>|</span>
          <span style={{fontWeight: 500, color: '#94a3b8'}}>Front Desk Operations</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <button 
            className="btn btn-primary" 
            style={{padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, boxShadow: '0 0 15px rgba(79, 70, 229, 0.5)'}} 
            onClick={() => { setNewApp({ patientId: '', doctorId: '', reason: '' }); setShowBook(true); }}
          >
            <CalendarPlus size={18} /> New Appointment
          </button>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', borderLeft: '1px solid #334155', paddingLeft: '20px'}}>
            <span style={{fontWeight: 600, fontSize: '0.9rem', color: '#ffffff'}}>{user.name}</span>
            <span style={{color: '#94a3b8', fontSize: '0.75rem'}}>Receptionist</span>
          </div>
          <button className="btn" style={{padding: '0.4rem 1rem', background: 'transparent', color: '#ffffff', border: '1px solid #334155'}} onClick={onLogout}>Sign Out</button>
        </div>
      </div>

      <div className="main-content">
        <div style={{
          marginBottom: '2rem', 
          background: 'var(--surface)', 
          borderRadius: '16px', 
          padding: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 10px 40px rgba(15, 23, 42, 0.05)',
          border: '1px solid var(--border)'
        }}>
          <div>
            <h2 style={{fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--primary)'}}>Overview</h2>
            <p style={{color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem'}}>Manage clinic operations efficiently.</p>
          </div>
          
          <div style={{display: 'flex', gap: '1.5rem'}}>
            <div style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', padding: '1.25rem 2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: '0 10px 25px rgba(15,23,42,0.15)'}}>
              <div style={{background: 'rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '10px', color: '#34d399'}}>
                <TrendingUp size={28} />
              </div>
              <div>
                <div style={{fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em'}}>Daily Revenue</div>
                <div style={{fontSize: '1.75rem', fontWeight: 800, marginTop: '4px'}}>₹{dailyRevenue}</div>
              </div>
            </div>

            <div style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', padding: '1.25rem 2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: '0 10px 25px rgba(15,23,42,0.15)'}}>
              <div style={{background: 'rgba(245, 158, 11, 0.2)', padding: '10px', borderRadius: '10px', color: '#fbbf24'}}>
                <Clock size={28} />
              </div>
              <div>
                <div style={{fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em'}}>Est. Wait Time</div>
                <div style={{fontSize: '1.75rem', fontWeight: 800, marginTop: '4px'}}>{waitTimeEstimate} min</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid" style={{gridTemplateColumns: '1fr 3fr', gap: '2rem', alignItems: 'start'}}>
          <div className="card" style={{position: 'sticky', top: '5rem'}}>
            <div className="card-header">
              <h2>Smart Registration</h2>
            </div>
            <form onSubmit={handleSmartSearch} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div className="input-group" style={{marginBottom: 0}}>
                <label>Patient Phone Number</label>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. 9876543210" 
                    value={smartSearchPhone}
                    onChange={e => setSmartSearchPhone(e.target.value)}
                    required 
                    style={{flex: 1}}
                  />
                  <button type="submit" className="btn btn-primary" style={{padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}} title="Search">
                    <Search size={20} />
                  </button>
                </div>
              </div>
            </form>
            
            {smartSearchResult && smartSearchResult !== 'NOT_FOUND' && (
              <div style={{marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#047857'}}>
                  <CheckCircle size={16} /> <span style={{fontWeight: 600, fontSize: '0.9rem'}}>Patient Found</span>
                </div>
                <div style={{fontWeight: 600, fontSize: '1.1rem'}}>{smartSearchResult.name}</div>
                <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem'}}>{smartSearchResult.mobile}</div>
                <button 
                  className="btn btn-secondary" 
                  style={{width: '100%'}}
                  onClick={() => {
                    setNewApp({...newApp, patientId: smartSearchResult.id});
                    setShowBook(true);
                  }}
                >
                  <CalendarPlus size={16} style={{marginRight: '8px'}} />
                  Book Appointment
                </button>
              </div>
            )}
            
            <div style={{marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)'}}>
              <h3 style={{fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem'}}>Duty Roster</h3>
              {clinicDoctors.map(d => (
                <div 
                  key={d.id} 
                  onClick={() => setSelectedDoctorId(prev => prev === d.id ? null : d.id)}
                  style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginBottom: '0.5rem', 
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    background: selectedDoctorId === d.id ? '#e0f2fe' : 'transparent',
                    border: selectedDoctorId === d.id ? '1px solid #bae6fd' : '1px solid transparent',
                    transition: 'all 0.2s',
                    userSelect: 'none'
                  }}
                >
                  <div style={{width: 8, height: 8, borderRadius: '50%', background: 'var(--success)'}}></div>
                  <span style={{fontWeight: 600, color: selectedDoctorId === d.id ? '#0369a1' : 'inherit'}}>{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div className="card" style={{padding: 0, overflow: 'hidden'}}>
              <div className="card-header" style={{padding: '1.5rem 1.5rem 0 1.5rem', border: 'none', marginBottom: '1rem'}}>
                <h2>Live Queue Management</h2>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{width: '80px', paddingLeft: '1.5rem'}}>Token</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th style={{paddingRight: '1.5rem'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedDoctorId ? clinicAppointments.filter(app => app.doctorId === selectedDoctorId) : clinicAppointments).length > 0 ? 
                    (selectedDoctorId ? clinicAppointments.filter(app => app.doctorId === selectedDoctorId) : clinicAppointments).map(app => {
                    const patient = users.find(u => u.id === app.patientId);
                    const doctor = users.find(u => u.id === app.doctorId);
                    return (
                      <tr key={app.id}>
                        <td style={{fontWeight: 700, paddingLeft: '1.5rem'}}>#{app.token}</td>
                        <td style={{fontWeight: 600}}>{patient?.name}</td>
                        <td>{doctor?.name}</td>
                        <td style={{paddingRight: '1.5rem'}}>
                          <select 
                            value={app.status}
                            onChange={(e) => updateAppointmentStatus(app.id, e.target.value)}
                            style={{
                              padding: '0.4rem', 
                              borderRadius: '20px', 
                              border: '1px solid var(--border)',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              background: app.status === 'waiting' ? '#fef3c7' : 
                                          app.status === 'in-consultation' ? '#dbeafe' : 
                                          app.status === 'admitted-ipd' ? '#fce7f3' : '#dcfce7',
                              color: app.status === 'waiting' ? '#92400e' : 
                                     app.status === 'in-consultation' ? '#1e40af' : 
                                     app.status === 'admitted-ipd' ? '#9d174d' : '#166534',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="waiting">Waiting</option>
                            <option value="in-consultation">In Consultation</option>
                            <option value="admitted-ipd">Admitted (IPD)</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    )
                  }) : <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No appointments booked yet.</td></tr>}
                </tbody>
              </table>
            </div>
            
            <div className="card" style={{padding: 0, overflow: 'hidden'}}>
              <div className="card-header" style={{padding: '1.5rem', borderBottom: '1px solid var(--border)', margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h2>Registered Master Directory</h2>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Search by name..." 
                  style={{width: '250px', padding: '0.4rem 0.8rem'}}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                <table className="data-table">
                  <thead style={{position: 'sticky', top: 0, background: '#f8fafc'}}>
                    <tr>
                      <th style={{paddingLeft: '1.5rem'}}>Name</th>
                      <th>Mobile Number</th>
                      <th style={{textAlign: 'right', paddingRight: '1.5rem'}}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clinicPatients.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                      <tr key={p.id}>
                        <td style={{fontWeight: 600, paddingLeft: '1.5rem'}}>{p.name}</td>
                        <td style={{color: 'var(--text-muted)'}}>{p.mobile}</td>
                        <td style={{textAlign: 'right', paddingRight: '1.5rem'}}>
                          <button 
                            className="btn btn-secondary" 
                            style={{padding: '0.3rem 0.8rem', fontSize: '0.8rem'}}
                            onClick={() => {
                              setNewApp({...newApp, patientId: p.id});
                              setShowBook(true);
                            }}
                          >
                            Book Appt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Billing Card */}
            <div className="card" style={{padding: 0, overflow: 'hidden'}}>
              <div className="card-header" style={{padding: '1.5rem', borderBottom: '1px solid var(--border)', margin: 0}}>
                <h2>Pending Billing & Invoices</h2>
              </div>
              
              <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                <table className="data-table">
                  <thead style={{position: 'sticky', top: 0, background: '#f8fafc'}}>
                    <tr>
                      <th style={{paddingLeft: '1.5rem'}}>Patient</th>
                      <th>Amount</th>
                      <th style={{textAlign: 'right', paddingRight: '1.5rem'}}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaysRecords.filter(r => r.receipt?.status === 'Pending').length > 0 ? (
                      todaysRecords.filter(r => r.receipt?.status === 'Pending').map(r => {
                        const patient = users.find(u => u.id === r.patientId);
                        return (
                          <tr key={r.id}>
                            <td style={{fontWeight: 600, paddingLeft: '1.5rem'}}>{patient?.name}</td>
                            <td style={{fontWeight: 600, color: '#991b1b'}}>₹{r.receipt?.amount}</td>
                            <td style={{textAlign: 'right', paddingRight: '1.5rem'}}>
                              <button 
                                className="btn btn-primary" 
                                style={{padding: '0.3rem 0.8rem', fontSize: '0.8rem'}}
                                onClick={() => updateRecordReceiptStatus(r.id, 'Paid')}
                              >
                                Mark Paid
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr><td colSpan="3" style={{textAlign: 'center', padding: '2rem'}}>No pending invoices.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        </div>

        {showRegister && (
          <div style={overlayStyle}>
            <div className="card" style={{width: '100%', maxWidth: '400px', animation: 'fadeIn 0.2s ease'}}>
              <div className="card-header">
                <h2>New Patient Required</h2>
                <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0}}>Phone number not found. Register now.</p>
              </div>
              <form onSubmit={handleRegister}>
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" className="input-field" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} required autoFocus />
                </div>
                <div className="input-group">
                  <label>Mobile Number</label>
                  <input type="text" className="input-field" value={newPatient.mobile} onChange={e => setNewPatient({...newPatient, mobile: e.target.value})} required />
                </div>
                <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                  <button type="button" className="btn btn-secondary" style={{flex: 1}} onClick={() => {setShowRegister(false); setSmartSearchResult(null);}}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{flex: 1}}>Register Patient</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showBook && (
          <div style={overlayStyle}>
            <div className="card" style={{width: '100%', maxWidth: '400px', animation: 'fadeIn 0.2s ease'}}>
              <div className="card-header">
                <h2>Book Appointment</h2>
              </div>
              <form onSubmit={handleBook}>
                <div className="input-group">
                  <label>Select Patient</label>
                  <select className="input-field" value={newApp.patientId} onChange={e => setNewApp({...newApp, patientId: e.target.value})} required>
                    <option value="">-- Choose Patient --</option>
                    {clinicPatients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.mobile})</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Select Doctor</label>
                  <select className="input-field" value={newApp.doctorId} onChange={e => setNewApp({...newApp, doctorId: e.target.value})} required>
                    <option value="">-- Choose Doctor --</option>
                    {clinicDoctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Primary Reason / Symptoms</label>
                  <textarea className="input-field" rows="2" value={newApp.reason} onChange={e => setNewApp({...newApp, reason: e.target.value})} required />
                </div>
                <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                  <button type="button" className="btn btn-secondary" style={{flex: 1}} onClick={() => setShowBook(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{flex: 1}}>Book Now</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReceptionistDashboard;
