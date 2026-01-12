import { Patient, Message } from '@/types/medical';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Liz Eldy Flores Taylor',
    age: 22,
    gender: 'F',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    room: '201-A',
    status: 'stable',
    lastUpdate: new Date(),
    symptoms: ['Tos leve', 'Fatiga'],
    vitals: {
      oxygen: 97,
      temperature: 36.8,
      heartRate: 72,
      timestamp: new Date()
    }
  },
  {
    id: '2',
    name: 'Silvia Zuleyka Mejía Zuñiga',
    age: 17,
    gender: 'F',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    room: '105-B',
    status: 'observation',
    lastUpdate: new Date(),
    symptoms: ['Fiebre', 'Dolor de cabeza'],
    vitals: {
      oxygen: 93,
      temperature: 38.2,
      heartRate: 95,
      timestamp: new Date()
    }
  },
  {
    id: '3',
    name: 'Miguel André Mejía Zúñiga',
    age: 30,
    gender: 'M',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    room: '102-C',
    status: 'stable',
    lastUpdate: new Date(),
    symptoms: ['Monitoreo continuo'],
    vitals: {
      oxygen: 0,
      temperature: 0,
      heartRate: 0,
      timestamp: new Date()
    }
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'María García López',
    content: 'Doctor, me siento mucho mejor hoy.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isFromPatient: true,
    read: false
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Carlos Rodríguez Martín',
    content: 'La fiebre no ha bajado.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    isFromPatient: true,
    read: false
  }
];