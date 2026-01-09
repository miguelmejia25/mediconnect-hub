import { Wind, Thermometer, Heart, AlertCircle, TrendingUp } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import { mockPatients } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { getOxygenStatus, getTemperatureStatus, getHeartRateStatus } from '@/types/medical';

const Monitoring = () => {
  const criticalPatients = mockPatients.filter(p => p.status === 'critical');
  
  // Calculate averages
  const avgOxygen = Math.round(mockPatients.reduce((sum, p) => sum + p.vitals.oxygen, 0) / mockPatients.length * 10) / 10;
  const avgTemp = Math.round(mockPatients.reduce((sum, p) => sum + p.vitals.temperature, 0) / mockPatients.length * 10) / 10;
  const avgHeart = Math.round(mockPatients.reduce((sum, p) => sum + p.vitals.heartRate, 0) / mockPatients.length);

  return (
    <MainLayout>
      <Header 
        title="Monitoreo en Tiempo Real" 
        subtitle="Supervisión de signos vitales de todos los pacientes" 
      />

      {/* Critical Alerts */}
      {criticalPatients.length > 0 && (
        <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
          <div className="flex items-center gap-2 text-destructive mb-3">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-semibold">Alertas Críticas</h3>
          </div>
          <div className="grid gap-2">
            {criticalPatients.map(patient => (
              <div 
                key={patient.id}
                className="flex items-center justify-between p-3 bg-card rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-foreground">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">Hab. {patient.room}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className={cn(
                    getOxygenStatus(patient.vitals.oxygen) === 'critical' && "text-destructive font-semibold"
                  )}>
                    O2: {patient.vitals.oxygen}%
                  </span>
                  <span className={cn(
                    getHeartRateStatus(patient.vitals.heartRate) === 'critical' && "text-destructive font-semibold"
                  )}>
                    HR: {patient.vitals.heartRate} bpm
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="vital-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-vital-oxygen/10">
              <Wind className="w-6 h-6 text-vital-oxygen" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Oxígeno Promedio</p>
              <p className="text-2xl font-display font-bold text-foreground">{avgOxygen}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-success">
            <TrendingUp className="w-4 h-4" />
            <span>Dentro del rango normal</span>
          </div>
        </div>

        <div className="vital-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-vital-temperature/10">
              <Thermometer className="w-6 h-6 text-vital-temperature" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Temperatura Promedio</p>
              <p className="text-2xl font-display font-bold text-foreground">{avgTemp}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-success">
            <TrendingUp className="w-4 h-4" />
            <span>Valores estables</span>
          </div>
        </div>

        <div className="vital-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-vital-heartrate/10">
              <Heart className="w-6 h-6 text-vital-heartrate" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ritmo Cardíaco Prom.</p>
              <p className="text-2xl font-display font-bold text-foreground">{avgHeart} bpm</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-success">
            <TrendingUp className="w-4 h-4" />
            <span>Sin anomalías</span>
          </div>
        </div>
      </div>

      {/* All Patients Vitals */}
      <div className="vital-card">
        <h2 className="font-display text-xl font-semibold text-foreground mb-6">
          Todos los Pacientes
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Paciente</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Habitación</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  <span className="flex items-center justify-center gap-1">
                    <Wind className="w-4 h-4 text-vital-oxygen" /> O2
                  </span>
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  <span className="flex items-center justify-center gap-1">
                    <Thermometer className="w-4 h-4 text-vital-temperature" /> Temp
                  </span>
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  <span className="flex items-center justify-center gap-1">
                    <Heart className="w-4 h-4 text-vital-heartrate" /> HR
                  </span>
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockPatients.map((patient) => {
                const oxygenStatus = getOxygenStatus(patient.vitals.oxygen);
                const tempStatus = getTemperatureStatus(patient.vitals.temperature);
                const heartStatus = getHeartRateStatus(patient.vitals.heartRate);

                const statusStyles = {
                  normal: 'text-success',
                  warning: 'text-warning',
                  critical: 'text-destructive font-semibold'
                };

                const patientStatusConfig = {
                  stable: { label: 'Estable', className: 'status-normal' },
                  observation: { label: 'Observación', className: 'status-warning' },
                  critical: { label: 'Crítico', className: 'status-critical' }
                };

                return (
                  <tr key={patient.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={patient.avatar}
                          alt={patient.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-foreground">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">{patient.age} años</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground">{patient.room}</td>
                    <td className={cn("py-3 px-4 text-center", statusStyles[oxygenStatus])}>
                      {patient.vitals.oxygen}%
                    </td>
                    <td className={cn("py-3 px-4 text-center", statusStyles[tempStatus])}>
                      {patient.vitals.temperature}°C
                    </td>
                    <td className={cn("py-3 px-4 text-center", statusStyles[heartStatus])}>
                      {patient.vitals.heartRate} bpm
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        patientStatusConfig[patient.status].className
                      )}>
                        {patientStatusConfig[patient.status].label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Monitoring;
