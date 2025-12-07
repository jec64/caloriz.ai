
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Home, BarChart2, Settings, Plus, Camera, Dumbbell, FileText, Loader2 } from './components/Icons';
import * as MockService from './services/mockSupabase';
import { UserProfile, Meal } from './types';

// Pages
import AuthPage from './pages/Auth';
import OnboardingPage from './pages/Onboarding';
import DashboardPage from './pages/Dashboard';
import ScannerPage from './pages/Scanner';
import WorkoutsPage from './pages/Workouts';
import ProfilePage from './pages/Profile';
import AdminPage from './pages/Admin';
import PaywallPage from './pages/Paywall';
import MealPlanPage from './pages/MealPlan';
import WorkoutDetailPage from './pages/WorkoutDetail';
import PoliciesPage from './pages/Policies';

// Context
interface AppContextType {
  user: UserProfile | null;
  refreshUser: () => void;
  logout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType>({ 
    user: null, 
    refreshUser: () => {}, 
    logout: () => {}, 
    theme: 'dark', 
    toggleTheme: () => {},
    loading: true
});

export const useApp = () => useContext(AppContext);

// Navigation Component
const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useApp();
  const isActive = (path: string) => location.pathname === path;
  
  // Hide nav on auth, onboarding, scanner, paywall, policies
  if (['/login', '/register', '/onboarding', '/scanner', '/paywall', '/policies'].includes(location.pathname)) return null;

  const isAdmin = user?.email === 'joao.fructuoso2021@gmail.com';

  const handleNavClick = (path: string, label: string) => {
      if (user && path !== location.pathname) {
          MockService.addUserLog(user.id, 'VIEW', `Acessou Aba ${label}`);
      }
      navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-md border-t border-gray-200 dark:border-zinc-800 pb-safe pt-2 px-6 pb-6 z-50 transition-colors duration-300">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <button onClick={() => handleNavClick('/dashboard', 'Início')} className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard') ? 'text-red-600 dark:text-white' : 'text-gray-400 dark:text-zinc-500'}`}>
          <Home size={24} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Início</span>
        </button>
        
        <button onClick={() => handleNavClick('/workouts', 'Treinos')} className={`flex flex-col items-center gap-1 transition-colors ${isActive('/workouts') ? 'text-red-600 dark:text-white' : 'text-gray-400 dark:text-zinc-500'}`}>
          <Dumbbell size={24} strokeWidth={isActive('/workouts') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Treinos</span>
        </button>

        <button 
          onClick={() => handleNavClick('/scanner', 'Scanner')}
          className="relative -top-5 bg-red-600 dark:bg-white text-white dark:text-black p-4 rounded-full shadow-lg shadow-red-500/30 dark:shadow-white/20 transform transition-transform active:scale-95"
        >
          <Plus size={28} strokeWidth={3} />
        </button>

        {isAdmin ? (
            <button onClick={() => handleNavClick('/admin', 'Admin')} className={`flex flex-col items-center gap-1 transition-colors ${isActive('/admin') ? 'text-red-600 dark:text-white' : 'text-gray-400 dark:text-zinc-500'}`}>
              <BarChart2 size={24} strokeWidth={isActive('/admin') ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Admin</span>
            </button>
        ) : (
             <button onClick={() => handleNavClick('/meal-plan', 'Plano')} className={`flex flex-col items-center gap-1 transition-colors ${isActive('/meal-plan') ? 'text-red-600 dark:text-white' : 'text-gray-400 dark:text-zinc-500'}`}>
              <FileText size={24} strokeWidth={isActive('/meal-plan') ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Plano</span>
            </button>
        )}

        <button onClick={() => handleNavClick('/profile', 'Perfil')} className={`flex flex-col items-center gap-1 transition-colors ${isActive('/profile') ? 'text-red-600 dark:text-white' : 'text-gray-400 dark:text-zinc-500'}`}>
          <Settings size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </div>
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loading } = useApp();
  
  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-[#09090b]"><Loader2 className="animate-spin text-red-600" size={32} /></div>;

  if (!user) return <Navigate to="/login" replace />;
  if (user.weight === 0) return <Navigate to="/onboarding" replace />;
  
  // Trial Logic
  const msInDay = 24 * 60 * 60 * 1000;
  const daysSinceCreation = (Date.now() - user.createdAt) / msInDay;
  
  // Admin bypass
  const isAdmin = user.email === 'joao.fructuoso2021@gmail.com';
  
  if (!isAdmin && !user.isPremium && daysSinceCreation > 3) {
    return <PaywallPage />;
  }

  if (user.isBanned) {
      return (
          <div className="h-screen w-full bg-gray-50 dark:bg-black flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-red-500/20 p-6 rounded-2xl border border-red-500 mb-4">
                  <h1 className="text-2xl font-bold text-red-500 mb-2">Conta Banida</h1>
                  <p className="text-zinc-600 dark:text-zinc-400">Seu acesso foi revogado pelo administrador.</p>
              </div>
              <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-zinc-500 underline">Sair</button>
          </div>
      )
  }

  return <>{children}</>;
};

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light'|'dark'>(MockService.getAppConfig().themeMode);

  const refreshUser = async () => {
    try {
        const u = await MockService.getCurrentUser();
        setUser(u);
    } catch (e) {
        console.error("Auth check failed", e);
    } finally {
        setLoading(false);
    }
  };
  
  const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      MockService.updateAppConfig({ themeMode: newTheme });
  };

  const logout = () => {
    if (user) {
        MockService.addUserLog(user.id, 'LOGOUT', 'Saiu da plataforma');
    }
    localStorage.removeItem('sb-fzltzpzyzxhcphiemoel-auth-token');
    setUser(null);
    window.location.reload();
  };

  useEffect(() => {
    // Initial check with safety timeout
    refreshUser();
    
    // Failsafe: If DB hangs, stop loading after 5s so user sees Login screen
    const safetyTimer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(safetyTimer);
  }, []);

  useEffect(() => {
      if (theme === 'dark') {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
  }, [theme]);

  return (
    <AppContext.Provider value={{ user, refreshUser, logout, theme, toggleTheme, loading }}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-white font-sans selection:bg-red-500/30 transition-colors duration-300">
          <Routes>
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            
            <Route path="/onboarding" element={
               <ProtectedRoute><OnboardingPage /></ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            
            <Route path="/scanner" element={
              <ProtectedRoute><ScannerPage /></ProtectedRoute>
            } />

             <Route path="/workouts" element={
              <ProtectedRoute><WorkoutsPage /></ProtectedRoute>
            } />

            <Route path="/workout/:id" element={
              <ProtectedRoute><WorkoutDetailPage /></ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            
             <Route path="/admin" element={
              <ProtectedRoute><AdminPage /></ProtectedRoute>
            } />
            
             <Route path="/meal-plan" element={
              <ProtectedRoute><MealPlanPage /></ProtectedRoute>
            } />
            
            {/* PUBLIC ROUTE - ACCESSIBLE WITHOUT LOGIN */}
             <Route path="/policies" element={<PoliciesPage />} />
            
             <Route path="/paywall" element={<PaywallPage />} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <BottomNav />
        </div>
      </Router>
    </AppContext.Provider>
  );
}