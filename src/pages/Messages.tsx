import { useState } from 'react';
import { Search, MessageSquare } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import MessageCard from '@/components/messages/MessageCard';
import ChatWindow from '@/components/messages/ChatWindow';
import { Input } from '@/components/ui/input';
import { mockMessages, mockPatients } from '@/data/mockData';
import { Message } from '@/types/medical';
import { cn } from '@/lib/utils';

const Messages = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [messages, setMessages] = useState(mockMessages);
  const [searchTerm, setSearchTerm] = useState('');

  // Group messages by patient
  const patientConversations = mockPatients.map(patient => {
    const patientMessages = messages.filter(m => m.patientId === patient.id);
    const latestMessage = patientMessages.sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    )[0];
    const unreadCount = patientMessages.filter(m => !m.read && m.isFromPatient).length;
    
    return {
      patient,
      latestMessage,
      unreadCount
    };
  }).filter(conv => conv.latestMessage);

  const filteredConversations = patientConversations.filter(conv =>
    conv.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPatient = mockPatients.find(p => p.id === selectedPatientId);
  const selectedMessages = messages.filter(m => m.patientId === selectedPatientId);

  const handleSendMessage = (content: string) => {
    if (!selectedPatientId || !selectedPatient) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      patientId: selectedPatientId,
      patientName: selectedPatient.name,
      content,
      timestamp: new Date(),
      isFromPatient: false,
      read: true
    };
    
    setMessages([...messages, newMessage]);
  };

  const handleSelectConversation = (patientId: string) => {
    setSelectedPatientId(patientId);
    // Mark messages as read
    setMessages(messages.map(m => 
      m.patientId === patientId ? { ...m, read: true } : m
    ));
  };

  return (
    <MainLayout>
      <Header 
        title="Mensajes" 
        subtitle="Comunicación con pacientes" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-card rounded-xl border border-border/50 flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredConversations.map((conv) => (
              <div
                key={conv.patient.id}
                onClick={() => handleSelectConversation(conv.patient.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                  selectedPatientId === conv.patient.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-secondary"
                )}
              >
                <div className="relative">
                  <img
                    src={conv.patient.avatar}
                    alt={conv.patient.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">
                    {conv.patient.name}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.latestMessage?.content}
                  </p>
                </div>
              </div>
            ))}

            {filteredConversations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay conversaciones</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border/50 overflow-hidden">
          {selectedPatientId && selectedPatient ? (
            <ChatWindow
              messages={selectedMessages.sort((a, b) => 
                a.timestamp.getTime() - b.timestamp.getTime()
              )}
              patientName={selectedPatient.name}
              patientId={selectedPatientId}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <p className="font-medium">Selecciona una conversación</p>
              <p className="text-sm">Elige un paciente para ver los mensajes</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Messages;
