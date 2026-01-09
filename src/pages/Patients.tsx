import { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import PatientCard from '@/components/dashboard/PatientCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockPatients } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusFilters = [
    { key: null, label: 'Todos', count: mockPatients.length },
    { key: 'stable', label: 'Estable', count: mockPatients.filter(p => p.status === 'stable').length },
    { key: 'observation', label: 'Observación', count: mockPatients.filter(p => p.status === 'observation').length },
    { key: 'critical', label: 'Crítico', count: mockPatients.filter(p => p.status === 'critical').length },
  ];

  return (
    <MainLayout>
      <Header 
        title="Pacientes" 
        subtitle={`${mockPatients.length} pacientes registrados`} 
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o habitación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>
        
        <div className="flex gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => setStatusFilter(filter.key)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                statusFilter === filter.key
                  ? "medical-gradient text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border/50"
              )}
            >
              {filter.label}
              <span className={cn(
                "ml-2 px-1.5 py-0.5 rounded-full text-xs",
                statusFilter === filter.key
                  ? "bg-primary-foreground/20"
                  : "bg-muted"
              )}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        <Button className="medical-gradient text-primary-foreground gap-2 ml-auto">
          <Plus className="w-4 h-4" />
          Nuevo Paciente
        </Button>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatients.map((patient, index) => (
          <div 
            key={patient.id} 
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <PatientCard patient={patient} />
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No se encontraron pacientes</p>
        </div>
      )}
    </MainLayout>
  );
};

export default Patients;
