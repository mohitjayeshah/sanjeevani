import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import logoUrl from '../assets/logo.png';

const Login = ({ onLogin }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [mobile, setMobile] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchedUser, setFetchedUser] = useState(null);

  // Auto-dismiss removed; wait for user to click "Log In"
  const handleSplashLoginClick = () => {
    setIsFadingOut(true);
    setTimeout(() => setShowSplash(false), 500);
  };

  const handleGenerateOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('mobile', mobile)
        .single();
        
      if (data) {
        if (data.role === 'patient') {
          setError('Patient portal access is currently restricted. Staff login only.');
          setLoading(false);
          return;
        }
        setFetchedUser(data);
        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(newOtp);
        setShowOtp(true);
        setError('');
        alert(`[MOCK SMS] Your OTP for Swasthya Care Clinic is: ${newOtp}`);
      } else {
        setError('Mobile number not registered in the system.');
      }
    } catch (err) {
      setError('Mobile number not registered in the system.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === generatedOtp && fetchedUser) {
      onLogin(fetchedUser);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <>
      {showSplash && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(135deg, #042f2e 0%, #0284c7 50%, #10b981 100%)',
          alignItems: 'center', justifyContent: 'center', color: 'white', overflow: 'hidden',
          animation: isFadingOut ? 'fadeOut 0.5s ease forwards' : 'none'
        }}>
          {/* Animated Background Elements */}
          <div style={{ position: 'absolute', top: '20%', left: '20%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)', animation: 'pulse 3s infinite alternate' }}></div>
          <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(255,255,255,0) 70%)', animation: 'pulse 4s infinite alternate-reverse' }}></div>

          {/* Central Logo Container */}
          <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeInUp 1s ease forwards' }}>
            <div style={{ 
              width: '120px', height: '120px', backgroundColor: 'white', borderRadius: '24px', 
              padding: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', marginBottom: '1.5rem',
              animation: 'scaleIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' 
            }}>
              <img src={logoUrl} alt="Sanjeevani Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h1 style={{ margin: 0, fontSize: '3.5rem', fontWeight: 800, letterSpacing: '0.05em', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>SANJEEVANI</h1>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.2rem', color: '#e0f2fe', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Smart Clinic Ecosystem</p>
            
            <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button 
                onClick={handleSplashLoginClick}
                style={{
                  padding: '12px 40px',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#0f766e',
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  animation: 'fadeInUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                  animationDelay: '1s',
                  opacity: 0,
                  transform: 'translateY(20px)',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(0) scale(1.05)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)'; e.currentTarget.style.backgroundColor = '#f0fdfa'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)'; e.currentTarget.style.backgroundColor = 'white'; }}
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: '#f3f4f6' }}>
      {/* Left Branding Panel (Light Theme) */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #bae6fd 100%)', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderRight: '1px solid #e2e8f0'
      }}>
        {/* Giant Logo (Naturally crisp on light background) */}
        <img 
          src={logoUrl} 
          alt="Sanjeevani Logo" 
          style={{ 
            width: '90%', 
            height: '90%', 
            objectFit: 'contain', 
            opacity: 1, 
            pointerEvents: 'none',
            zIndex: 1,
            filter: 'drop-shadow(0 20px 40px rgba(15, 118, 110, 0.08))'
          }} 
        />
      </div>

      {/* Right Login Panel */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ width: '100%', maxWidth: '440px', padding: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#042f2e', marginBottom: '0.5rem', fontWeight: 700 }}>Staff Portal</h2>
          <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '1rem' }}>Please enter your staff credentials to access the dashboard.</p>
          
          {!showOtp ? (
            <form onSubmit={handleGenerateOtp}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Mobile Number</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                  <span style={{ padding: '0.75rem 1rem', backgroundColor: '#f8fafc', color: '#64748b', borderRight: '1px solid #cbd5e1', fontWeight: 500 }}>+91</span>
                  <input 
                    type="tel" 
                    style={{ flex: 1, padding: '0.75rem 1rem', border: 'none', fontSize: '1rem', outline: 'none' }} 
                    placeholder="Enter 10-digit number" 
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {error && <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1.5rem', borderLeft: '4px solid #dc2626' }}>{error}</div>}
              
              <button 
                type="submit" 
                style={{ width: '100%', padding: '1rem', backgroundColor: '#042f2e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#064e3b'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#042f2e'}
              >
                Generate Secure OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>OTP sent to</p>
                  <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>+91 {mobile}</p>
                </div>
                <button type="button" onClick={() => setShowOtp(false)} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Change</button>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Enter OTP</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1.25rem', outline: 'none', letterSpacing: '0.2em', textAlign: 'center', fontWeight: 700 }} 
                  placeholder="••••" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  required
                />
              </div>

              {error && <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1.5rem', borderLeft: '4px solid #dc2626' }}>{error}</div>}

              <button 
                type="submit" 
                style={{ width: '100%', padding: '0.875rem', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 6px rgba(2, 132, 199, 0.2)' }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#0369a1'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#0284c7'}
              >
                Verify & Login
              </button>
            </form>
          )}
          
          <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.85rem', color: '#94a3b8' }}>
            Secure Portal • End-to-End Encrypted
          </p>
        </div>
      </div>
      </div>
    </>
  );
};

export default Login;
