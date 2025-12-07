
import React, { useState } from 'react';
import { useApp } from '../App';
import * as MockService from '../services/mockSupabase';
import { FileText, Upload, Trash2, CheckCircle, ExternalLink } from 'lucide-react';

export default function MealPlanPage() {
  const { user, refreshUser } = useApp();
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Por favor, envie apenas arquivos PDF.');
        return;
      }

      setLoading(true);
      // Simulate upload delay and getting a URL
      setTimeout(() => {
        // In a real app, we would upload to Supabase Storage here.
        // For mock, we'll just save a fake URL or base64 if small (but keeping it simple with a placeholder string)
        // const fakeUrl = URL.createObjectURL(file); // Only works for current session
        
        // Mocking persistence
        MockService.updateUserProfile({ mealPlanUrl: 'uploaded' });
        refreshUser();
        setLoading(false);
        alert('Plano alimentar enviado com sucesso!');
      }, 1500);
    }
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja remover este plano?')) {
      MockService.updateUserProfile({ mealPlanUrl: undefined });
      refreshUser();
    }
  };

  return (
    <div className="pb-32 p-6 max-w-md mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-2 dark:text-white text-gray-900">Plano Alimentar</h1>
      <p className="text-zinc-500 mb-8">Gerencie sua dieta prescrita pelo nutricionista.</p>

      {user?.mealPlanUrl ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl dark:shadow-none animate-slide-up border border-gray-100 dark:border-zinc-800">
          <div className="flex flex-col items-center py-6">
            <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-full mb-4">
              <FileText size={48} className="text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-1">Seu Plano Atual</h2>
            <p className="text-zinc-500 text-sm mb-6">PDF • Enviado recentemente</p>
            
            <div className="flex gap-3 w-full">
              <button 
                className="flex-1 bg-red-600 dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                onClick={() => alert("Em um app real, isso abriria o visualizador de PDF.")}
              >
                <ExternalLink size={18} /> Visualizar
              </button>
              <button 
                onClick={handleDelete}
                className="bg-red-50 dark:bg-red-900/20 text-red-500 p-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-slide-up">
           <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-zinc-900/50">
              <div className="bg-gray-200 dark:bg-zinc-800 p-4 rounded-full mb-4">
                <Upload size={32} className="text-gray-500 dark:text-zinc-400" />
              </div>
              <h3 className="font-bold text-lg dark:text-white text-gray-900 mb-2">Envie seu Plano</h3>
              <p className="text-zinc-500 text-sm mb-6 max-w-[200px]">
                Faça upload do PDF recebido do seu nutricionista para ter acesso rápido.
              </p>

              <label className="relative cursor-pointer bg-red-600 dark:bg-white text-white dark:text-black font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                 {loading ? 'Enviando...' : 'Selecionar Arquivo PDF'}
                 <input 
                   type="file" 
                   accept="application/pdf" 
                   className="hidden" 
                   onChange={handleFileUpload}
                   disabled={loading}
                 />
              </label>
           </div>
        </div>
      )}

      {/* Info Card */}
      <div className="mt-8 bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl flex items-start gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CheckCircle className="text-red-600 dark:text-red-400 shrink-0 mt-1" size={24} />
          <div>
            <h4 className="font-bold text-red-900 dark:text-red-200 mb-1">Dica de Sucesso</h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              Mantenha seu plano atualizado. Seus treinos e metas diárias funcionam melhor quando alinhados com sua dieta.
            </p>
          </div>
      </div>
    </div>
  );
}
