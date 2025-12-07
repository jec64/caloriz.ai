
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../App';
import * as MockService from '../services/mockSupabase';
import { User, Lock, Mail, Phone, Loader2, CheckSquare } from 'lucide-react';

interface AuthProps {
  mode: 'login' | 'register';
}

export default function AuthPage({ mode }: AuthProps) {
  const navigate = useNavigate();
  const { refreshUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!termsAccepted) throw new Error("Você precisa aceitar os Termos de Uso e Políticas.");
        if (pass !== confirmPass) throw new Error("As senhas não coincidem");
        if (pass.length < 6) throw new Error("Senha muito curta");
        
        await MockService.registerUser(email, pass, name, phone, termsAccepted);
        
        // Try to auto-login. If it fails, it usually means email verification is required.
        try {
            await MockService.loginUser(email, pass);
            await refreshUser();
            navigate('/onboarding');
        } catch (loginErr) {
            // If login fails after registration, we assume email verification is needed
            alert("Conta criada com sucesso! Por favor, verifique seu e-mail para confirmar o cadastro antes de fazer login.");
            navigate('/login');
        }

      } else {
         // Login Mode
         await MockService.loginUser(email, pass);
         await refreshUser();
         
         const user = await MockService.getCurrentUser();
         if (user && user.weight === 0) {
           navigate('/onboarding');
         } else {
           navigate('/dashboard');
         }
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Algo deu errado. Verifique seus dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gray-50 dark:bg-[#09090b] transition-colors duration-300">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-red-500/20 dark:bg-purple-600/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-purple-500/20 dark:bg-red-600/30 rounded-full blur-[100px]" />

      <div className="w-full max-w-sm z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-3xl">🍎</span>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-purple-600 dark:from-white dark:to-zinc-400">
              Caloriz.AI
            </h1>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            {mode === 'login' ? 'Bem-vindo de volta!' : 'Comece sua jornada saudável hoje.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 text-zinc-400 dark:text-zinc-500 group-focus-within:text-red-600 dark:group-focus-within:text-white transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Nome Completo"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-400"
                />
              </div>
              <div className="relative group">
                <Phone className="absolute left-4 top-3.5 text-zinc-400 dark:text-zinc-500 group-focus-within:text-red-600 dark:group-focus-within:text-white transition-colors" size={20} />
                <input
                  type="tel"
                  placeholder="Telefone"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-400"
                />
              </div>
            </>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 text-zinc-400 dark:text-zinc-500 group-focus-within:text-red-600 dark:group-focus-within:text-white transition-colors" size={20} />
            <input
              type="email"
              placeholder="Endereço de email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-400"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-3.5 text-zinc-400 dark:text-zinc-500 group-focus-within:text-red-600 dark:group-focus-within:text-white transition-colors" size={20} />
            <input
              type="password"
              placeholder="Senha"
              required
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-400"
            />
          </div>

          {mode === 'register' && (
            <>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-zinc-400 dark:text-zinc-500 group-focus-within:text-red-600 dark:group-focus-within:text-white transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="Repetir Senha"
                  required
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-400"
                />
              </div>

              <div className="flex items-start gap-3 px-1">
                 <div className="relative flex items-center pt-0.5">
                   <input
                     type="checkbox"
                     id="terms"
                     required
                     checked={termsAccepted}
                     onChange={(e) => setTermsAccepted(e.target.checked)}
                     className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 checked:bg-red-600 checked:border-transparent focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all"
                   />
                   <CheckSquare size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 mt-0.5" />
                 </div>
                 <label htmlFor="terms" className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight select-none">
                    Declaro que li e aceito os <Link to="/policies" className="text-red-600 dark:text-red-400 hover:underline font-bold">Termos de Uso</Link> e <Link to="/policies" className="text-red-600 dark:text-red-400 hover:underline font-bold">Políticas de Privacidade</Link> da Caloriz.AI.
                 </label>
              </div>
            </>
          )}

          {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 dark:bg-white text-white dark:text-black font-semibold rounded-2xl py-4 mt-6 hover:bg-red-700 dark:hover:bg-zinc-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg dark:shadow-none"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-zinc-500 text-sm">
            {mode === 'login' ? "Não tem uma conta? " : "Já tem uma conta? "}
            <Link
              to={mode === 'login' ? '/register' : '/login'}
              className="text-red-600 dark:text-white font-medium hover:underline"
            >
              {mode === 'login' ? 'Cadastre-se' : 'Faça login'}
            </Link>
          </p>

           <p className="text-xs text-zinc-400 dark:text-zinc-600">
             Leia nossos <Link to="/policies" className="underline hover:text-red-500">Termos de Uso</Link> e <Link to="/policies" className="underline hover:text-red-500">Políticas de Privacidade</Link>.
           </p>
        </div>
      </div>
    </div>
  );
}
