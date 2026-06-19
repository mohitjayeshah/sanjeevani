import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
// We still import CLINICS statically for now, as there is no UI to create clinics.
import { CLINICS } from '../mockData';

const ClinicContext = createContext();

export const useClinic = () => useContext(ClinicContext);

export const ClinicProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data from Supabase on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [usersRes, appsRes, recordsRes] = await Promise.all([
          supabase.from('users').select('*'),
          supabase.from('appointments').select('*'),
          supabase.from('medical_records').select('*')
        ]);

        if (usersRes.data) setUsers(usersRes.data);
        if (appsRes.data) setAppointments(appsRes.data);
        if (recordsRes.data) setRecords(recordsRes.data);
      } catch (error) {
        console.error("Error fetching from Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // --- Actions ---

  const registerPatient = async (patient) => {
    const newPatient = {
      id: `u${Date.now()}`,
      role: 'patient',
      ...patient
    };
    
    // Optimistic UI Update
    setUsers(prev => [...prev, newPatient]);

    // Async DB Update
    await supabase.from('users').insert([{
      id: newPatient.id,
      role: newPatient.role,
      name: newPatient.name,
      email: newPatient.email || null,
      mobile: newPatient.mobile,
      clinicId: newPatient.clinicId
    }]);

    return newPatient;
  };

  const getPatientByPhone = (phone) => {
    return users.find(u => u.role === 'patient' && u.mobile === phone);
  };

  const getPatientById = (id) => {
    return users.find(u => u.id === id);
  };

  const addAppointment = async (appointment) => {
    const newApp = {
      id: `a${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'waiting',
      token: appointments.length + 1,
      ...appointment
    };
    
    // Optimistic UI
    setAppointments(prev => [...prev, newApp]);

    // Async DB Update
    await supabase.from('appointments').insert([{
      id: newApp.id,
      patientId: newApp.patientId,
      doctorId: newApp.doctorId,
      clinicId: newApp.clinicId,
      date: newApp.date,
      token: newApp.token,
      status: newApp.status,
      reason: newApp.reason
    }]);
  };

  const updateAppointmentStatus = async (id, status) => {
    // Optimistic UI
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status } : app
    ));

    // Async DB Update
    await supabase.from('appointments').update({ status }).eq('id', id);
  };

  const addMedicalRecord = async (record) => {
    const newRecord = {
      id: `r${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...record
    };
    
    // Optimistic UI
    setRecords(prev => [...prev, newRecord]);

    // Async DB Update
    await supabase.from('medical_records').insert([{
      id: newRecord.id,
      patientId: newRecord.patientId,
      doctorId: newRecord.doctorId,
      clinicId: newRecord.clinicId,
      date: newRecord.date,
      diagnosis: newRecord.diagnosis,
      prescription: newRecord.prescription,
      receipt: newRecord.receipt
    }]);
  };

  const getPatientHistory = (patientId) => {
    return records.filter(r => r.patientId === patientId).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const updateRecordReceiptStatus = async (recordId, status) => {
    // Optimistic UI
    const recordToUpdate = records.find(r => r.id === recordId);
    if (!recordToUpdate) return;
    
    const newReceipt = { ...recordToUpdate.receipt, status };
    
    setRecords(prev => prev.map(r => 
      r.id === recordId ? { ...r, receipt: newReceipt } : r
    ));

    // Async DB Update
    await supabase.from('medical_records').update({ receipt: newReceipt }).eq('id', recordId);
  };

  return (
    <ClinicContext.Provider value={{
      users,
      appointments,
      records,
      CLINICS,
      isLoading,
      registerPatient,
      getPatientByPhone,
      getPatientById,
      addAppointment,
      updateAppointmentStatus,
      addMedicalRecord,
      getPatientHistory,
      updateRecordReceiptStatus
    }}>
      {children}
    </ClinicContext.Provider>
  );
};
