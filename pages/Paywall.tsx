
import React from 'react';
import { useApp } from '../App';
import * as MockService from '../services/mockSupabase';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Lock, Star } from 'lucide-react';

export default function PaywallPage() {
  const { refreshUser } = useApp();
  const navigate = useNavigate();
  const config = MockService.getAppConfig();

  const handleSubscribe = async () => {
    // Simulate web flow for payment
    const success = await MockService.simulatePayment();
    if(success) {
        refreshUser();
        navigate('/dashboard');
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-[#09090b] flex flex-col items-center p-6 relative overflow-hidden animate-fade-in transition-colors">
      {/* Background FX */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-red-500/10 dark:from-red-900/40 to-transparent pointer-events-none" />
      
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 max-w-sm">
        <div className="w-20 h-20 bg-red-600 dark:bg-red-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/30 rotate-3">
            <Star className="text-white fill-white" size={40} />
        </div>
        
        <h1 className="text-3xl font-bold mb-2 dark:text-white text-gray-900">Seu Teste Acabou</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
            Não perca seu progresso. Continue sua jornada com o Caloriz.AI Premium.
        </p>

        <div className="bg-white dark:bg-zinc-900/80 backdrop-blur w-full rounded-3xl p-6 border border-gray-200 dark:border-zinc-800 mb-8 shadow-xl dark:shadow-none">
            <ul className="space-y-4 text-left">
                <li className="flex items-center gap-3 dark:text-white text-gray-900">
                    <CheckCircle className="text-red-500" size={20} />
                    <span>Scans de IA ilimitados</span>
                </li>
                 <li className="flex items-center gap-3 dark:text-white text-gray-900">
                    <CheckCircle className="text-red-500" size={20} />
                    <span>Acesso a todos os treinos</span>
                </li>
                 <li className="flex items-center gap-3 dark:text-white text-gray-900">
                    <CheckCircle className="text-red-500" size={20} />
                    <span>Análises Avançadas</span>
                </li>
            </ul>
        </div>

        <button 
            onClick={handleSubscribe}
            className="w-full bg-red-600 dark:bg-white text-white dark:text-black font-bold text-lg py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
        >
            Assinar por R$ {config.monthlyPrice.toFixed(2)}/mês
        </button>
        
        <p className="text-zinc-500 text-xs mt-4">
            Cancele quando quiser. Pagamento seguro via PIX.
        </p>
      </div>
    </div>
  );
}
