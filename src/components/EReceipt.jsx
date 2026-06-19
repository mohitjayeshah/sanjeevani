import React from 'react';
import html2pdf from 'html2pdf.js';
import { USERS } from '../mockData';
import logoUrl from '../assets/logo.png';

const EReceipt = ({ record }) => {
  const patient = USERS.find(u => u.id === record.patientId);

  const printPdf = () => {
    const element = document.getElementById(`receipt-${record.id}`);
    const opt = {
      margin:       0.5,
      filename:     `Sanjeevani_Medical_Record_${record.id}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '15px'}}>
        <button className="btn btn-primary" onClick={printPdf}>
          Download Official PDF
        </button>
      </div>
      
      <div style={{padding: '1rem', display: 'flex', justifyContent: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px'}}>
        <div id={`receipt-${record.id}`} style={{ 
          width: '100%', 
          maxWidth: '800px', 
          padding: '40px 50px', 
          fontFamily: '"Times New Roman", Times, serif', 
          color: '#1e293b', 
          background: '#fff', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          {/* Subtle Watermark */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', opacity: 0.03, fontSize: '120px', fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
            SANJEEVANI
          </div>

          {/* Header Section */}
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
              <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: 'bold' }}>Dr. Ramesh Kulkarni</h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#475569' }}>Cardiologist • Reg No: MH-1245</p>
            </div>
          </div>
          
          {/* 1. Patient Details Grid */}
          <div style={{ marginBottom: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: '#f8fafc', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Patient Name</p>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>{patient?.name}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Date of Visit</p>
              <p style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>{record.date} • <strong style={{color: '#0284c7'}}>Past Visit</strong></p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Mobile Number</p>
              <p style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>+91 {patient?.mobile}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Record ID</p>
              <p style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>#{record.id.toUpperCase()}</p>
            </div>
          </div>

          {/* 2. Diagnosis */}
          <div style={{ marginBottom: '35px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', textTransform: 'uppercase', color: '#0284c7', letterSpacing: '0.5px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px' }}>Clinical Diagnosis</h3>
            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>{record.diagnosis}</p>
          </div>

          {/* 4. Prescription (Rx) */}
          <div style={{ marginBottom: '40px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-20px', top: '-10px', fontSize: '60px', fontFamily: 'serif', color: '#0284c7', opacity: 0.1, pointerEvents: 'none' }}>
              Rx
            </div>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '24px', fontFamily: 'serif', color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: '8px', display: 'inline-block', paddingRight: '20px' }}>Rx</h3>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px 5px', borderBottom: '2px solid #cbd5e1', textAlign: 'left', width: '5%', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>#</th>
                  <th style={{ padding: '10px 5px', borderBottom: '2px solid #cbd5e1', textAlign: 'left', width: '45%', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Medicine Name</th>
                  <th style={{ padding: '10px 5px', borderBottom: '2px solid #cbd5e1', textAlign: 'left', width: '25%', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Frequency</th>
                  <th style={{ padding: '10px 5px', borderBottom: '2px solid #cbd5e1', textAlign: 'left', width: '25%', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {record.prescription.split('\n').map((item, i) => {
                  // Attempt to parse "Tablet Paracetamol - 1-0-1 for 5 days"
                  let name = item;
                  let freq = "-";
                  let dur = "-";
                  if(item.includes(' - ') && item.includes(' for ')) {
                    const parts = item.split(' - ');
                    name = parts[0];
                    const subParts = parts[1].split(' for ');
                    freq = subParts[0];
                    dur = subParts[1];
                  } else if (item.includes(',')) {
                    const parts = item.split(',');
                    name = parts[0];
                    freq = parts[1];
                  }
                  
                  return (
                    <tr key={i}>
                      <td style={{ padding: '12px 5px', borderBottom: '1px dashed #e2e8f0', color: '#64748b', verticalAlign: 'top' }}>0{i+1}</td>
                      <td style={{ padding: '12px 5px', borderBottom: '1px dashed #e2e8f0', fontWeight: 'bold', color: '#0f172a', fontSize: '15px' }}>
                        {name}
                      </td>
                      <td style={{ padding: '12px 5px', borderBottom: '1px dashed #e2e8f0', color: '#1e293b', fontWeight: '500' }}>{freq}</td>
                      <td style={{ padding: '12px 5px', borderBottom: '1px dashed #e2e8f0', color: '#1e293b' }}>{dur}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* 5. Footer */}
          <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '15px 0 0 0', fontSize: '10px', color: '#94a3b8' }}>Valid for 15 days from date of issue. This is a computer generated duplicate of a past record.</p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '0 20px' }}>
              <div style={{ borderBottom: '1px solid #0f172a', width: '150px', marginBottom: '10px' }}></div>
              <h3 style={{ margin: 0, fontSize: '14px', color: '#0f172a' }}>Dr. Ramesh Kulkarni</h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Authorized Signature</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EReceipt;
