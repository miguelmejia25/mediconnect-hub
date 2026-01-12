import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wind, Thermometer, Heart, Activity } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { mockPatients } from '@/data/mockData';
import { useVitalsFirebase } from '@/hooks/usefire';
import { cn } from '@/lib/utils';
import { getOxygenStatus, getTemperatureStatus, getHeartRateStatus } from '@/types/medical';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PatientHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { history, loading } = useVitalsFirebase();
  
  const patient = mockPatients.find(p => p.id === id);
  const isRealtimePatient = id === '3';

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

  // Datos para el gráfico
  const chartData = isRealtimePatient 
    ? history.slice(0, 50).reverse().map((vital, index) => ({
        time: format(new Date(vital.timestamp), 'HH:mm:ss'),
        heart: vital.heart,
        oxygen: vital.oxygen,
        temp: vital.temp,
        timestamp: vital.timestamp
      }))
    : generateMockHistory();

  function generateMockHistory() {
    const data = [];
    const now = Date.now();
    for (let i = 49; i >= 0; i--) {
      data.push({
        time: format(new Date(now - i * 60000), 'HH:mm'),
        heart: patient.vitals.heartRate + Math.floor(Math.random() * 10 - 5),
        oxygen: patient.vitals.oxygen + Math.floor(Math.random() * 4 - 2),
        temp: patient.vitals.temperature + (Math.random() * 0.4 - 0.2),
        timestamp: now - i * 60000
      });
    }
    return data;
  }

  return (
    <MainLayout>
      {/* Back button */}
      <button
        onClick={() => navigate(`/patients/${id}`)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al paciente
      </button>

      {/* Header */}
      <div className="vital-card mb-8">
        <div className="flex items-center gap-4">
          <img
            src={patient.avatar}
            alt={patient.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              {patient.name}
              {isRealtimePatient && (
                <span className="text-sm bg-green-500/20 text-green-600 px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  En Vivo
                </span>
              )}
            </h1>
            <p className="text-muted-foreground">Historial de Signos Vitales • Hab. {patient.room}</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 mb-8">
        {/* Ritmo Cardíaco */}
        <div className="vital-card">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-foreground">Ritmo Cardíaco (BPM)</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="heart" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={false}
                  name="BPM"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Oxígeno */}
        <div className="vital-card">
          <div className="flex items-center gap-2 mb-4">
            <Wind className="w-5 h-5 text-blue-500" />
            <h2 className="font-semibold text-foreground">Saturación de Oxígeno (SpO2 %)</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis domain={[85, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="oxygen" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                  name="SpO2"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temperatura */}
        <div className="vital-card">
          <div className="flex items-center gap-2 mb-4">
            <Thermometer className="w-5 h-5 text-orange-500" />
            <h2 className="font-semibold text-foreground">Temperatura Corporal (°C)</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis domain={[35, 40]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  dot={false}
                  name="Temp"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla de Datos */}
      <div className="vital-card">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Historial de Lecturas</h2>
        </div>
        
        <div className="overflow-x-auto max-h-96">
          <table className="w-full">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fecha/Hora</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  <span className="flex items-center justify-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" /> BPM
                  </span>
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  <span className="flex items-center justify-center gap-1">
                    <Wind className="w-4 h-4 text-blue-500" /> SpO2
                  </span>
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  <span className="flex items-center justify-center gap-1">
                    <Thermometer className="w-4 h-4 text-orange-500" /> Temp
                  </span>
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {chartData.slice().reverse().map((reading, index) => {
                const heartStatus = getHeartRateStatus(reading.heart);
                const oxygenStatus = getOxygenStatus(reading.oxygen);
                const tempStatus = getTemperatureStatus(reading.temp);
                
                const overallStatus = 
                  heartStatus === 'critical' || oxygenStatus === 'critical' || tempStatus === 'critical' 
                    ? 'critical' 
                    : heartStatus === 'warning' || oxygenStatus === 'warning' || tempStatus === 'warning'
                      ? 'warning'
                      : 'normal';

                const statusStyles = {
                  normal: 'text-success',
                  warning: 'text-warning',
                  critical: 'text-destructive font-semibold'
                };

                const statusConfig = {
                  normal: { label: 'Normal', className: 'status-normal' },
                  warning: { label: 'Precaución', className: 'status-warning' },
                  critical: { label: 'Crítico', className: 'status-critical' }
                };

                return (
                  <tr key={index} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground">
                      {format(new Date(reading.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: es })}
                    </td>
                    <td className={cn("py-3 px-4 text-center text-sm", statusStyles[heartStatus])}>
                      {reading.heart}
                    </td>
                    <td className={cn("py-3 px-4 text-center text-sm", statusStyles[oxygenStatus])}>
                      {reading.oxygen}%
                    </td>
                    <td className={cn("py-3 px-4 text-center text-sm", statusStyles[tempStatus])}>
                      {typeof reading.temp === 'number' ? reading.temp.toFixed(1) : reading.temp}°C
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        statusConfig[overallStatus].className
                      )}>
                        {statusConfig[overallStatus].label}
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

export default PatientHistory;