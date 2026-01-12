import { Users, Activity, AlertTriangle, MessageSquare, TrendingUp, Heart, Thermometer, Wind } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import StatsCard from '@/components/dashboard/StatsCard';
import PatientCard from '@/components/dashboard/PatientCard';
import MessageCard from '@/components/messages/MessageCard';
import { mockPatients, mockMessages } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

// 1. IMPORTANTE: Importamos tu hook desde el archivo correcto
import { useVitalsFirebase } from '@/hooks/usefire'; 

const Index = () => {
  const navigate = useNavigate();
  
  // 2. Usamos el hook para obtener los datos reales
  const { latestVitals, loading } = useVitalsFirebase();

  // Filtros de datos falsos (para el resto de la UI)
  const criticalPatients = mockPatients.filter(p => p.status === 'critical');
  const observationPatients = mockPatients.filter(p => p.status === 'observation');
  const unreadMessages = mockMessages.filter(m => !m.read);

  return (
    <MainLayout>
      <Header 
        title="Dashboard" 
        subtitle="Bienvenido de vuelta, Dra. Cassanello" 
      />

      {/* Grid de Estadísticas Superiores (Mock Data) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <StatsCard title="Total Pacientes" value={mockPatients.length} change="+2" changeType="positive" icon={Users} iconColor="text-primary" iconBg="bg-primary/10" />
         <StatsCard title="En Observación" value={observationPatients.length} change="Requieren seguimiento" changeType="neutral" icon={Activity} iconColor="text-warning" iconBg="bg-warning/10" />
         <StatsCard title="Estado Crítico" value={criticalPatients.length} change="Atención prioritaria" changeType="negative" icon={AlertTriangle} iconColor="text-destructive" iconBg="bg-destructive/10" />
         <StatsCard title="Mensajes Nuevos" value={unreadMessages.length} change="Sin leer" changeType="neutral" icon={MessageSquare} iconColor="text-accent" iconBg="bg-accent/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Lista de Pacientes */}
        <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-foreground">Pacientes Recientes</h2>
                <button onClick={() => navigate('/patients')} className="text-sm text-primary font-medium hover:underline">Ver todos →</button>
            </div>
             <div className="grid gap-4">
                {mockPatients.slice(0, 4).map((patient) => (
                  <PatientCard key={patient.id} patient={patient} />
                ))}
             </div>
        </div>

        {/* Columna Derecha: Mensajes y Signos Vitales */}
        <div>
          {/* Sección de Mensajes */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">Mensajes Recientes</h2>
            <button onClick={() => navigate('/messages')} className="text-sm text-primary font-medium hover:underline">Ver todos →</button>
          </div>
          
          <div className="space-y-3 mb-8">
            {mockMessages.slice(0, 2).map((message) => (
                <MessageCard 
                    key={message.id} 
                    message={message} 
                    // 3. CORRECCIÓN: Agregamos el onClick que faltaba
                    onClick={() => navigate('/messages')} 
                />
            ))}
          </div>

          {/* --- TARJETA DE SIGNOS VITALES EN VIVO (REAL) --- */}
          <div className="mt-8 p-5 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Signos Vitales (En Vivo) 🔴
            </h3>
            
            {loading ? (
                <div className="flex items-center justify-center py-4 gap-2 text-sm text-muted-foreground">
                    <Activity className="w-4 h-4 animate-spin" />
                    Conectando con sensor...
                </div>
            ) : (
                <div className="space-y-4">
                  {/* Oxígeno */}
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Wind className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Oxígeno (SpO2)</span>
                    </div>
                    <span className={`text-lg font-bold ${latestVitals?.oxygen && latestVitals.oxygen < 95 ? 'text-red-600' : 'text-gray-900'}`}>
                        {latestVitals?.oxygen || '--'}%
                    </span>
                  </div>

                  {/* Temperatura */}
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-orange-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-full">
                        <Thermometer className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Temperatura</span>
                    </div>
                    <span className={`text-lg font-bold ${latestVitals?.temp && latestVitals.temp > 37.5 ? 'text-red-600' : 'text-gray-900'}`}>
                        {latestVitals?.temp || '--'}°C
                    </span>
                  </div>

                  {/* Ritmo Cardíaco */}
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-red-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <Heart className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Ritmo cardíaco</span>
                    </div>
                    <span className={`text-lg font-bold ${latestVitals?.heart && latestVitals.heart > 100 ? 'text-red-600' : 'text-gray-900'}`}>
                        {latestVitals?.heart || '--'} bpm
                    </span>
                  </div>
                  
                  {latestVitals && (
                      <div className="pt-2 border-t border-primary/10 text-xs text-right text-muted-foreground">
                          Actualizado: {new Date(latestVitals.timestamp).toLocaleTimeString()}
                      </div>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;