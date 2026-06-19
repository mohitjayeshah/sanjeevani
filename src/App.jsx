import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import DoctorDashboard from './components/DoctorDashboard';
import ReceptionistDashboard from './components/ReceptionistDashboard';
import PatientDashboard from './components/PatientDashboard';
import { useClinic } from './context/ClinicContext';

function App() {
  const { isLoading } = useClinic();
  
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('sanjeevani_session');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('sanjeevani_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('sanjeevani_session');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Only show the loading spinner if the user is successfully logged in but data is still fetching
  if (isLoading) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', flexDirection: 'column' }}>
        <div style={{ width: 40, height: 40, border: '4px solid #0284c7', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '1rem', color: '#64748b', fontWeight: 600 }}>Connecting to Supabase Vault...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      {user.role === 'doctor' && <DoctorDashboard user={user} onLogout={handleLogout} />}
      {user.role === 'receptionist' && <ReceptionistDashboard user={user} onLogout={handleLogout} />}
      {user.role === 'patient' && <PatientDashboard user={user} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
