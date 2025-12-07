
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import * as MockService from '../services/mockSupabase';
import { GoalType, ActivityLevel } from '../types';
import { ChevronRight } from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useApp();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    weight: 70,
    height: 170,
    age: 25,
    sex: 'M' as 'M' | 'F',
    goal: GoalType.MAINTAIN,
    activityLevel: ActivityLevel.MODERATE
  });

  const nextStep = async () => {
    if (step < 3) {
      setStep(s => s + 1);
    } else {
      // Finish
      MockService.updateUserProfile(formData);
      refreshUser();
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-white p-6 flex flex-col transition-colors duration-300">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full animate-fade-in">
        {/* Progress */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-red-600 dark:bg-red-500' : 'bg-gray-200 dark:bg-zinc-800'}`} />
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-2">
          {step === 1 && "Vamos conhecer você"}
          {step === 2 && "Qual é seu objetivo?"}
          {step === 3 && "Quão ativo você é?"}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          {step === 1 && "Isso nos ajuda a calcular suas necessidades calóricas."}
          {step === 2 && "Vamos ajustar seu plano nutricional de acordo."}
          {step === 3 && "Seja honesto, não julgaremos!"}
        </p>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <label className="block text-sm text-zinc-500 dark:text-zinc-400 mb-2">Gênero</label>
              <div className="flex gap-4">
                {(['M', 'F'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setFormData({...formData, sex: g})}
                    className={`flex-1 py-4 rounded-2xl font-medium transition-all ${
                      formData.sex === g ? 'bg-red-600 text-white shadow-lg' : 'bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-gray-200 dark:border-transparent'
                    }`}
                  >
                    {g === 'M' ? 'Masculino' : 'Feminino'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-500 dark:text-zinc-400 mb-2">Peso (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={e => setFormData({...formData, weight: Number(e.target.value)})}
                  className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 text-center text-xl font-bold focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-500 dark:text-zinc-400 mb-2">Altura (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={e => setFormData({...formData, height: Number(e.target.value)})}
                  className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 text-center text-xl font-bold focus:border-red-500 outline-none"
                />
              </div>
            </div>
            
            <div>
                <label className="block text-sm text-zinc-500 dark:text-zinc-400 mb-2">Idade</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: Number(e.target.value)})}
                  className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 text-center text-xl font-bold focus:border-red-500 outline-none"
                />
              </div>
          </div>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <div className="space-y-4 animate-slide-up">
            {Object.values(GoalType).map(goal => (
              <button
                key={goal}
                onClick={() => setFormData({...formData, goal})}
                className={`w-full p-6 rounded-2xl text-left border transition-all ${
                  formData.goal === goal 
                  ? 'bg-red-50/50 dark:bg-red-500/10 border-red-500 text-red-600 dark:text-red-400 shadow-md' 
                  : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <div className="font-bold text-lg mb-1 capitalize">
                    {goal === GoalType.LOSE && "Emagrecer"}
                    {goal === GoalType.MAINTAIN && "Manter Peso"}
                    {goal === GoalType.GAIN && "Ganhar Massa"}
                </div>
                <div className="text-sm opacity-70">
                    {goal === GoalType.LOSE && "Foco em déficit calórico."}
                    {goal === GoalType.MAINTAIN && "Nutrição balanceada."}
                    {goal === GoalType.GAIN && "Alta proteína e superávit."}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Activity */}
        {step === 3 && (
          <div className="space-y-4 animate-slide-up">
            {Object.values(ActivityLevel).map(level => (
              <button
                key={level}
                onClick={() => setFormData({...formData, activityLevel: level})}
                className={`w-full p-6 rounded-2xl text-left border transition-all ${
                  formData.activityLevel === level 
                  ? 'bg-red-50/50 dark:bg-red-500/10 border-red-500 text-red-600 dark:text-red-400 shadow-md' 
                  : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <div className="font-bold text-lg mb-1 capitalize">
                    {level === ActivityLevel.SEDENTARY && "Sedentário"}
                    {level === ActivityLevel.MODERATE && "Moderado"}
                    {level === ActivityLevel.ACTIVE && "Muito Ativo"}
                </div>
                <div className="text-sm opacity-70">
                    {level === ActivityLevel.SEDENTARY && "Trabalho de escritório, pouco exercício."}
                    {level === ActivityLevel.MODERATE && "Exercício leve 1-3 vezes/semana."}
                    {level === ActivityLevel.ACTIVE && "Exercício intenso 4+ vezes/semana."}
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={nextStep}
          className="w-full bg-red-600 dark:bg-white text-white dark:text-black font-bold rounded-2xl py-4 mt-10 hover:bg-red-700 dark:hover:bg-zinc-200 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          {step === 3 ? 'Finalizar' : 'Continuar'} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
