
import React, { useState } from 'react';
import { useApp } from '../App';
import * as MockService from '../services/mockSupabase';
import { useNavigate } from 'react-router-dom';
import { LogOut, Crown, CheckCircle, ChevronRight, Settings, Edit3, X, ShieldCheck, AlertCircle, Mail, MessageCircle } from 'lucide-react';
import { MacroData } from '../types';

export default function ProfilePage() {
  const { user, logout, refreshUser } = useApp();
  const navigate = useNavigate();
  const config = MockService.getAppConfig();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isRefundModalOpen, setRefundModalOpen] = useState(false);

  // Edit Goals State
  const [editGoals, setEditGoals] = useState({
      steps: user?.dailyStepsGoal || 6000,
      calories: user?.customMacros?.calories || 2500,
      protein: user?.customMacros?.protein || 160,
      carbs: user?.customMacros?.carbs || 280,
      fats: user?.customMacros?.fats || 80
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleUpgrade = async () => {
      const success = await MockService.simulatePayment();
      if(success) {
          alert("Pagamento Aprovado! Bem-vindo ao Premium.");
          refreshUser();
      } else {
          alert("Pagamento Falhou. Tente novamente.");
      }
  };

  const handleSaveGoals = () => {
      const newMacros: MacroData = {
          calories: editGoals.calories,
          protein: editGoals.protein,
          carbs: editGoals.carbs,
          fats: editGoals.fats,
          fiber: user?.customMacros?.fiber || 30 // Keep existing or default
      };
      
      MockService.updateUserProfile({
          dailyStepsGoal: editGoals.steps,
          customMacros: newMacros
      });
      
      refreshUser();
      setEditModalOpen(false);
  };

  if (!user) return null;

  return (
    <div className="pb-32 p-6 max-w-md mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white text-gray-900">Perfil</h1>
        <div className="flex gap-2">
            <button onClick={handleLogout} className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-full dark:text-zinc-400 text-gray-600 hover:text-red-500 transition-colors">
                <LogOut size={20} />
            </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-purple-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {user.name.charAt(0)}
        </div>
        <div>
            <h2 className="text-xl font-bold dark:text-white text-gray-900">{user.name}</h2>
            <p className="text-zinc-500 text-sm">{user.email}</p>
            <div className="inline-flex items-center gap-1 mt-2 bg-gray-200 dark:bg-zinc-900 px-2 py-0.5 rounded text-xs dark:text-zinc-400 text-zinc-600 font-mono">
                ID: {user.userCode}
            </div>
        </div>
      </div>

      {/* Subscription Card */}
      {!user.isPremium && user.email !== 'joao.fructuoso2021@gmail.com' && (
          <div className="bg-gradient-to-r from-red-600 to-purple-600 p-6 rounded-3xl mb-8 relative overflow-hidden shadow-xl animate-slide-up">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-lg mb-1 text-white">Seja Premium</h3>
                        <p className="text-red-100 text-xs">Desbloqueie treinos, IA ilimitada e mais.</p>
                    </div>
                    <Crown className="text-yellow-300 fill-yellow-300" />
                </div>
                
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm mb-4 text-white">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Mensal</span>
                        <span className="font-bold text-lg">R$ {config.monthlyPrice.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between items-center opacity-70">
                        <span className="font-medium">Anual</span>
                        <span className="font-medium text-sm">R$ {config.annualPrice.toFixed(2)}</span>
                    </div>
                </div>

                <button onClick={handleUpgrade} className="w-full bg-white text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors shadow-lg">
                    Assinar Agora
                </button>
              </div>
          </div>
      )}

      {/* Stats & Goals */}
      <div className="space-y-4 animate-slide-up">
          <div className="bg-white dark:bg-[#18181b] rounded-2xl p-4 shadow-sm dark:shadow-none">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">Minhas Metas</h3>
                  <button onClick={() => setEditModalOpen(true)} className="text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1 hover:underline">
                      <Edit3 size={12} /> Editar
                  </button>
              </div>
              
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-4 mb-4">
                  <span className="dark:text-zinc-300 text-gray-700">Peso Atual</span>
                  <span className="font-bold text-red-600 dark:text-red-400">{user.weight} kg</span>
              </div>
               <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-4 mb-4">
                  <span className="dark:text-zinc-300 text-gray-700">Meta Diária (Cal)</span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                      {user.customMacros ? user.customMacros.calories : 'Calculado'}
                  </span>
              </div>
               <div className="flex justify-between items-center">
                  <span className="dark:text-zinc-300 text-gray-700">Meta de Passos</span>
                  <span className="font-bold text-red-600 dark:text-red-400">{user.dailyStepsGoal}</span>
              </div>
          </div>
          
           <div className="bg-white dark:bg-[#18181b] rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
              <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-left">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg"><Settings size={18} className="text-gray-600 dark:text-zinc-400" /></div>
                      <span className="dark:text-white text-gray-900">Preferências do App</span>
                  </div>
                  <ChevronRight size={18} className="text-zinc-400" />
              </button>
               <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-left border-t border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg"><CheckCircle size={18} className="text-gray-600 dark:text-zinc-400" /></div>
                      <span className="dark:text-white text-gray-900">Contas Conectadas</span>
                  </div>
                  <ChevronRight size={18} className="text-zinc-400" />
              </button>
               {/* Policies Button */}
               <button 
                  onClick={() => navigate('/policies')}
                  className="w-full p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-left border-t border-gray-100 dark:border-zinc-800"
               >
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg"><ShieldCheck size={18} className="text-gray-600 dark:text-zinc-400" /></div>
                      <span className="dark:text-white text-gray-900">Políticas e Termos</span>
                  </div>
                  <ChevronRight size={18} className="text-zinc-400" />
              </button>
               {/* Refund Button */}
               <button 
                  onClick={() => setRefundModalOpen(true)}
                  className="w-full p-4 flex justify-between items-center hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left border-t border-gray-100 dark:border-zinc-800"
               >
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg"><AlertCircle size={18} className="text-red-600 dark:text-red-400" /></div>
                      <span className="text-red-600 dark:text-red-400 font-bold">Solicitar Reembolso</span>
                  </div>
                  <ChevronRight size={18} className="text-red-400 dark:text-red-500/50" />
              </button>
           </div>
      </div>

      {/* Edit Goals Modal */}
      {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-white dark:bg-[#18181b] w-full max-w-sm rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold dark:text-white text-gray-900">Editar Metas</h3>
                      <button onClick={() => setEditModalOpen(false)} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full"><X size={20} className="dark:text-white" /></button>
                  </div>

                  <div className="space-y-4">
                      <div>
                          <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block">Passos Diários</label>
                          <input 
                            type="number" 
                            className="w-full bg-gray-100 dark:bg-zinc-900 p-3 rounded-xl dark:text-white font-bold outline-none border border-transparent focus:border-red-500"
                            value={editGoals.steps}
                            onChange={(e) => setEditGoals({...editGoals, steps: Number(e.target.value)})}
                          />
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 mt-4">
                          <p className="text-sm dark:text-zinc-400 mb-4">Macros Personalizados</p>
                          <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-zinc-500 mb-1 block">Calorias</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-gray-100 dark:bg-zinc-900 p-3 rounded-xl dark:text-white font-bold outline-none"
                                        value={editGoals.calories}
                                        onChange={(e) => setEditGoals({...editGoals, calories: Number(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 mb-1 block">Proteína (g)</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-gray-100 dark:bg-zinc-900 p-3 rounded-xl dark:text-white font-bold outline-none"
                                        value={editGoals.protein}
                                        onChange={(e) => setEditGoals({...editGoals, protein: Number(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 mb-1 block">Carboidratos (g)</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-gray-100 dark:bg-zinc-900 p-3 rounded-xl dark:text-white font-bold outline-none"
                                        value={editGoals.carbs}
                                        onChange={(e) => setEditGoals({...editGoals, carbs: Number(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 mb-1 block">Gorduras (g)</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-gray-100 dark:bg-zinc-900 p-3 rounded-xl dark:text-white font-bold outline-none"
                                        value={editGoals.fats}
                                        onChange={(e) => setEditGoals({...editGoals, fats: Number(e.target.value)})}
                                    />
                                </div>
                          </div>
                      </div>
                  </div>

                  <button 
                    onClick={handleSaveGoals}
                    className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl mt-8 shadow-lg hover:bg-red-700 transition-colors"
                  >
                      Salvar Alterações
                  </button>
              </div>
          </div>
      )}

      {/* Refund Modal */}
      {isRefundModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-white dark:bg-[#18181b] w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
                  <button 
                    onClick={() => setRefundModalOpen(false)} 
                    className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-zinc-800 rounded-full"
                  >
                    <X size={20} className="dark:text-white" />
                  </button>

                  <div className="flex flex-col items-center text-center mb-6 pt-2">
                      <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
                          <AlertCircle size={32} className="text-red-500" />
                      </div>
                      <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">Solicitar Reembolso</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          Para prosseguir com sua solicitação, entre em contato através de um dos canais abaixo:
                      </p>
                  </div>

                  <div className="space-y-3">
                      <a href="mailto:sac.caloriz@outlook.com" className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                          <div className="bg-white dark:bg-zinc-800 p-2 rounded-xl shadow-sm">
                              <Mail className="text-red-600" size={20} />
                          </div>
                          <div className="text-left">
                              <p className="text-xs text-zinc-500 font-bold uppercase">E-mail</p>
                              <p className="text-sm font-medium dark:text-white text-gray-900">sac.caloriz@outlook.com</p>
                          </div>
                      </a>

                      <a href="https://wa.me/5511950347959" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                          <div className="bg-white dark:bg-zinc-800 p-2 rounded-xl shadow-sm">
                              <MessageCircle className="text-green-600" size={20} />
                          </div>
                          <div className="text-left">
                              <p className="text-xs text-zinc-500 font-bold uppercase">WhatsApp</p>
                              <p className="text-sm font-medium dark:text-white text-gray-900">(11) 95034-7959</p>
                          </div>
                      </a>
                  </div>
                  
                  <div className="mt-6 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl text-center">
                      <p className="text-xs text-zinc-400">
                          Horário de atendimento: Seg a Sex, 09h às 18h.
                      </p>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
