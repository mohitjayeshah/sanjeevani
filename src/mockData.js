export const USERS = [
  // Clinic 1 Staff
  { id: 'u1', name: 'Dr. Ramesh Kulkarni', role: 'doctor', mobile: '9876543210', clinicId: 'c1' },
  { id: 'u2', name: 'Snehal Deshmukh', role: 'receptionist', mobile: '9876543211', clinicId: 'c1' },
  // Clinic 2 Staff
  { id: 'u4', name: 'Dr. Anjali Patil', role: 'doctor', mobile: '9876543213', clinicId: 'c2' },
  { id: 'u5', name: 'Priya Joshi', role: 'receptionist', mobile: '9876543214', clinicId: 'c2' },
  
  // Patients
  { id: 'u3', name: 'Santosh Jadhav', role: 'patient', mobile: '9876543212', clinicId: 'c1' },
  { id: 'u6', name: 'Raju Shinde', role: 'patient', mobile: '9876543215', clinicId: 'c2' },
  { id: 'u7', name: 'Vijay Pawar', role: 'patient', mobile: '9876543216', clinicId: 'c1' },
  { id: 'u8', name: 'Sujata Mane', role: 'patient', mobile: '9876543217', clinicId: 'c1' },
  { id: 'u9', name: 'Nilesh Chavan', role: 'patient', mobile: '9876543218', clinicId: 'c1' },
];

export const CLINICS = [
  { id: 'c1', name: 'Swasthya Care Clinic' },
  { id: 'c2', name: 'Sanjeevani Polyclinic' }
];

export const APPOINTMENTS = [
  { id: 'a1', patientId: 'u3', doctorId: 'u1', clinicId: 'c1', date: new Date().toISOString().split('T')[0], status: 'waiting', reason: 'Fever and Cough', token: 1 },
  { id: 'a2', patientId: 'u6', doctorId: 'u4', clinicId: 'c2', date: new Date().toISOString().split('T')[0], status: 'waiting', reason: 'Regular Checkup', token: 2 },
  { id: 'a3', patientId: 'u7', doctorId: 'u1', clinicId: 'c1', date: new Date().toISOString().split('T')[0], status: 'waiting', reason: 'Stomach Ache', token: 3 },
  { id: 'a4', patientId: 'u8', doctorId: 'u1', clinicId: 'c1', date: new Date().toISOString().split('T')[0], status: 'waiting', reason: 'Body Pain and Weakness', token: 4 },
  { id: 'a5', patientId: 'u9', doctorId: 'u1', clinicId: 'c1', date: new Date().toISOString().split('T')[0], status: 'waiting', reason: 'Follow-up for Hypertension', token: 5 },
];

export const MEDICAL_RECORDS = [
  {
    id: 'r1',
    patientId: 'u3',
    doctorId: 'u1',
    clinicId: 'c1',
    date: '2023-11-10',
    diagnosis: 'Viral Fever',
    prescription: 'Paracetamol 500mg, Rest for 3 days',
    receipt: {
      amount: 500,
      status: 'Paid',
      translations: {
        en: { title: 'E-Receipt', clinic: 'Swasthya Care Clinic', doctor: 'Dr. Ramesh Kulkarni', patient: 'Santosh Jadhav', diagnosis: 'Viral Fever', fee: 'Consultation Fee: ₹500', note: 'Thank you for your visit.' },
        mr: { title: 'ई-पावती', clinic: 'स्वास्थ्य केअर क्लिनिक', doctor: 'डॉ. रमेश कुलकर्णी', patient: 'संतोष जाधव', diagnosis: 'व्हायरल ताप', fee: 'सल्ला शुल्क: ₹५००', note: 'भेट दिल्याबद्दल धन्यवाद.' },
        hi: { title: 'ई-रसीद', clinic: 'स्वास्थ्य केयर क्लिनिक', doctor: 'डॉ. रमेश कुलकर्णी', patient: 'संतोष जाधव', diagnosis: 'वायरल बुखार', fee: 'परामर्श शुल्क: ₹500', note: 'आपकी यात्रा के लिए धन्यवाद।' }
      }
    }
  },
  {
    id: 'r2',
    patientId: 'u7',
    doctorId: 'u1',
    clinicId: 'c1',
    date: '2024-01-15',
    diagnosis: 'Acid Reflux (GERD)',
    prescription: 'Pantoprazole 40mg before breakfast for 5 days',
    receipt: {
      amount: 450,
      status: 'Paid',
      translations: {
        en: { title: 'E-Receipt', clinic: 'Swasthya Care Clinic', doctor: 'Dr. Ramesh Kulkarni', patient: 'Vijay Pawar', diagnosis: 'Acid Reflux', fee: 'Consultation Fee: ₹450', note: 'Thank you for your visit.' },
        mr: { title: 'ई-पावती', clinic: 'स्वास्थ्य केअर क्लिनिक', doctor: 'डॉ. रमेश कुलकर्णी', patient: 'विजय पवार', diagnosis: 'ऍसिड रिफ्लक्स', fee: 'सल्ला शुल्क: ₹४५०', note: 'भेट दिल्याबद्दल धन्यवाद.' },
        hi: { title: 'ई-रसीद', clinic: 'स्वास्थ्य केयर क्लिनिक', doctor: 'डॉ. रमेश कुलकर्णी', patient: 'विजय पवार', diagnosis: 'एसिड रिफ्लक्स', fee: 'परामर्श शुल्क: ₹450', note: 'आपकी यात्रा के लिए धन्यवाद।' }
      }
    }
  },
  {
    id: 'r3',
    patientId: 'u9',
    doctorId: 'u1',
    clinicId: 'c1',
    date: '2024-05-20',
    diagnosis: 'Hypertension',
    prescription: 'Telmisartan 40mg daily, Low sodium diet',
    receipt: {
      amount: 500,
      status: 'Paid',
      translations: {
        en: { title: 'E-Receipt', clinic: 'Swasthya Care Clinic', doctor: 'Dr. Ramesh Kulkarni', patient: 'Nilesh Chavan', diagnosis: 'Hypertension', fee: 'Consultation Fee: ₹500', note: 'Thank you for your visit.' },
        mr: { title: 'ई-पावती', clinic: 'स्वास्थ्य केअर क्लिनिक', doctor: 'डॉ. रमेश कुलकर्णी', patient: 'निलेश चव्हाण', diagnosis: 'उच्च रक्तदाब', fee: 'सल्ला शुल्क: ₹५००', note: 'भेट दिल्याबद्दल धन्यवाद.' },
        hi: { title: 'ई-रसीद', clinic: 'स्वास्थ्य केयर क्लिनिक', doctor: 'डॉ. रमेश कुलकर्णी', patient: 'निलेश चव्हाण', diagnosis: 'उच्च रक्तचाप', fee: 'परामर्श शुल्क: ₹500', note: 'आपकी यात्रा के लिए धन्यवाद।' }
      }
    }
  }
];
