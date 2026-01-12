import { Wind, Thermometer, Heart, AlertCircle, TrendingUp, Wifi } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import { mockPatients } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { getOxygenStatus, getTemperatureStatus, getHeartRateStatus } from '@/types/medical';
import { useVitalsFirebase } from '@/hooks/usefire';

const Monitoring = () => {
  const { latestVitals, loading } = useVitalsFirebase();
  
  // Crear lista de pacientes con datos en tiempo real para el paciente ESP32
  const patientsWithRealtime = mockPatients.map(patient => {
    if (patient.id === '3' && latestVitals) {
      return {
        ...patient,
        status: getOverallStatus(latestVitals.oxygen, latestVitals.temp, latestVitals.heart),
        vitals: {
          oxygen: latestVitals.oxygen,
          temperature: latestVitals.temp,
          heartRate: latestVitals.heart,
          timestamp: new Date(latestVitals.timestamp)
        }
      };
    }
    return patient;
  });

  const criticalPatients = patientsWithRealtime.filter(p => p.status === 'critical');
  
  // Calculate averages
  const avgOxygen = Math.round(patientsWithRealtime.reduce((sum, p) => sum + p.vitals.oxygen, 0) / patientsWithRealtime.length * 10) / 10;
  const avgTemp = Math.round(patientsWithRealtime.reduce((sum, p) => sum + p.vitals.temperature, 0) / patientsWithRealtime.length * 10) / 10;
  const avgHeart = Math.round(patientsWithRealtime.reduce((sum, p) => sum + p.vitals.heartRate, 0) / patientsWithRealtime.length);

  function getOverallStatus(oxygen: number, temp: number, heart: number): 'stable' | 'observation' | 'critical' {
    const o2Status = getOxygenStatus(oxygen);
    const tempStatus = getTemperatureStatus(temp);
    const hrStatus = getHeartRateStatus(heart);
    
    if (o2Status === 'critical' || tempStatus === 'critical' || hrStatus === 'critical') return 'critical';
    if (o2Status === 'warning' || tempStatus === 'warning' || hrStatus === 'warning') return 'observation';
    return 'stable';
  }

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
              {patientsWithRealtime.map((patient) => {
                const oxygenStatus = getOxygenStatus(patient.vitals.oxygen);
                const tempStatus = getTemperatureStatus(patient.vitals.temperature);
                const heartStatus = getHeartRateStatus(patient.vitals.heartRate);
                const isRealtimePatient = patient.id === '3';

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
                  <tr key={patient.id} className={cn(
                    "border-b border-border/50 hover:bg-secondary/30 transition-colors",
                    isRealtimePatient && "bg-primary/5"
                  )}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={patient.avatar}
                            alt={patient.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {isRealtimePatient && (
                            <div className={cn(
                              "absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center",
                              loading ? "bg-yellow-500" : latestVitals ? "bg-green-500" : "bg-gray-400"
                            )}>
                              <Wifi className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground flex items-center gap-2">
                            {patient.name}
                            {isRealtimePatient && (
                              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                En Vivo
                              </span>
                            )}
                          </p>
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