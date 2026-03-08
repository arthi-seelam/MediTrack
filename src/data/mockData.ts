export interface Hospital {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  openingTime: string;
  closingTime: string;
  is24x7: boolean;
  emergencySupported: boolean;
  icuAvailable: boolean;
  ambulanceAvailable: boolean;
  bloodBankAvailable: boolean;
  traumaSupport: boolean;
  ventilatorAvailable: boolean;
  emergencyContact: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  image: string;
  departments: string[];
  distance?: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospitalId: string;
  hospitalName: string;
  experienceYears: number;
  consultationFee: number;
  availableTimings: string;
  rating: number;
  consultationType: 'Online' | 'Offline' | 'Both';
  image: string;
}

export const SPECIALTIES = [
  { label: 'Cardiology', icon: '❤️', slug: 'cardiology' },
  { label: 'Dermatology', icon: '🧴', slug: 'dermatology' },
  { label: 'Pediatrics', icon: '👶', slug: 'pediatrics' },
  { label: 'Orthopedics', icon: '🦴', slug: 'orthopedics' },
  { label: 'Neurology', icon: '🧠', slug: 'neurology' },
  { label: 'General Physician', icon: '🩺', slug: 'general' },
  { label: 'Gynecology', icon: '👩', slug: 'gynecology' },
  { label: 'Ophthalmology', icon: '👁️', slug: 'ophthalmology' },
];

export const HOSPITALS: Hospital[] = [
  {
    id: '1', name: 'Apollo Hospitals', city: 'Hyderabad', state: 'Telangana', country: 'India',
    address: 'Jubilee Hills, Hyderabad, Telangana 500033',
    lat: 17.4326, lng: 78.4071, phone: '+91-40-23607777',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: true, traumaSupport: true, ventilatorAvailable: true,
    emergencyContact: '+91-40-23607777', verified: true, rating: 4.5, reviewCount: 2340,
    image: '', departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Nephrology'],
    distance: 2.3,
  },
  {
    id: '2', name: 'CARE Hospitals', city: 'Hyderabad', state: 'Telangana', country: 'India',
    address: 'Road No. 1, Banjara Hills, Hyderabad',
    lat: 17.4156, lng: 78.4347, phone: '+91-40-30418888',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: true, traumaSupport: true, ventilatorAvailable: true,
    emergencyContact: '+91-40-30418888', verified: true, rating: 4.3, reviewCount: 1820,
    image: '', departments: ['Cardiology', 'Gastroenterology', 'Pulmonology', 'Urology'],
    distance: 3.1,
  },
  {
    id: '3', name: 'Yashoda Hospitals', city: 'Hyderabad', state: 'Telangana', country: 'India',
    address: 'Somajiguda, Hyderabad, Telangana',
    lat: 17.4375, lng: 78.4483, phone: '+91-40-45674567',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: false, traumaSupport: true, ventilatorAvailable: true,
    emergencyContact: '+91-40-45674567', verified: true, rating: 4.2, reviewCount: 1560,
    image: '', departments: ['Neurology', 'Orthopedics', 'ENT', 'Dermatology'],
    distance: 4.5,
  },
  {
    id: '4', name: 'MaxCure Hospitals', city: 'Hyderabad', state: 'Telangana', country: 'India',
    address: 'Madhapur, Hyderabad, Telangana',
    lat: 17.4489, lng: 78.3907, phone: '+91-40-44888888',
    openingTime: '08:00', closingTime: '22:00', is24x7: false,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: false,
    bloodBankAvailable: false, traumaSupport: false, ventilatorAvailable: true,
    emergencyContact: '+91-40-44888888', verified: true, rating: 4.0, reviewCount: 980,
    image: '', departments: ['General Medicine', 'Gynecology', 'Pediatrics'],
    distance: 5.8,
  },
  {
    id: '5', name: 'Fortis Hospital', city: 'Mumbai', state: 'Maharashtra', country: 'India',
    address: 'Mulund West, Mumbai, Maharashtra',
    lat: 19.1726, lng: 72.9570, phone: '+91-22-42574257',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: true, traumaSupport: true, ventilatorAvailable: true,
    emergencyContact: '+91-22-42574257', verified: true, rating: 4.4, reviewCount: 3100,
    image: '', departments: ['Cardiology', 'Oncology', 'Nephrology', 'Neurosurgery'],
    distance: 12.0,
  },
  {
    id: '6', name: 'Medanta Hospital', city: 'Delhi', state: 'Delhi', country: 'India',
    address: 'Sector 38, Gurugram, Delhi NCR',
    lat: 28.4395, lng: 77.0266, phone: '+91-124-4141414',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: true, traumaSupport: true, ventilatorAvailable: true,
    emergencyContact: '+91-124-4141414', verified: true, rating: 4.6, reviewCount: 4200,
    image: '', departments: ['Cardiology', 'Liver Transplant', 'Robotics Surgery', 'Oncology'],
    distance: 18.0,
  },
];

