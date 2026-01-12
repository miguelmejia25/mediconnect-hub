import { Users, Activity, AlertTriangle, MessageSquare, TrendingUp, Heart, Thermometer, Wind } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import StatsCard from '@/components/dashboard/StatsCard';
import PatientCard from '@/components/dashboard/PatientCard';
import MessageCard from '@/components/messages/MessageCard';
import { mockPatients, mockMessages } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const criticalPatients = mockPatients.filter(p => p.status === 'critical');
  const observationPatients = mockPatients.filter(p => p.status === 'observation');
  const unreadMessages = mockMessages.filter(m => !m.read);

  return (
    <MainLayout>
      <Header 
        title="Dashboard" 
        subtitle="Bienvenido de vuelta, Dra. Cassanello" 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Pacientes"
          value={mockPatients.length}
          change="+2 esta semana"
          changeType="positive"
          icon={Users}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatsCard
          title="En Observación"
          value={observationPatients.length}
          change="Requieren seguimiento"
          changeType="neutral"
          icon={Activity}
          iconColor="text-warning"
          iconBg="bg-warning/10"
        />
        <StatsCard
          title="Estado Crítico"
          value={criticalPatients.length}
          change="Atención prioritaria"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="text-destructive"
          iconBg="bg-destructive/10"
        />
        <StatsCard
          title="Mensajes Nuevos"
          value={unreadMessages.length}
          change="Sin leer"
          changeType="neutral"
          icon={MessageSquare}
          iconColor="text-accent"
          iconBg="bg-accent/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patients List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Pacientes Recientes
            </h2>
            <button 
              onClick={() => navigate('/patients')}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Ver todos →
            </button>
          </div>
          
          <div className="grid gap-4">
            {mockPatients.slice(0, 4).map((patient, index) => (
              <div key={patient.id} style={{ animationDelay: `${index * 100}ms` }}>
                <PatientCard patient={patient} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Mensajes Recientes
            </h2>
            <button 
              onClick={() => navigate('/messages')}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Ver todos →
            </button>
          </div>

          <div className="space-y-3">
            {mockMessages.slice(0, 4).map((message, index) => (
              <div key={message.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-up">
                <MessageCard 
                  message={message} 
                  onClick={() => navigate('/messages')}
                />
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 p-5 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Resumen de Signos Vitales
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-vital-oxygen" />
                  <span className="text-sm text-muted-foreground">Oxígeno promedio</span>
                </div>
                <span className="font-semibold text-foreground">95.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-vital-temperature" />
                  <span className="text-sm text-muted-foreground">Temperatura prom.</span>
                </div>
                <span className="font-semibold text-foreground">37.0°C</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-vital-heartrate" />
                  <span className="text-sm text-muted-foreground">Ritmo cardíaco prom.</span>
                </div>
                <span className="font-semibold text-foreground">82 bpm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
