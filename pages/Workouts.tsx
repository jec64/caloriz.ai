
import React, { useEffect, useState } from 'react';
import { useApp } from '../App';
import * as MockService from '../services/mockSupabase';
import { Workout } from '../types';
import { Dumbbell, Lock, Clock, Flame } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const WorkoutCard = ({ id, title, level, time, cals, image, locked, onClick }: any) => (
  <div onClick={() => !locked && onClick(id)} className={`relative group overflow-hidden rounded-3xl mb-4 h-48 animate-slide-up shadow-md ${locked ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
    <img src={image} alt={title} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${locked ? 'grayscale' : ''}`} />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 flex flex-col justify-end">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded text-xs font-bold uppercase text-white">{level}</span>
          </div>
          <h3 className="text-xl font-bold leading-tight w-3/4 text-white">{title}</h3>
        </div>
        {locked ? (
           <div className="bg-black/50 p-3 rounded-full backdrop-blur">
             <Lock size={20} className="text-white" />
           </div>
        ) : (
            <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-zinc-300">
                    <Clock size={12} /> {time}m
                </div>
                 <div className="flex items-center gap-1 text-xs text-orange-400">
                    <Flame size={12} /> {cals}
                </div>
            </div>
        )}
      </div>
    </div>
    {locked && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-zinc-900/90 backdrop-blur px-6 py-3 rounded-2xl flex items-center gap-2 border border-zinc-700">
                <Lock size={16} className="text-red-400" />
                <span className="font-bold text-sm text-white">Somente Premium</span>
            </div>
        </div>
    )}
  </div>
);

export default function WorkoutsPage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filter, setFilter] = useState('Todos');

  const isPremium = user?.isPremium || user?.email === 'joao.fructuoso2021@gmail.com';

  useEffect(() => {
      async function load() {
          const list = await MockService.getWorkouts();
          setWorkouts(list);
      }
      load();
  }, []);

  const filteredWorkouts = workouts.filter(w => {
      if (filter === 'Todos') return true;
      if (filter === 'Iniciante') return w.level === 'Iniciante';
      if (filter === 'HIIT') return w.type === 'Cardio';
      if (filter === 'Força') return w.type === 'Força';
      if (filter === 'Yoga') return w.type === 'Flexibilidade';
      return true;
  });

  return (
    <div className="pb-32 p-6 max-w-md mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 dark:text-white text-gray-900">Treinos</h1>
      
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
         {['Todos', 'Iniciante', 'HIIT', 'Força', 'Yoga'].map((cat, i) => (
             <button 
                key={cat} 
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors ${filter === cat ? 'bg-red-600 text-white shadow-md' : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
             >
                 {cat}
             </button>
         ))}
      </div>

      {filteredWorkouts.length === 0 ? (
          <p className="text-zinc-500 text-center py-10">Carregando treinos ou nenhum encontrado...</p>
      ) : (
          filteredWorkouts.map(w => (
            <WorkoutCard 
                key={w.id}
                id={w.id}
                title={w.title}
                level={w.level}
                time={w.durationMin}
                cals={w.caloriesBurn}
                image={w.thumbnail}
                locked={!isPremium && w.level !== 'Todos' && w.level !== 'Iniciante'} // Example logic: Only All/Beginner free
                onClick={(id: string) => navigate(`/workout/${id}`)}
            />
          ))
      )}

      {!isPremium && (
          <div className="mt-8 p-6 bg-gradient-to-br from-red-900 to-purple-900 rounded-3xl text-center relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
              <h3 className="text-xl font-bold mb-2 text-white">Desbloqueie Todos os Treinos</h3>
              <p className="text-red-200 text-sm mb-4">Tenha acesso a mais de 50 programas especializados.</p>
              <Link to="/profile" className="inline-block bg-white text-red-900 font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform">Seja Premium</Link>
          </div>
      )}
    </div>
  );
}
