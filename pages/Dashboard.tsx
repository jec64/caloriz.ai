
import React, { useEffect, useState } from 'react';
import { useApp } from '../App';
import * as MockService from '../services/mockSupabase';
import { Meal, MacroData } from '../types';
import { Flame, Droplets, Wheat, Beef, Plus, Footprints } from '../components/Icons';
import { Link, useNavigate } from 'react-router-dom';

// Circular Progress Component
const CircularProgress = ({ value, max, color, size = 120, strokeWidth = 10, label, subLabel, textColor }: any) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-zinc-800 transition-colors"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={`text-2xl font-bold ${textColor ? textColor : 'dark:text-white text-gray-900'}`}>{Math.round(value)}</span>
        {label && <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{label}</span>}
      </div>
    </div>
  );
};

const MacroCard = ({ icon: Icon, label, current, total, color, bgClass, textClass }: any) => {
    const left = Math.max(0, total - current);
    const percent = Math.min(100, (current / total) * 100);
    
    return (
        <div className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/50 p-4 rounded-3xl flex flex-col items-center relative overflow-hidden shadow-sm dark:shadow-none transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 dark:bg-zinc-800">
                <div className={`h-full ${bgClass}`} style={{ width: `${percent}%` }} />
            </div>
            <div className="flex justify-between w-full mb-2">
                <div className="flex flex-col">
                    <span className="text-xl font-bold dark:text-white text-gray-900">{Math.round(left)}g</span>
                    <span className="text-xs text-zinc-500">{label} rest.</span>
                </div>
            </div>
            <div className="mt-2 mb-1">
                <CircularProgress 
                    value={current} 
                    max={total} 
                    size={60} 
                    strokeWidth={6} 
                    color={color} 
                />
            </div>
             <div className={`p-2 rounded-full mt-2 dark:bg-zinc-800/50 bg-gray-100`}>
                <Icon size={16} className={textClass} />
             </div>
        </div>
    )
}

