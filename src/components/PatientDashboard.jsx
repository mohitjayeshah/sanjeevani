import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import EReceipt from './EReceipt';
import logoUrl from '../assets/logo.png';

const PatientDashboard = ({ user, onLogout }) => {
  const { CLINICS, appointments, records } = useClinic();
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Filter medical records and appointments for this patient
  const myRecords = records.filter(r => r.patientId === user.id);
  const myAppointments = appointments.filter(a => a.patientId === user.id && a.status === 'waiting');

  return (
    <div className="app-wrapper" style={{animation: 'fadeIn 0.3s ease'}}>
      
      {/* Enterprise Top Nav */}
      <div className="top-nav">
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <div style={{ width: 44, height: 44, backgroundColor: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <img src={logoUrl} alt="Sanjeevani Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{fontSize: '1.25rem', margin: 0, letterSpacing: '0.05em'}}>SANJEEVANI</h1>
          <span style={{color: '#64748b'}}>|</span>
          <span style={{fontWeight: 500, color: '#e2e8f0'}}>Patient Health Portal</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
            <span style={{fontWeight: 600, fontSize: '0.9rem'}}>{user.name}</span>
            <span style={{color: '#94a3b8', fontSize: '0.75rem'}}>Member ID: {user.id.toUpperCase()}</span>
          </div>
          <button className="btn" style={{padding: '0.4rem 1rem', background: '#1e293b', color: 'white', border: '1px solid #334155'}} onClick={onLogout}>Sign Out</button>
        </div>
      </div>

      <div className="main-content">
        <div style={{marginBottom: '2rem'}}>
          <h2 style={{fontSize: '2rem', margin: '0 0 0.5rem 0'}}>Hello, {user.name.split(' ')[0]}</h2>
          <p style={{color: 'var(--text-muted)'}}>Your centralized health and medical records.</p>
        </div>

        {/* Health Vitals Summary Widget */}
        <div className="grid" style={{gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem'}}>
          <div className="card">
            <p style={{fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem'}}>Blood Pressure</p>
            <h3 style={{margin: 0, fontSize: '1.5rem', color: 'var(--primary)'}}>120/80 <span style={{fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)'}}>mmHg</span></h3>
            <p style={{fontSize: '0.8rem', color: 'var(--success)', marginTop: '0.5rem'}}>● Normal Level</p>
          </div>
          <div className="card">
            <p style={{fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem'}}>Heart Rate</p>
            <h3 style={{margin: 0, fontSize: '1.5rem', color: 'var(--primary)'}}>72 <span style={{fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)'}}>bpm</span></h3>
            <p style={{fontSize: '0.8rem', color: 'var(--success)', marginTop: '0.5rem'}}>● Normal Level</p>
          </div>
          <div className="card">
            <p style={{fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem'}}>Weight</p>
            <h3 style={{margin: 0, fontSize: '1.5rem', color: 'var(--primary)'}}>68 <span style={{fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)'}}>kg</span></h3>
            <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem'}}>Last updated: 2 weeks ago</p>
          </div>
          <div className="card" style={{background: 'var(--primary)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', cursor: 'pointer', transition: 'background 0.2s'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginBottom: '0.5rem'}}><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            <span style={{fontWeight: 600}}>Update Vitals</span>
          </div>
        </div>

        <div className="grid" style={{gridTemplateColumns: selectedRecord ? '1fr' : '2fr 1fr'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
            
            {/* Upcoming Appointments */}
            {!selectedRecord && (
              <div className="card" style={{borderTop: '4px solid var(--accent)'}}>
                <div className="card-header">
                  <h2>Upcoming Appointments</h2>
                </div>
                {myAppointments.length > 0 ? (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    {myAppointments.map(app => {
                      const clinic = CLINICS.find(c => c.id === app.clinicId);
                      return (
                        <div key={app.id} style={{padding: '1rem', border: '1px solid var(--border)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <div>
                            <h4 style={{margin: '0 0 0.25rem 0', fontSize: '1.1rem'}}>{app.date}</h4>
                            <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)'}}>{clinic?.name} • Reason: {app.reason}</p>
                          </div>
                          <span className="badge badge-waiting" style={{padding: '0.5rem 1rem'}}>Token #{app.token}</span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p style={{color: 'var(--text-muted)', margin: 0}}>You have no upcoming appointments scheduled.</p>
                )}
              </div>
            )}

            {/* Past Records */}
            <div className="card" style={{gridColumn: '1 / -1', padding: selectedRecord ? '2rem' : '1.5rem'}}>
              <div className="card-header" style={{borderBottom: selectedRecord ? '1px solid var(--border)' : 'none', marginBottom: selectedRecord ? '2rem' : '1rem'}}>
                <h2>Medical History</h2>
                {selectedRecord && (
                  <button className="btn btn-secondary" onClick={() => setSelectedRecord(null)}>← Close Record</button>
                )}
              </div>

              {!selectedRecord ? (
                myRecords.length > 0 ? (
                  <div style={{border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden'}}>
                    <table className="data-table" style={{margin: 0}}>
                      <thead>
                        <tr>
                          <th style={{paddingLeft: '1.5rem'}}>Date</th>
                          <th>Diagnosis</th>
                          <th>Prescription Summary</th>
                          <th style={{textAlign: 'right', paddingRight: '1.5rem'}}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myRecords.map(r => (
                          <tr key={r.id}>
                            <td style={{fontWeight: 600, paddingLeft: '1.5rem'}}>{r.date}</td>
                            <td>{r.diagnosis}</td>
                            <td style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>{r.prescription.length > 30 ? r.prescription.substring(0, 30) + '...' : r.prescription}</td>
                            <td style={{textAlign: 'right', paddingRight: '1.5rem'}}>
                              <button 
                                className="btn btn-secondary" 
                                onClick={() => setSelectedRecord(r)}
                              >
                                View Record
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{color: 'var(--text-muted)'}}>No past medical records found in the system.</p>
                )
              ) : (
                <div style={{animation: 'fadeIn 0.3s ease'}}>
                  <EReceipt record={selectedRecord} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Widgets (Hidden when viewing receipt) */}
          {!selectedRecord && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              <div className="card" style={{background: 'var(--primary)', color: 'white'}}>
                <h3 style={{marginTop: 0, marginBottom: '1rem'}}>Need to see a doctor?</h3>
                <p style={{color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6'}}>Request an appointment instantly within the Sanjeevani ecosystem network.</p>
                <button className="btn" style={{background: 'white', color: 'var(--primary)', width: '100%'}}>Request Appointment</button>
              </div>
              
              <div className="card" style={{background: '#f8fafc'}}>
                <div className="card-header" style={{paddingBottom: '0.5rem', marginBottom: '1rem'}}>
                  <h3 style={{fontSize: '1rem'}}>Health Directives</h3>
                </div>
                <ul style={{paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.8', margin: 0}}>
                  <li>Hydrate sufficiently daily (8+ glasses).</li>
                  <li>Maintain 7-8 hours of sleep cycle.</li>
                  <li>Follow prescribed diets strictly.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
