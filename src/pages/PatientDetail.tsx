import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wind, Thermometer, Heart, Clock, Plus, FileText, MessageSquare } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import VitalCard from '@/components/dashboard/VitalCard';
import { Button } from '@/components/ui/button';
import { mockPatients } from '@/data/mockData';
import { getOxygenStatus, getTemperatureStatus, getHeartRateStatus } from '@/types/medical';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = mockPatients.find(p => p.id === id);

  if (!patient) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Paciente no encontrado</p>
          <Button onClick={() => navigate('/patients')} className="mt-4">
            Volver a pacientes
          </Button>
        </div>
      </MainLayout>
    );
  }

  const statusConfig = {
    stable: { label: 'Estable', className: 'status-normal' },
    observation: { label: 'En Observación', className: 'status-warning' },
    critical: { label: 'Estado Crítico', className: 'status-critical' }
  };

  const status = statusConfig[patient.status];

  return (
    <MainLayout>
      {/* Back button */}
      <button
        onClick={() => navigate('/patients')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a pacientes
      </button>

      {/* Patient Header */}
      <div className="vital-card mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={patient.avatar}
            alt={patient.name}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-border"
          />
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <h1 className="font-display text-2xl font-bold text-foreground">
                {patient.name}
              </h1>
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium w-fit",
                status.className
              )}>
                {status.label}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{patient.age} años</span>
              <span>•</span>
              <span>{patient.gender === 'M' ? 'Masculino' : 'Femenino'}</span>
              <span>•</span>
              <span>Habitación {patient.room}</span>
            </div>

            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Última actualización: {format(patient.lastUpdate, "dd MMM yyyy, HH:mm", { locale: es })}</span>
            </div>
          </div>

          <div className="flex gap-2 self-start">
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Historia
            </Button>
            <Button 
              className="medical-gradient text-primary-foreground gap-2"
              onClick={() => navigate('/messages')}
            >
              <MessageSquare className="w-4 h-4" />
              Mensaje
            </Button>
          </div>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Signos Vitales
          </h2>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Nueva Lectura
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <VitalCard
            title="Saturación de Oxígeno"
            value={patient.vitals.oxygen}
            unit="SpO2 %"
            status={getOxygenStatus(patient.vitals.oxygen)}
            icon={Wind}
            color="text-vital-oxygen"
          />
          <VitalCard
            title="Temperatura Corporal"
            value={patient.vitals.temperature}
            unit="°C"
            status={getTemperatureStatus(patient.vitals.temperature)}
            icon={Thermometer}
            color="text-vital-temperature"
          />
          <VitalCard
            title="Ritmo Cardíaco"
            value={patient.vitals.heartRate}
            unit="bpm"
            status={getHeartRateStatus(patient.vitals.heartRate)}
            icon={Heart}
            color="text-vital-heartrate"
          />
        </div>
      </div>

      {/* Symptoms */}
      <div className="vital-card">
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">
          Síntomas Actuales
        </h2>
        
        {patient.symptoms.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {patient.symptoms.map((symptom, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium"
              >
                {symptom}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No hay síntomas registrados</p>
        )}

        <Button variant="outline" className="mt-4 gap-2">
          <Plus className="w-4 h-4" />
          Agregar Síntoma
        </Button>
      </div>
    </MainLayout>
  );
};

export default PatientDetail;
