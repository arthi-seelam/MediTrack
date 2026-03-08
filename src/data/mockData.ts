/**
 * Mock data for healthcare providers.
 * 
 * This module contains type definitions and sample data for:
 * - Hospital information and facilities
 * - Doctor profiles and specializations
 * - Supported cities and specialties
 */

/** Hospital facility information */
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

/** Doctor profile information */
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospitalId: string;
  hospitalName: string;
  city: string;
  experienceYears: number;
  consultationFee: number;
  availableTimings: string;
  rating: number;
  consultationType: 'Online' | 'Offline' | 'Both';
  image: string;
}

/** Medical specialties supported by the platform */
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

/** Supported cities with geographic coordinates */
export const CITIES = [
  { name: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.486 },
  { name: 'Warangal', state: 'Telangana', lat: 17.9784, lng: 79.5941 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.8777 },
  { name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.209 },
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Karimnagar', state: 'Telangana', lat: 18.4386, lng: 79.1288 },
  { name: 'Khammam', state: 'Telangana', lat: 17.2473, lng: 80.1514 },
];

/** Hospitals database */
export const HOSPITALS: Hospital[] = [
  // Hyderabad
  {
    id: '1', name: 'Apollo Hospitals', city: 'Hyderabad', state: 'Telangana', country: 'India',
    address: 'Jubilee Hills, Hyderabad, Telangana 500033',
    lat: 17.4326, lng: 78.4071, phone: '+91-40-23607777',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: true, traumaSupport: true, ventilatorAvailable: true,
    emergencyContact: '+91-40-23607777', verified: true, rating: 4.5, reviewCount: 2340,
    image: '', departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Nephrology'],
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
  },

  // Warangal
  {
    id: '10', name: 'MGM Hospital', city: 'Warangal', state: 'Telangana', country: 'India',
    address: 'Warangal, Telangana 506007',
    lat: 17.9784, lng: 79.5941, phone: '+91-870-2453777',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: true, traumaSupport: true, ventilatorAvailable: true,
    emergencyContact: '+91-870-2453777', verified: true, rating: 4.1, reviewCount: 1200,
    image: '', departments: ['General Medicine', 'Orthopedics', 'Pediatrics', 'Surgery', 'Gynecology'],
  },
  {
    id: '11', name: 'Sri Laxmi Hospital', city: 'Warangal', state: 'Telangana', country: 'India',
    address: 'Hanamkonda, Warangal, Telangana',
    lat: 17.9950, lng: 79.5800, phone: '+91-870-2562888',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: true, traumaSupport: false, ventilatorAvailable: true,
    emergencyContact: '+91-870-2562888', verified: true, rating: 4.0, reviewCount: 870,
    image: '', departments: ['Cardiology', 'General Medicine', 'Neurology', 'Dermatology'],
  },
  {
    id: '12', name: 'Rohini Superspeciality Hospital', city: 'Warangal', state: 'Telangana', country: 'India',
    address: 'Nakkalagutta, Hanamkonda, Warangal',
    lat: 18.0000, lng: 79.5700, phone: '+91-870-2441122',
    openingTime: '08:00', closingTime: '22:00', is24x7: false,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: false,
    bloodBankAvailable: false, traumaSupport: false, ventilatorAvailable: true,
    emergencyContact: '+91-870-2441122', verified: true, rating: 4.3, reviewCount: 650,
    image: '', departments: ['Cardiology', 'Orthopedics', 'Nephrology', 'Urology'],
  },
  {
    id: '13', name: 'Prathima Hospital', city: 'Warangal', state: 'Telangana', country: 'India',
    address: 'Kazipet, Warangal, Telangana',
    lat: 17.9600, lng: 79.5500, phone: '+91-870-2577333',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: true, traumaSupport: true, ventilatorAvailable: true,
    emergencyContact: '+91-870-2577333', verified: true, rating: 4.2, reviewCount: 920,
    image: '', departments: ['General Medicine', 'Pediatrics', 'Gynecology', 'ENT', 'Ophthalmology'],
  },

  // Karimnagar
  {
    id: '14', name: 'Chalmeda Anand Rao Hospital', city: 'Karimnagar', state: 'Telangana', country: 'India',
    address: 'Karimnagar, Telangana 505001',
    lat: 18.4386, lng: 79.1288, phone: '+91-878-2244555',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: true, traumaSupport: true, ventilatorAvailable: true,
    emergencyContact: '+91-878-2244555', verified: true, rating: 4.0, reviewCount: 780,
    image: '', departments: ['General Medicine', 'Surgery', 'Pediatrics', 'Orthopedics'],
  },

  // Khammam
  {
    id: '15', name: 'Government General Hospital', city: 'Khammam', state: 'Telangana', country: 'India',
    address: 'Khammam, Telangana 507003',
    lat: 17.2473, lng: 80.1514, phone: '+91-874-2243777',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: true, traumaSupport: true, ventilatorAvailable: true,
    emergencyContact: '+91-874-2243777', verified: true, rating: 3.8, reviewCount: 560,
    image: '', departments: ['General Medicine', 'Surgery', 'Gynecology', 'Pediatrics'],
  },

  // Mumbai
  {
    id: '5', name: 'Fortis Hospital', city: 'Mumbai', state: 'Maharashtra', country: 'India',
    address: 'Mulund West, Mumbai, Maharashtra',
    lat: 19.1726, lng: 72.9570, phone: '+91-22-42574257',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: true, traumaSupport: true, ventilatorAvailable: true,
    emergencyContact: '+91-22-42574257', verified: true, rating: 4.4, reviewCount: 3100,
    image: '', departments: ['Cardiology', 'Oncology', 'Nephrology', 'Neurosurgery'],
  },
  {
    id: '16', name: 'Lilavati Hospital', city: 'Mumbai', state: 'Maharashtra', country: 'India',
    address: 'Bandra West, Mumbai, Maharashtra',
    lat: 19.0509, lng: 72.8294, phone: '+91-22-26751000',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: true, traumaSupport: true, ventilatorAvailable: true,
    emergencyContact: '+91-22-26751000', verified: true, rating: 4.5, reviewCount: 2800,
    image: '', departments: ['Cardiology', 'Orthopedics', 'Neurology', 'Gastroenterology'],
  },

  // Delhi
  {
    id: '6', name: 'Medanta Hospital', city: 'Delhi', state: 'Delhi', country: 'India',
    address: 'Sector 38, Gurugram, Delhi NCR',
    lat: 28.4395, lng: 77.0266, phone: '+91-124-4141414',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: true, traumaSupport: true, ventilatorAvailable: true,
    emergencyContact: '+91-124-4141414', verified: true, rating: 4.6, reviewCount: 4200,
    image: '', departments: ['Cardiology', 'Liver Transplant', 'Robotics Surgery', 'Oncology'],
  },

  // Bangalore
  {
    id: '17', name: 'Narayana Health', city: 'Bangalore', state: 'Karnataka', country: 'India',
    address: 'Bommasandra, Bangalore, Karnataka',
    lat: 12.8190, lng: 77.6950, phone: '+91-80-71222222',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: true, traumaSupport: true, ventilatorAvailable: true,
    emergencyContact: '+91-80-71222222', verified: true, rating: 4.5, reviewCount: 3500,
    image: '', departments: ['Cardiology', 'Cardiac Surgery', 'Oncology', 'Nephrology', 'Neurology'],
  },
  {
    id: '18', name: 'Manipal Hospital', city: 'Bangalore', state: 'Karnataka', country: 'India',
    address: 'Old Airport Road, Bangalore, Karnataka',
    lat: 12.9600, lng: 77.6470, phone: '+91-80-25024444',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: true, traumaSupport: true, ventilatorAvailable: true,
    emergencyContact: '+91-80-25024444', verified: true, rating: 4.4, reviewCount: 2900,
    image: '', departments: ['Orthopedics', 'Neurosurgery', 'Pediatrics', 'Dermatology'],
  },

  // Chennai
  {
    id: '19', name: 'Apollo Hospitals Chennai', city: 'Chennai', state: 'Tamil Nadu', country: 'India',
    address: 'Greams Road, Chennai, Tamil Nadu',
    lat: 13.0604, lng: 80.2496, phone: '+91-44-28293333',
    openingTime: '00:00', closingTime: '23:59', is24x7: true,
    emergencySupported: true, icuAvailable: true, ambulanceAvailable: true,
    bloodBankAvailable: true, traumaSupport: true, ventilatorAvailable: true,
    emergencyContact: '+91-44-28293333', verified: true, rating: 4.6, reviewCount: 4100,
    image: '', departments: ['Cardiology', 'Oncology', 'Transplant Surgery', 'Neurology'],
  },
];

