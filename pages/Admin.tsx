
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import * as MockService from '../services/mockSupabase';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, Activity, Palette, Search, Bell, Send, Clock, X, FileText, ChevronRight, CheckCircle } from 'lucide-react';
import { UserProfile, AppNotification, UserLog } from '../types';

export default function AdminPage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const config = MockService.getAppConfig();
  
  const [tab, setTab] = useState<'dashboard' | 'users' | 'settings' | 'notifications'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Notification Form State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifTime, setNotifTime] = useState('');
  const [notificationsList, setNotificationsList] = useState<AppNotification[]>([]);

  // User Logs / Detail Modal State
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);

  useEffect(() => {
      setNotificationsList(MockService.getNotifications());
  }, []);

  useEffect(() => {
      if (selectedUser) {
          setUserLogs(MockService.getUserLogs(selectedUser.id));
      }
  }, [selectedUser]);
  
  // Security Check (Redundant due to ProtectedRoute but good practice)
  if (user?.email !== 'joao.fructuoso2021@gmail.com') {
    return <div className="p-10 text-center">Acesso Negado</div>;
  }

  // Mock Stats
  const stats = {
      activeUsers: 1240,
      trialUsers: 450,
      subscribers: 790,
      revenue: 15420.00
  };

  // Mock Users List for demo (Normally fetched from DB)
  // In a real scenario, use useEffect to fetch list
  const [usersList, setUsersList] = useState<UserProfile[]>([
      user,
      {...user, id: '2', name: 'Maria Silva', email: 'maria@test.com', userCode: 'CZ99281', isPremium: false, isBanned: false, createdAt: Date.now() - 864000000, dailyStepsGoal: 6000, acceptedTermsAt: Date.now() - 864000000},
      {...user, id: '3', name: 'Carlos Teste', email: 'carlos@test.com', userCode: 'CZ11223', isPremium: true, isBanned: false, createdAt: Date.now(), dailyStepsGoal: 8000, acceptedTermsAt: Date.now()},
      {...user, id: '4', name: 'Usuário Banido', email: 'bad@user.com', userCode: 'CZ66666', isPremium: false, isBanned: true, createdAt: Date.now(), dailyStepsGoal: 5000, acceptedTermsAt: Date.now()},
  ]);

  const toggleBan = (id: string, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent opening modal
      setUsersList(usersList.map(u => u.id === id ? {...u, isBanned: !u.isBanned} : u));
  };

  const handleSendNotification = (e: React.FormEvent) => {
      e.preventDefault();
      if(!notifTitle || !notifMessage || !notifTime) return;

      const newNotif: AppNotification = {
          id: crypto.randomUUID(),
          title: notifTitle,
          message: notifMessage,
          scheduledFor: notifTime,
          createdAt: Date.now()
      };

      const updatedList = MockService.addNotification(newNotif);
      setNotificationsList(updatedList);
      
      // Reset Form
      setNotifTitle('');
      setNotifMessage('');
      setNotifTime('');
      alert('Notificação agendada com sucesso!');
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.userCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group logs by date
  const groupedLogs = userLogs.reduce((groups, log) => {
      const date = new Date(log.timestamp).toLocaleDateString();
      if (!groups[date]) {
          groups[date] = [];
      }
      groups[date].push(log);
      return groups;
  }, {} as Record<string, UserLog[]>);

  return (
    <div className="pb-32 p-6 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold mb-2 dark:text-white text-gray-900">Painel Admin</h1>
        <p className="text-zinc-500 mb-8">Bem-vindo, João.</p>

        {/* Admin Nav */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-zinc-800 pb-1 overflow-x-auto">
            <button onClick={() => setTab('dashboard')} className={`pb-3 font-medium transition-colors whitespace-nowrap ${tab === 'dashboard' ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400' : 'text-zinc-500'}`}>Dashboard</button>
            <button onClick={() => setTab('users')} className={`pb-3 font-medium transition-colors whitespace-nowrap ${tab === 'users' ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400' : 'text-zinc-500'}`}>Membros</button>
            <button onClick={() => setTab('notifications')} className={`pb-3 font-medium transition-colors whitespace-nowrap ${tab === 'notifications' ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400' : 'text-zinc-500'}`}>Notificações</button>
            <button onClick={() => setTab('settings')} className={`pb-3 font-medium transition-colors whitespace-nowrap ${tab === 'settings' ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400' : 'text-zinc-500'}`}>Plataforma</button>
        </div>

        {tab === 'dashboard' && (
            <div className="grid grid-cols-2 gap-4 animate-slide-up">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-3 mb-2 text-zinc-500">
                        <Users size={18} /> Usuários Totais
                    </div>
                    <p className="text-3xl font-bold dark:text-white text-gray-900">{stats.activeUsers}</p>
                    <div className="mt-2 text-xs text-green-500">+12% essa semana</div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-3 mb-2 text-zinc-500">
                        <Activity size={18} /> Em Trial
                    </div>
                    <p className="text-3xl font-bold dark:text-white text-gray-900">{stats.trialUsers}</p>
                </div>
                <div className="bg-red-600 dark:bg-red-900/30 p-6 rounded-3xl border border-transparent dark:border-red-500/20 col-span-2 shadow-lg dark:shadow-none">
                    <div className="flex items-center gap-3 mb-2 text-red-100 dark:text-red-300">
                        <DollarSign size={18} /> Faturamento Total
                    </div>
                    <p className="text-4xl font-bold text-white">R$ {stats.revenue.toLocaleString()}</p>
                </div>
            </div>
        )}

        {tab === 'users' && (
            <div className="animate-slide-up">
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-3.5 text-zinc-500" size={20} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nome, email ou código (CZ...)" 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 rounded-xl py-3 pl-12 pr-4 dark:text-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-500 border border-gray-200 dark:border-transparent"
                    />
                </div>
                
                <div className="space-y-3">
                    {filteredUsers.map(u => (
                        <div 
                            key={u.id} 
                            onClick={() => setSelectedUser(u)}
                            className="bg-white dark:bg-zinc-900 p-4 rounded-xl flex items-center justify-between shadow-sm dark:shadow-none border border-gray-100 dark:border-transparent cursor-pointer hover:border-red-500 dark:hover:border-red-500 transition-colors"
                        >
                            <div>
                                <p className="font-bold dark:text-white text-gray-900">{u.name} {u.email === user.email && '(Você)'}</p>
                                <p className="text-xs text-zinc-500">{u.email} • <span className="font-mono text-red-500">{u.userCode}</span></p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-2 py-1 rounded font-bold ${u.isPremium ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-zinc-800 text-zinc-500'}`}>
                                    {u.isPremium ? 'Premium' : 'Grátis'}
                                </span>
                                {u.id !== user.id && (
                                    <button 
                                        onClick={(e) => toggleBan(u.id, e)} 
                                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${u.isBanned ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}
                                    >
                                        {u.isBanned ? 'Desbanir' : 'Banir'}
                                    </button>
                                )}
                                <ChevronRight size={18} className="text-zinc-400" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {tab === 'notifications' && (
            <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
                {/* Send Form */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm dark:shadow-none h-fit">
                    <h3 className="font-bold mb-4 flex items-center gap-2 dark:text-white text-gray-900">
                        <Send size={18} className="text-red-600" /> Nova Notificação
                    </h3>
                    
                    <form onSubmit={handleSendNotification} className="space-y-4">
                        <div>
                            <label className="block text-xs text-zinc-500 mb-1">Título</label>
                            <input 
                                type="text" 
                                required
                                value={notifTitle}
                                onChange={e => setNotifTitle(e.target.value)}
                                placeholder="Ex: Novidade no App!"
                                className="w-full bg-gray-50 dark:bg-zinc-950 p-3 rounded-xl border border-gray-200 dark:border-zinc-800 dark:text-white focus:outline-none focus:border-red-500" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-zinc-500 mb-1">Mensagem</label>
                            <textarea 
                                required
                                value={notifMessage}
                                onChange={e => setNotifMessage(e.target.value)}
                                placeholder="Digite o conteúdo da notificação..."
                                className="w-full bg-gray-50 dark:bg-zinc-950 p-3 rounded-xl border border-gray-200 dark:border-zinc-800 dark:text-white h-24 focus:outline-none focus:border-red-500 resize-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-zinc-500 mb-1">Agendar para</label>
                            <input 
                                type="datetime-local" 
                                required
                                value={notifTime}
                                onChange={e => setNotifTime(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-zinc-950 p-3 rounded-xl border border-gray-200 dark:border-zinc-800 dark:text-white focus:outline-none focus:border-red-500" 
                            />
                        </div>
                        
                        <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                            <Clock size={18} /> Agendar Envio
                        </button>
                    </form>
                </div>

                {/* History List */}
                <div className="space-y-4">
                    <h3 className="font-bold mb-2 flex items-center gap-2 dark:text-white text-gray-900 px-2">
                        <Bell size={18} /> Histórico / Agendados
                    </h3>
                    
                    {notificationsList.length === 0 ? (
                        <div className="text-center py-10 text-zinc-400 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800">
                            Nenhuma notificação encontrada.
                        </div>
                    ) : (
                        notificationsList.map(notif => (
                            <div key={notif.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border-l-4 border-red-500 shadow-sm dark:shadow-none">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold dark:text-white text-gray-900">{notif.title}</h4>
                                    <span className="text-[10px] bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-full text-zinc-500">
                                        {new Date(notif.scheduledFor).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{notif.message}</p>
                                <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium">
                                    <Clock size={12} />
                                    {new Date(notif.scheduledFor).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {tab === 'settings' && (
            <div className="space-y-6 animate-slide-up">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm dark:shadow-none">
                    <h3 className="font-bold mb-4 flex items-center gap-2 dark:text-white text-gray-900"><Palette size={18} /> Tema Sazonal</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {['NONE', 'XMAS', 'HALLOWEEN'].map(t => (
                            <button 
                                key={t}
                                className={`py-3 rounded-xl text-sm font-bold border transition-colors ${config.seasonalTheme === t ? 'bg-red-600 border-red-600 text-white' : 'border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-zinc-500'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm dark:shadow-none">
                    <h3 className="font-bold mb-4 flex items-center gap-2 dark:text-white text-gray-900"><DollarSign size={18} /> Configuração de Preço</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-zinc-500 mb-1">Plano Mensal (R$)</label>
                            <input type="number" className="w-full bg-gray-50 dark:bg-zinc-950 p-3 rounded-xl border border-gray-200 dark:border-zinc-800 dark:text-white" defaultValue={config.monthlyPrice} />
                        </div>
                         <div>
                            <label className="block text-xs text-zinc-500 mb-1">Plano Anual (R$)</label>
                            <input type="number" className="w-full bg-gray-50 dark:bg-zinc-950 p-3 rounded-xl border border-gray-200 dark:border-zinc-800 dark:text-white" defaultValue={config.annualPrice} />
                        </div>
                        <button className="w-full bg-red-600 dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl mt-2">Salvar Alterações</button>
                    </div>
                </div>
            </div>
        )}

        {/* User Details Modal with History */}
        {selectedUser && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-white dark:bg-[#18181b] w-full max-w-lg rounded-3xl p-0 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
                    <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-start bg-gray-50 dark:bg-zinc-900/50">
                        <div>
                            <h2 className="text-xl font-bold dark:text-white text-gray-900">{selectedUser.name}</h2>
                            <p className="text-sm text-zinc-500 mb-1">{selectedUser.email}</p>
                            <div className="flex gap-2">
                                <span className="text-xs font-mono bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded">
                                    {selectedUser.userCode}
                                </span>
                                {selectedUser.acceptedTermsAt && (
                                    <span className="text-xs flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                                        <CheckCircle size={10} /> Aceitou Termos: {new Date(selectedUser.acceptedTermsAt).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button onClick={() => setSelectedUser(null)} className="p-2 bg-gray-200 dark:bg-zinc-800 rounded-full dark:text-white"><X size={20} /></button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto flex-1">
                        <h3 className="font-bold text-sm uppercase text-zinc-500 mb-4 flex items-center gap-2">
                            <FileText size={16} /> Histórico de Atividades
                        </h3>
                        
                        <div className="space-y-6">
                            {Object.keys(groupedLogs).length === 0 ? (
                                <p className="text-center text-zinc-500 italic py-4">Nenhuma atividade registrada.</p>
                            ) : (
                                Object.keys(groupedLogs).map((date) => (
                                    <div key={date}>
                                        <div className="sticky top-0 bg-white dark:bg-[#18181b] z-10 py-2 border-b border-gray-100 dark:border-zinc-800 mb-3">
                                            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">{date}</span>
                                        </div>
                                        <div className="relative pl-4 border-l-2 border-gray-100 dark:border-zinc-800 space-y-6">
                                            {groupedLogs[date].map(log => (
                                                <div key={log.id} className="relative">
                                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-red-500 ring-4 ring-white dark:ring-[#18181b]" />
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-sm font-bold dark:text-zinc-200 text-gray-800">
                                                                {log.action === 'LOGIN' && 'Fez Login'}
                                                                {log.action === 'LOGOUT' && 'Saiu do App'}
                                                                {log.action === 'REGISTER' && 'Criou a Conta'}
                                                                {log.action === 'VIEW' && 'Visualizou'}
                                                                {log.action === 'ACTION' && 'Ação'}
                                                            </p>
                                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{log.details}</p>
                                                        </div>
                                                        <span className="text-[10px] text-zinc-400 font-mono">
                                                            {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
