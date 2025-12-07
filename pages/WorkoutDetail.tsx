
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import * as MockService from '../services/mockSupabase';
import { Workout } from '../types';
import { ChevronLeft, Clock, Flame, Play, CheckCircle, CheckSquare } from '../components/Icons';

export default function WorkoutDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
        if (id) {
            const w = await MockService.getWorkoutById(id);
            if (w) setWorkout(w);
        }
    }
    load();
  }, [id]);

  const toggleExercise = (exId: string) => {
    setCompletedExercises(prev => 
      prev.includes(exId) ? prev.filter(id => id !== exId) : [...prev, exId]
    );
  };

  const handleFinish = async () => {
    if (user) {
        await MockService.addUserLog(user.id, 'ACTION', `Finalizou treino: ${workout?.title}`);
    }
    alert("Treino concluído! Parabéns.");
    navigate('/dashboard');
  };

  if (!workout) return <div className="p-6 text-center mt-10 text-zinc-500">Carregando treino...</div>;

  return (
    <div className="pb-32 bg-gray-50 dark:bg-[#09090b] min-h-screen transition-colors animate-fade-in">
      {/* Header Image */}
      <div className="relative h-72 w-full">
        <img src={workout.thumbnail} alt={workout.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-gray-50 dark:to-[#09090b]"></div>
        
        <button 
            onClick={() => navigate('/workouts')}
            className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30 transition-colors z-10"
        >
            <ChevronLeft size={24} />
        </button>

        <div className="absolute bottom-0 left-0 p-6 w-full">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase mb-2 inline-block">
                {workout.level}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
                {workout.title}
            </h1>
            <div className="flex items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1"><Clock size={16} className="text-red-500" /> {workout.durationMin} min</span>
                <span className="flex items-center gap-1"><Flame size={16} className="text-orange-500" /> {workout.caloriesBurn} kcal</span>
            </div>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
            {workout.description}
        </p>

        <h3 className="font-bold text-xl mb-4 dark:text-white text-gray-900 flex items-center gap-2">
            <Play size={20} className="fill-red-600 text-red-600" /> Exercícios
        </h3>

        <div className="space-y-4 mb-10">
            {workout.exercises?.map((ex, index) => {
                const isDone = completedExercises.includes(ex.id);
                return (
                    <div 
                        key={ex.id} 
                        onClick={() => toggleExercise(ex.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isDone 
                            ? 'bg-green-50 dark:bg-green-900/10 border-green-500/30' 
                            : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:border-red-500 dark:hover:border-red-500'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isDone ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-zinc-800 text-zinc-500'}`}>
                                {index + 1}
                            </div>
                            <div>
                                <h4 className={`font-bold ${isDone ? 'text-green-700 dark:text-green-400 line-through' : 'dark:text-white text-gray-900'}`}>{ex.name}</h4>
                                <p className="text-xs text-zinc-500">{ex.sets} séries • {ex.reps}</p>
                            </div>
                        </div>
                        {isDone ? <CheckCircle size={24} className="text-green-500" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-zinc-700" />}
                    </div>
                )
            })}
        </div>

        <button 
            onClick={handleFinish}
            disabled={completedExercises.length === 0}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${
                completedExercises.length > 0 
                ? 'bg-red-600 dark:bg-white text-white dark:text-black hover:scale-[1.02]' 
                : 'bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed'
            }`}
        >
            Finalizar Treino
        </button>
      </div>
    </div>
  );
}