export const DOCTORS: Doctor[] = [
  // Hyderabad
  {
    id: '1', name: 'Dr. Priya Sharma', specialization: 'Cardiology',
    hospitalId: '1', hospitalName: 'Apollo Hospitals', city: 'Hyderabad',
    experienceYears: 15, consultationFee: 800,
    availableTimings: '9:00 AM - 5:00 PM', rating: 4.8,
    consultationType: 'Both', image: '',
  },
  {
    id: '2', name: 'Dr. Rajesh Kumar', specialization: 'Neurology',
    hospitalId: '2', hospitalName: 'CARE Hospitals', city: 'Hyderabad',
    experienceYears: 20, consultationFee: 1200,
    availableTimings: '10:00 AM - 4:00 PM', rating: 4.7,
    consultationType: 'Offline', image: '',
  },
  {
    id: '3', name: 'Dr. Anita Desai', specialization: 'Dermatology',
    hospitalId: '3', hospitalName: 'Yashoda Hospitals', city: 'Hyderabad',
    experienceYears: 10, consultationFee: 600,
    availableTimings: '11:00 AM - 7:00 PM', rating: 4.5,
    consultationType: 'Both', image: '',
  },
  {
    id: '4', name: 'Dr. Vikram Singh', specialization: 'Orthopedics',
    hospitalId: '1', hospitalName: 'Apollo Hospitals', city: 'Hyderabad',
    experienceYears: 18, consultationFee: 1000,
    availableTimings: '9:00 AM - 3:00 PM', rating: 4.6,
    consultationType: 'Offline', image: '',
  },
  {
    id: '5', name: 'Dr. Meera Patel', specialization: 'Pediatrics',
    hospitalId: '4', hospitalName: 'MaxCure Hospitals', city: 'Hyderabad',
    experienceYears: 12, consultationFee: 500,
    availableTimings: '10:00 AM - 6:00 PM', rating: 4.9,
    consultationType: 'Both', image: '',
  },
  {
    id: '6', name: 'Dr. Arjun Reddy', specialization: 'General Physician',
    hospitalId: '2', hospitalName: 'CARE Hospitals', city: 'Hyderabad',
    experienceYears: 8, consultationFee: 400,
    availableTimings: '8:00 AM - 8:00 PM', rating: 4.3,
    consultationType: 'Online', image: '',
  },

  // Warangal
  {
    id: '20', name: 'Dr. Suresh Reddy', specialization: 'General Physician',
    hospitalId: '10', hospitalName: 'MGM Hospital', city: 'Warangal',
    experienceYears: 14, consultationFee: 350,
    availableTimings: '9:00 AM - 5:00 PM', rating: 4.4,
    consultationType: 'Offline', image: '',
  },
  {
    id: '21', name: 'Dr. Kavitha Rao', specialization: 'Gynecology',
    hospitalId: '11', hospitalName: 'Sri Laxmi Hospital', city: 'Warangal',
    experienceYears: 16, consultationFee: 500,
    availableTimings: '10:00 AM - 4:00 PM', rating: 4.5,
    consultationType: 'Both', image: '',
  },
  {
    id: '22', name: 'Dr. Ramesh Gupta', specialization: 'Cardiology',
    hospitalId: '12', hospitalName: 'Rohini Superspeciality Hospital', city: 'Warangal',
    experienceYears: 20, consultationFee: 700,
    availableTimings: '9:00 AM - 2:00 PM', rating: 4.6,
    consultationType: 'Offline', image: '',
  },
  {
    id: '23', name: 'Dr. Lavanya Devi', specialization: 'Pediatrics',
    hospitalId: '13', hospitalName: 'Prathima Hospital', city: 'Warangal',
    experienceYears: 10, consultationFee: 400,
    availableTimings: '10:00 AM - 6:00 PM', rating: 4.3,
    consultationType: 'Both', image: '',
  },
  {
    id: '24', name: 'Dr. Naresh Kumar', specialization: 'Orthopedics',
    hospitalId: '10', hospitalName: 'MGM Hospital', city: 'Warangal',
    experienceYears: 12, consultationFee: 450,
    availableTimings: '8:00 AM - 3:00 PM', rating: 4.2,
    consultationType: 'Offline', image: '',
  },

  // Karimnagar
  {
    id: '25', name: 'Dr. Srinivas Rao', specialization: 'General Physician',
    hospitalId: '14', hospitalName: 'Chalmeda Anand Rao Hospital', city: 'Karimnagar',
    experienceYears: 18, consultationFee: 300,
    availableTimings: '9:00 AM - 5:00 PM', rating: 4.1,
    consultationType: 'Offline', image: '',
  },

  // Mumbai
  {
    id: '7', name: 'Dr. Sunita Agarwal', specialization: 'Gynecology',
    hospitalId: '5', hospitalName: 'Fortis Hospital', city: 'Mumbai',
    experienceYears: 22, consultationFee: 1500,
    availableTimings: '9:00 AM - 1:00 PM', rating: 4.8,
    consultationType: 'Offline', image: '',
  },
  {
    id: '26', name: 'Dr. Amit Shah', specialization: 'Neurology',
    hospitalId: '16', hospitalName: 'Lilavati Hospital', city: 'Mumbai',
    experienceYears: 15, consultationFee: 1200,
    availableTimings: '10:00 AM - 5:00 PM', rating: 4.6,
    consultationType: 'Both', image: '',
  },

  // Delhi
  {
    id: '8', name: 'Dr. Karthik Nair', specialization: 'Cardiology',
    hospitalId: '6', hospitalName: 'Medanta Hospital', city: 'Delhi',
    experienceYears: 25, consultationFee: 2000,
    availableTimings: '10:00 AM - 2:00 PM', rating: 4.9,
    consultationType: 'Both', image: '',
  },

  // Bangalore
  {
    id: '27', name: 'Dr. Devi Shetty', specialization: 'Cardiology',
    hospitalId: '17', hospitalName: 'Narayana Health', city: 'Bangalore',
    experienceYears: 30, consultationFee: 1500,
    availableTimings: '9:00 AM - 1:00 PM', rating: 4.9,
    consultationType: 'Offline', image: '',
  },
  {
    id: '28', name: 'Dr. Ranjini Mohan', specialization: 'Dermatology',
    hospitalId: '18', hospitalName: 'Manipal Hospital', city: 'Bangalore',
    experienceYears: 11, consultationFee: 800,
    availableTimings: '11:00 AM - 6:00 PM', rating: 4.4,
    consultationType: 'Both', image: '',
  },

  // Chennai
  {
    id: '29', name: 'Dr. Venkat Raman', specialization: 'Ophthalmology',
    hospitalId: '19', hospitalName: 'Apollo Hospitals Chennai', city: 'Chennai',
    experienceYears: 19, consultationFee: 900,
    availableTimings: '9:00 AM - 4:00 PM', rating: 4.7,
    consultationType: 'Both', image: '',
  },
];
