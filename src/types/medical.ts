export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  avatar: string;
  room: string;
  status: 'stable' | 'observation' | 'critical';
  lastUpdate: Date;
  symptoms: string[];
  vitals: VitalSigns;
}

export interface VitalSigns {
  oxygen: number;
  temperature: number;
  heartRate: number;
  timestamp: Date;
}

export interface Message {
  id: string;
  patientId: string;
  patientName: string;
  content: string;
  timestamp: Date;
  isFromPatient: boolean;
  read: boolean;
}

export type VitalStatus = 'normal' | 'warning' | 'critical';

export const getOxygenStatus = (value: number): VitalStatus => {
  if (value >= 95) return 'normal';
  if (value >= 90) return 'warning';
  return 'critical';
};

export const getTemperatureStatus = (value: number): VitalStatus => {
  if (value >= 36.1 && value <= 37.2) return 'normal';
  if (value >= 35.5 && value <= 38) return 'warning';
  return 'critical';
};

export const getHeartRateStatus = (value: number): VitalStatus => {
  if (value >= 60 && value <= 100) return 'normal';
  if (value >= 50 && value <= 110) return 'warning';
  return 'critical';
};