export const DOCTORS: Doctor[] = [
  {
    id: '1', name: 'Dr. Priya Sharma', specialization: 'Cardiology',
    hospitalId: '1', hospitalName: 'Apollo Hospitals',
    experienceYears: 15, consultationFee: 800,
    availableTimings: '9:00 AM - 5:00 PM', rating: 4.8,
    consultationType: 'Both', image: '',
  },
  {
    id: '2', name: 'Dr. Rajesh Kumar', specialization: 'Neurology',
    hospitalId: '2', hospitalName: 'CARE Hospitals',
    experienceYears: 20, consultationFee: 1200,
    availableTimings: '10:00 AM - 4:00 PM', rating: 4.7,
    consultationType: 'Offline', image: '',
  },
  {
    id: '3', name: 'Dr. Anita Desai', specialization: 'Dermatology',
    hospitalId: '3', hospitalName: 'Yashoda Hospitals',
    experienceYears: 10, consultationFee: 600,
    availableTimings: '11:00 AM - 7:00 PM', rating: 4.5,
    consultationType: 'Both', image: '',
  },
  {
    id: '4', name: 'Dr. Vikram Singh', specialization: 'Orthopedics',
    hospitalId: '1', hospitalName: 'Apollo Hospitals',
    experienceYears: 18, consultationFee: 1000,
    availableTimings: '9:00 AM - 3:00 PM', rating: 4.6,
    consultationType: 'Offline', image: '',
  },
  {
    id: '5', name: 'Dr. Meera Patel', specialization: 'Pediatrics',
    hospitalId: '4', hospitalName: 'MaxCure Hospitals',
    experienceYears: 12, consultationFee: 500,
    availableTimings: '10:00 AM - 6:00 PM', rating: 4.9,
    consultationType: 'Both', image: '',
  },
  {
    id: '6', name: 'Dr. Arjun Reddy', specialization: 'General Physician',
    hospitalId: '2', hospitalName: 'CARE Hospitals',
    experienceYears: 8, consultationFee: 400,
    availableTimings: '8:00 AM - 8:00 PM', rating: 4.3,
    consultationType: 'Online', image: '',
  },
  {
    id: '7', name: 'Dr. Sunita Agarwal', specialization: 'Gynecology',
    hospitalId: '5', hospitalName: 'Fortis Hospital',
    experienceYears: 22, consultationFee: 1500,
    availableTimings: '9:00 AM - 1:00 PM', rating: 4.8,
    consultationType: 'Offline', image: '',
  },
  {
    id: '8', name: 'Dr. Karthik Nair', specialization: 'Cardiology',
    hospitalId: '6', hospitalName: 'Medanta Hospital',
    experienceYears: 25, consultationFee: 2000,
    availableTimings: '10:00 AM - 2:00 PM', rating: 4.9,
    consultationType: 'Both', image: '',
  },
];
