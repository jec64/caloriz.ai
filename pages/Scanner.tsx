
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, CheckCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import * as GeminiService from '../services/geminiService';
import * as MockService from '../services/mockSupabase';
import { Meal } from '../types';

export default function ScannerPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Meal | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        analyzeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64: string) => {
    setAnalyzing(true);
    try {
      // Remove data URL prefix for API
      const base64Data = base64.split(',')[1];
      const aiData = await GeminiService.analyzeFoodImage(base64Data);
      
      const newMeal: Meal = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        name: aiData.name,
        imageUrl: base64,
        macros: aiData.macros
      };
      
      setResult(newMeal);

    } catch (error) {
      console.error(error);
      alert("Falha ao analisar imagem. Tente novamente.");
      setImagePreview(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const saveMeal = () => {
    if (result) {
      MockService.addMeal(result);
      navigate('/dashboard');
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] p-6 flex flex-col items-center pt-10 animate-fade-in transition-colors">
        <div className="w-full flex justify-between items-center mb-6">
            <button onClick={() => navigate('/dashboard')} className="p-2 bg-gray-200 dark:bg-zinc-800 rounded-full dark:text-white text-black"><X size={20} /></button>
            <h1 className="font-bold dark:text-white text-gray-900">Nutrição</h1>
            <div className="w-10" />
        </div>

        <div className="relative w-48 h-48 mb-8 animate-slide-up">
            <img src={imagePreview!} className="w-full h-full object-cover rounded-full shadow-2xl border-4 dark:border-zinc-800 border-white" alt="Scanned Food" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                {result.name}
            </div>
        </div>

        <div className="w-full bg-white dark:bg-[#18181b] rounded-3xl p-6 mb-20 shadow-lg dark:shadow-none animate-slide-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold capitalize dark:text-white text-gray-900">{result.name}</h2>
                    <p className="text-zinc-500 text-sm">Scan Automático IA</p>
                </div>
                <div className="flex items-center gap-4 bg-gray-100 dark:bg-zinc-900 px-4 py-2 rounded-xl dark:text-white text-black">
                    <button className="text-xl">-</button>
                    <span className="font-bold">1</span>
                    <button className="text-xl">+</button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-2xl flex items-center gap-3">
                    <div className="bg-orange-500/20 p-2 rounded-full text-orange-500">
                        <span className="text-lg">🔥</span>
                    </div>
                    <div>
                        <p className="text-zinc-500 text-xs">Calorias</p>
                        <p className="font-bold text-lg dark:text-white text-gray-900">{Math.round(result.macros.calories)}</p>
                    </div>
                </div>
                 <div className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-2xl flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-full text-blue-500">
                         <span className="text-lg">💧</span>
                    </div>
                    <div>
                        <p className="text-zinc-500 text-xs">Gorduras</p>
                        <p className="font-bold text-lg dark:text-white text-gray-900">{Math.round(result.macros.fats)}g</p>
                    </div>
                </div>
                 <div className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-2xl flex items-center gap-3">
                    <div className="bg-red-500/20 p-2 rounded-full text-red-500">
                         <span className="text-lg">🥩</span>
                    </div>
                    <div>
                        <p className="text-zinc-500 text-xs">Proteínas</p>
                        <p className="font-bold text-lg dark:text-white text-gray-900">{Math.round(result.macros.protein)}g</p>
                    </div>
                </div>
                 <div className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-2xl flex items-center gap-3">
                    <div className="bg-yellow-500/20 p-2 rounded-full text-yellow-500">
                         <span className="text-lg">🌾</span>
                    </div>
                    <div>
                        <p className="text-zinc-500 text-xs">Carbos</p>
                        <p className="font-bold text-lg dark:text-white text-gray-900">{Math.round(result.macros.carbs)}g</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 bg-green-500/10 dark:bg-green-900/20 border border-green-500/20 dark:border-green-900 rounded-xl p-3 flex items-center gap-2">
                <div className="bg-green-500 p-1 rounded-full"><CheckCircle size={12} className="text-white dark:text-black" /></div>
                <div className="flex-1">
                    <p className="text-xs font-bold text-green-600 dark:text-green-500">Health Score 7/10</p>
                    <div className="w-full h-1 bg-green-200 dark:bg-green-900 rounded-full mt-1 overflow-hidden">
                        <div className="w-[70%] h-full bg-green-500" />
                    </div>
                </div>
            </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-50 via-gray-50 dark:from-black dark:via-black to-transparent">
             <div className="flex gap-4 max-w-md mx-auto">
                 <button onClick={() => { setResult(null); setImagePreview(null); }} className="flex-1 bg-gray-200 dark:bg-zinc-800 font-bold py-4 rounded-2xl dark:text-white text-gray-900">Corrigir</button>
                 <button onClick={saveMeal} className="flex-1 bg-red-600 dark:bg-white text-white dark:text-black font-bold py-4 rounded-2xl shadow-lg">Confirmar</button>
             </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col relative animate-fade-in">
        <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
             <button onClick={() => navigate('/dashboard')} className="p-3 bg-zinc-800/50 backdrop-blur rounded-full text-white">
                <X size={24} />
             </button>
             <h2 className="font-bold text-lg text-white">Scanner</h2>
             <div className="w-12" />
        </div>

      {imagePreview ? (
        <div className="flex-1 flex flex-col items-center justify-center relative">
            <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="preview" />
            {analyzing && (
                <div className="z-10 flex flex-col items-center">
                    <div className="w-24 h-24 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
                    <p className="text-xl font-bold animate-pulse text-white">Analisando Alimento...</p>
                </div>
            )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center p-6 bg-zinc-900 relative overflow-hidden">
            {/* Camera Viewfinder mockup */}
            <div className="w-64 h-64 border-2 border-dashed border-zinc-600 rounded-3xl flex items-center justify-center mb-8 relative">
                 <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-xl -mt-1 -ml-1" />
                 <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-xl -mt-1 -mr-1" />
                 <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-xl -mb-1 -ml-1" />
                 <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-xl -mb-1 -mr-1" />
                 <p className="text-zinc-500 text-sm font-medium">Aponte para o prato</p>
            </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-black/90 p-8 pb-12 flex justify-around items-center rounded-t-3xl">
         <div className="flex flex-col items-center gap-1 text-zinc-500">
             <ImageIcon size={24} />
             <span className="text-xs">Galeria</span>
             {/* Hidden file input layered over gallery icon */}
             <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="absolute w-12 h-12 opacity-0 cursor-pointer"
             />
         </div>

         <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/10 active:scale-95 transition-transform"
         >
             <div className="w-16 h-16 bg-white rounded-full" />
         </button>
         
         <div className="flex flex-col items-center gap-1 text-white">
             <div className="bg-zinc-800 p-2 rounded-full">
                <span className="text-xs font-bold px-2">Escanear</span>
             </div>
         </div>
      </div>
    </div>
  );
}
