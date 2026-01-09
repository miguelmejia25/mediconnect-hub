import { Patient, Message } from '@/types/medical';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'María García López',
    age: 67,
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
    name: 'Carlos Rodríguez Martín',
    age: 45,
    gender: 'M',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    room: '105-B',
    status: 'observation',
    lastUpdate: new Date(),
    symptoms: ['Fiebre', 'Dolor de cabeza', 'Náuseas'],
    vitals: {
      oxygen: 93,
      temperature: 38.2,
      heartRate: 95,
      timestamp: new Date()
    }
  },
  {
    id: '3',
    name: 'Ana Fernández Ruiz',
    age: 78,
    gender: 'F',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    room: '302-A',
    status: 'critical',
    lastUpdate: new Date(),
    symptoms: ['Dificultad respiratoria', 'Dolor torácico', 'Hipertensión'],
    vitals: {
      oxygen: 88,
      temperature: 37.9,
      heartRate: 115,
      timestamp: new Date()
    }
  },
  {
    id: '4',
    name: 'Pedro Sánchez Gil',
    age: 52,
    gender: 'M',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    room: '108-C',
    status: 'stable',
    lastUpdate: new Date(),
    symptoms: ['Recuperación post-operatoria'],
    vitals: {
      oxygen: 98,
      temperature: 36.5,
      heartRate: 68,
      timestamp: new Date()
    }
  },
  {
    id: '5',
    name: 'Laura Jiménez Torres',
    age: 34,
    gender: 'F',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    room: '210-A',
    status: 'observation',
    lastUpdate: new Date(),
    symptoms: ['Embarazo de alto riesgo', 'Presión alta'],
    vitals: {
      oxygen: 96,
      temperature: 37.0,
      heartRate: 88,
      timestamp: new Date()
    }
  },
  {
    id: '6',
    name: 'Miguel Ángel López',
    age: 61,
    gender: 'M',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    room: '115-B',
    status: 'stable',
    lastUpdate: new Date(),
    symptoms: ['Diabetes controlada', 'Revisión rutinaria'],
    vitals: {
      oxygen: 97,
      temperature: 36.6,
      heartRate: 75,
      timestamp: new Date()
    }
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'María García López',
    content: 'Doctor, me siento mucho mejor hoy. La tos ha disminuido considerablemente.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isFromPatient: true,
    read: false
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Carlos Rodríguez Martín',
    content: 'La fiebre no ha bajado, ¿podría revisar mi medicación?',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    isFromPatient: true,
    read: false
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Ana Fernández Ruiz',
    content: 'Revisaré sus signos vitales en breve. Mantenga el oxígeno conectado.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    isFromPatient: false,
    read: true
  },
  {
    id: '4',
    patientId: '5',
    patientName: 'Laura Jiménez Torres',
    content: '¿Cuándo será mi próxima ecografía?',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    isFromPatient: true,
    read: true
  },
  {
    id: '5',
    patientId: '4',
    patientName: 'Pedro Sánchez Gil',
    content: 'Gracias por la atención, me siento mucho mejor después de la cirugía.',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    isFromPatient: true,
    read: true
  }
];
