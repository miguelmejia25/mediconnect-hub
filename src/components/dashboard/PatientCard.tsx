import { Patient } from '@/types/medical';
import { cn } from '@/lib/utils';
import { Clock, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PatientCardProps {
  patient: Patient;
}

const statusConfig = {
  stable: {
    label: 'Estable',
    className: 'status-normal'
  },
  observation: {
    label: 'Observación',
    className: 'status-warning'
  },
  critical: {
    label: 'Crítico',
    className: 'status-critical'
  }
};

const PatientCard = ({ patient }: PatientCardProps) => {
  const status = statusConfig[patient.status];

  return (
    <Link to={`/patients/${patient.id}`}>
      <div className="vital-card group cursor-pointer">
        <div className="flex items-start gap-4">
          <img
            src={patient.avatar}
            alt={patient.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-border"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {patient.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {patient.age} años • Hab. {patient.room}
                </p>
              </div>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium shrink-0",
                status.className
              )}>
                {status.label}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-vital-oxygen" />
                <span>{patient.vitals.oxygen}%</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-vital-temperature">🌡️</span>
                <span>{patient.vitals.temperature}°C</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-vital-heartrate">❤️</span>
                <span>{patient.vitals.heartRate} bpm</span>
              </div>
            </div>

            {patient.symptoms.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {patient.symptoms.slice(0, 2).map((symptom, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs"
                  >
                    {symptom}
                  </span>
                ))}
                {patient.symptoms.length > 2 && (
                  <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs">
                    +{patient.symptoms.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PatientCard;