export default function DashboardPage() {
  const { user, refreshUser } = useApp();
  const navigate = useNavigate();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [todayMacros, setTodayMacros] = useState<MacroData>({ calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
  
  // Step Counter State
  const [steps, setSteps] = useState(user?.currentSteps || 0);
  const [isStepModalOpen, setStepModalOpen] = useState(false);
  const [addStepAmount, setAddStepAmount] = useState(0);

  // Determine Goals (Custom or Calculated)
  const GOALS = user?.customMacros || {
    calories: 2500,
    protein: 160,
    carbs: 280,
    fats: 80,
    fiber: 30
  };
  const STEP_GOAL = user?.dailyStepsGoal || 6000;

  useEffect(() => {
    async function loadData() {
        const allMeals = await MockService.getMeals();
        setMeals(allMeals);

        // Calculate Today's totals
        const totals = allMeals.reduce((acc, meal) => {
        acc.calories += meal.macros.calories;
        acc.protein += meal.macros.protein;
        acc.carbs += meal.macros.carbs;
        acc.fats += meal.macros.fats;
        acc.fiber += meal.macros.fiber;
        return acc;
        }, { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
        
        setTodayMacros(totals);
    }
    loadData();
    setSteps(user?.currentSteps || 0);
  }, [user]);

  const handleAddSteps = async () => {
      const newTotal = steps + addStepAmount;
      setSteps(newTotal);
      await MockService.updateUserProfile({ currentSteps: newTotal });
      refreshUser();
      setStepModalOpen(false);
      setAddStepAmount(0);
  };

  const caloriesLeft = Math.max(0, GOALS.calories - todayMacros.calories);

  // Calculate Trial Days Left
  const daysLeft = user ? 3 - Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)) : 0;
  const isTrial = !user?.isPremium && user?.email !== 'joao.fructuoso2021@gmail.com';

  return (
    <div className="pb-32 p-6 max-w-md mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 dark:text-white text-gray-900">
            <span className="text-xl">🍎</span> Caloriz.AI
          </h1>
          <div className="flex gap-4 mt-1 text-sm font-medium text-zinc-400">
             <span className="dark:text-white text-gray-900 border-b-2 dark:border-white border-gray-900 pb-0.5">Hoje</span>
             <span>Ontem</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
            {/* Trial Badge */}
            {isTrial && (
                <div className="bg-red-500/10 text-red-600 dark:text-red-300 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20">
                    {daysLeft} dias rest.
                </div>
            )}
            <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm">
                <Flame size={14} className="text-orange-500 fill-orange-500" />
                <span className="text-sm font-bold dark:text-white text-gray-900">15</span>
            </div>
            <Link to="/profile">
                <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden border dark:border-zinc-700 border-gray-300">
                    <span className="text-lg text-gray-600 dark:text-gray-300">👤</span>
                </div>
            </Link>
        </div>
      </div>

      {/* Main Calorie Card */}
      <div className="bg-red-600 dark:bg-[#18181b] p-6 rounded-[32px] mb-6 shadow-xl shadow-red-500/10 dark:shadow-black/50 relative overflow-hidden transition-colors">
        {/* Subtle gradient blob behind */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-5xl font-bold text-white mb-1">{Math.round(caloriesLeft)}</h2>
                <p className="text-zinc-100 dark:text-zinc-400 text-sm font-medium">Calorias restantes</p>
            </div>
            <CircularProgress 
                value={todayMacros.calories} 
                max={GOALS.calories} 
                color="#ffffff" 
                size={100} 
                strokeWidth={10} 
                label="" 
                textColor="text-white"
            />
        </div>
      </div>

      {/* Steps Card */}
      <div 
        onClick={() => setStepModalOpen(true)}
        className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/50 p-4 rounded-3xl mb-6 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all shadow-sm"
      >
        <div className="flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-500/20 p-3 rounded-full">
                <Footprints className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
                <h3 className="font-bold text-lg dark:text-white text-gray-900">Passos</h3>
                <p className="text-xs text-zinc-500">{steps} / {STEP_GOAL}</p>
            </div>
        </div>
        <div className="w-1/3">
             <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500" style={{ width: `${Math.min(100, (steps/STEP_GOAL)*100)}%` }} />
             </div>
        </div>
      </div>

      {/* Steps Modal */}
      {isStepModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-xl font-bold mb-4 dark:text-white text-gray-900">Registrar Passos</h3>
                  <div className="flex justify-center mb-6">
                      <div className="text-center">
                          <p className="text-4xl font-bold text-green-500">{steps}</p>
                          <p className="text-xs text-zinc-500">Total Hoje</p>
                      </div>
                  </div>
                  <label className="text-sm text-zinc-500 mb-2 block">Adicionar passos manuais:</label>
                  <div className="flex gap-2 mb-6">
                      <input 
                        type="number" 
                        value={addStepAmount} 
                        onChange={(e) => setAddStepAmount(Number(e.target.value))}
                        className="flex-1 bg-gray-100 dark:bg-zinc-800 rounded-xl p-3 text-center font-bold outline-none dark:text-white"
                        placeholder="0"
                      />
                  </div>
                  <div className="flex gap-3">
                      <button onClick={() => setStepModalOpen(false)} className="flex-1 py-3 bg-gray-200 dark:bg-zinc-800 rounded-xl font-bold dark:text-zinc-400">Cancelar</button>
                      <button onClick={handleAddSteps} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold">Salvar</button>
                  </div>
              </div>
          </div>
      )}

      {/* Macros Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <MacroCard 
            icon={Beef} 
            label="Prot." 
            current={todayMacros.protein} 
            total={GOALS.protein} 
            color="#f87171"
            bgClass="bg-red-400"
            textClass="text-red-400"
        />
        <MacroCard 
            icon={Wheat} 
            label="Carb." 
            current={todayMacros.carbs} 
            total={GOALS.carbs} 
            color="#fb923c" 
            bgClass="bg-orange-400"
            textClass="text-orange-400"
        />
        <MacroCard 
            icon={Droplets} 
            label="Gord." 
            current={todayMacros.fats} 
            total={GOALS.fats} 
            color="#60a5fa" 
            bgClass="bg-blue-400"
            textClass="text-blue-400"
        />
      </div>

      {/* Recent Uploads */}
      <div className="mb-4 flex justify-between items-end">
        <h3 className="font-bold text-lg dark:text-white text-gray-900">Refeições Recentes</h3>
      </div>

      <div className="space-y-4">
        {meals.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 border border-dashed border-gray-300 dark:border-zinc-800 rounded-3xl">
                <p>Nenhuma refeição registrada.</p>
                <button onClick={() => navigate('/scanner')} className="text-red-500 text-sm mt-2 font-medium">Escanear prato</button>
            </div>
        ) : (
            meals.map((meal) => (
            <div key={meal.id} className="bg-white dark:bg-[#18181b] p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-gray-100 dark:border-transparent transition-colors">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                {meal.imageUrl ? (
                    <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🥗</div>
                )}
                </div>
                <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold truncate pr-2 dark:text-white text-gray-900 capitalize">{meal.name}</h4>
                    <span className="text-xs text-zinc-400">09:00</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-300 mb-2">
                    <Flame size={12} className="fill-zinc-400 dark:fill-zinc-300" />
                    <span>{Math.round(meal.macros.calories)} kcal</span>
                </div>
                <div className="flex gap-3 text-xs font-medium text-zinc-500">
                    <span className="flex items-center gap-1"><Beef size={10} className="text-red-400" /> {Math.round(meal.macros.protein)}g</span>
                    <span className="flex items-center gap-1"><Wheat size={10} className="text-orange-400" /> {Math.round(meal.macros.carbs)}g</span>
                    <span className="flex items-center gap-1"><Droplets size={10} className="text-blue-400" /> {Math.round(meal.macros.fats)}g</span>
                </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
}
