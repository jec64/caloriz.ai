
import { supabase } from './client';
import { UserProfile, GoalType, ActivityLevel, Meal, AppConfig, AppNotification, Workout, UserLog } from '../types';

// Constants
const STORAGE_CONFIG_KEY = 'caloriz_config';

// Default Config (still local for generic app settings)
const defaultConfig: AppConfig = {
  themeMode: 'dark',
  monthlyPrice: 19.90,
  annualPrice: 127.00,
  seasonalTheme: 'NONE',
};

// --- App Config (Local) ---

export const getAppConfig = (): AppConfig => {
  const stored = localStorage.getItem(STORAGE_CONFIG_KEY);
  return stored ? JSON.parse(stored) : defaultConfig;
};

export const updateAppConfig = (config: Partial<AppConfig>) => {
  const current = getAppConfig();
  const updated = { ...current, ...config };
  localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(updated));
  return updated;
};

// --- Logs System (DB) ---

export const getLogs = async (): Promise<UserLog[]> => {
    // Only Admin should really see this list in a real scenario
    const { data, error } = await supabase.from('user_logs').select('*').order('timestamp', { ascending: false });
    if (error) { console.error(error); return []; }
    return data as UserLog[];
};

export const addUserLog = async (userId: string, action: UserLog['action'], details: string) => {
    const newLog = {
        user_id: userId,
        action,
        details,
        timestamp: Date.now()
    };
    await supabase.from('user_logs').insert([newLog]);
};

export const getUserLogs = async (userId: string): Promise<UserLog[]> => {
    const { data, error } = await supabase
        .from('user_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });
    
    if (error) { console.error(error); return []; }
    return data as UserLog[];
};

// --- User Management (Auth + DB) ---

export const getCurrentUser = async (): Promise<UserProfile | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  let { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  // SELF-HEALING: If profile is missing but session exists, create it now.
  if (!profile) {
      console.warn("Perfil não encontrado. Tentando criar automaticamente (Self-Healing)...");
      const metadata = session.user.user_metadata || {};
      
      const newProfile = {
        id: session.user.id,
        email: session.user.email,
        name: metadata.name || 'Usuário',
        phone: metadata.phone || '',
        weight: 0,
        height: 0,
        age: 0,
        sex: 'M',
        goal: GoalType.MAINTAIN,
        activity_level: ActivityLevel.MODERATE,
        created_at: Date.now(),
        user_code: metadata.user_code || `CZ${Math.floor(Math.random() * 1000000)}`,
        is_premium: false,
        is_banned: false,
        daily_steps_goal: 6000,
        current_steps: 0,
        accepted_terms_at: metadata.accepted_terms_at ? Number(metadata.accepted_terms_at) : undefined
      };

      const { data: inserted, error: insertError } = await supabase
        .from('profiles')
        .upsert(newProfile)
        .select()
        .single();
        
      if (insertError) {
          console.error("Falha ao criar perfil automático:", insertError);
          return null;
      }
      profile = inserted;
  }
  
  return mapProfileData(profile);
};

// Helper to map DB row to UserProfile
const mapProfileData = (row: any): UserProfile => {
    return {
        id: row.id,
        email: row.email,
        name: row.name,
        phone: row.phone,
        weight: Number(row.weight),
        height: Number(row.height),
        age: row.age,
        sex: row.sex,
        goal: row.goal,
        activityLevel: row.activity_level,
        createdAt: Number(row.created_at),
        userCode: row.user_code,
        isPremium: row.is_premium,
        isBanned: row.is_banned,
        dailyStepsGoal: row.daily_steps_goal,
        currentSteps: row.current_steps,
        mealPlanUrl: row.meal_plan_url,
        acceptedTermsAt: row.accepted_terms_at ? Number(row.accepted_terms_at) : undefined,
        customMacros: row.custom_macros
    };
};

export const registerUser = async (
  email: string,
  pass: string,
  name: string,
  phone: string,
  termsAccepted: boolean
): Promise<UserProfile> => {
  
  const userCode = `CZ${Math.floor(Math.random() * 10000000)}`;
  const acceptedTermsAt = termsAccepted ? Date.now() : undefined;

  // 1. Create Auth User with Metadata
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: pass,
    options: {
        data: {
            name,
            phone,
            user_code: userCode,
            accepted_terms_at: acceptedTermsAt,
            // Defaults that trigger can use
            goal: GoalType.MAINTAIN,
            activity_level: ActivityLevel.MODERATE
        }
    }
  });

  if (authError) {
      console.error("SignUp Error:", authError);
      throw new Error(authError.message);
  }
  
  if (!authData.user) throw new Error("Erro ao criar usuário.");

  // 2. If session exists (no email confirm needed), try to ensure profile exists
  // If no session (email confirm needed), getCurrentUser's self-healing will handle it later upon login.
  if (authData.session) {
      // We can try to upsert here just in case, but let's rely on getCurrentUser or Trigger
      await addUserLog(authData.user.id, 'REGISTER', 'Conta criada na plataforma');
  }

  // Return a constructed profile object so the UI can proceed
  return {
      id: authData.user.id,
      email,
      name,
      phone,
      userCode,
      weight: 0,
      height: 0,
      age: 0,
      sex: 'M',
      goal: GoalType.MAINTAIN,
      activityLevel: ActivityLevel.MODERATE,
      createdAt: Date.now(),
      isPremium: false,
      isBanned: false,
      dailyStepsGoal: 6000,
      acceptedTermsAt
  };
};

export const loginUser = async (email: string, pass: string): Promise<UserProfile> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass
    });

    if (error) {
        console.error("Login Error:", error);
        throw new Error("Credenciais inválidas ou e-mail não confirmado.");
    }
    
    if (!data.user) throw new Error("Usuário não encontrado.");

    const profile = await getCurrentUser();
    if (!profile) {
        // This should rarely happen now with self-healing
        throw new Error("Perfil não encontrado. Tente novamente em instantes.");
    }

    await addUserLog(profile.id, 'LOGIN', 'Login realizado com sucesso');
    return profile;
};

export const updateUserProfile = async (updates: Partial<UserProfile>) => {
  const user = await getCurrentUser();
  if (!user) return;

  // Map camelCase to snake_case for DB
  const dbUpdates: any = {};
  if (updates.weight !== undefined) dbUpdates.weight = updates.weight;
  if (updates.height !== undefined) dbUpdates.height = updates.height;
  if (updates.age !== undefined) dbUpdates.age = updates.age;
  if (updates.sex !== undefined) dbUpdates.sex = updates.sex;
  if (updates.goal !== undefined) dbUpdates.goal = updates.goal;
  if (updates.activityLevel !== undefined) dbUpdates.activity_level = updates.activityLevel;
  if (updates.dailyStepsGoal !== undefined) dbUpdates.daily_steps_goal = updates.dailyStepsGoal;
  if (updates.currentSteps !== undefined) dbUpdates.current_steps = updates.currentSteps;
  if (updates.mealPlanUrl !== undefined) dbUpdates.meal_plan_url = updates.mealPlanUrl;
  if (updates.customMacros !== undefined) dbUpdates.custom_macros = updates.customMacros;
  if (updates.isPremium !== undefined) dbUpdates.is_premium = updates.isPremium;

  const { error } = await supabase
    .from('profiles')
    .update(dbUpdates)
    .eq('id', user.id);

  if (error) console.error("Update error:", error);
};

// --- Meals (DB) ---

export const getMeals = async (): Promise<Meal[]> => {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) { console.error(error); return []; }

  return data.map((m: any) => ({
      id: m.id,
      name: m.name,
      timestamp: Number(m.timestamp),
      imageUrl: m.image_url,
      macros: m.macros
  }));
};

export const addMeal = async (meal: Meal) => {
    const user = await getCurrentUser();
    if(!user) return;

    const { error } = await supabase.from('meals').insert([{
        user_id: user.id,
        name: meal.name,
        image_url: meal.imageUrl,
        macros: meal.macros,
        timestamp: meal.timestamp
    }]);

    if (error) console.error("Add meal error:", error);
};

// --- Workouts (DB) ---

export const getWorkouts = async (): Promise<Workout[]> => {
    // Try fetch from DB
    const { data, error } = await supabase.from('workouts').select('*');
    if (!error && data.length > 0) {
        return data.map((w: any) => ({
            id: w.id,
            title: w.title,
            description: w.description,
            durationMin: w.duration_min,
            level: w.level,
            type: w.type,
            caloriesBurn: w.calories_burn,
            thumbnail: w.thumbnail,
            exercises: w.exercises
        }));
    }
    // Fallback empty if table not set up yet
    return [];
};

export const getWorkoutById = async (id: string): Promise<Workout | undefined> => {
    const { data, error } = await supabase.from('workouts').select('*').eq('id', id).single();
    if (error || !data) return undefined;
    return {
        id: data.id,
        title: data.title,
        description: data.description,
        durationMin: data.duration_min,
        level: data.level,
        type: data.type,
        caloriesBurn: data.calories_burn,
        thumbnail: data.thumbnail,
        exercises: data.exercises
    };
};

// --- Notifications (DB) ---
export const getNotifications = async (): Promise<AppNotification[]> => {
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data.map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        scheduledFor: n.scheduled_for,
        createdAt: Number(n.created_at)
    }));
};

export const addNotification = async (notif: AppNotification) => {
    const { error } = await supabase.from('notifications').insert([{
        title: notif.title,
        message: notif.message,
        scheduled_for: notif.scheduledFor,
        created_at: notif.createdAt
    }]);
    if (error) console.error("Notif Error", error);
    // Return fresh list
    return await getNotifications();
};

// --- Mock Payment (Simulated for now, just updates DB) ---
export const simulatePayment = async (): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 2000));
    const success = Math.random() > 0.1; // 90% success rate
    if (success) {
        await updateUserProfile({ isPremium: true });
        const user = await getCurrentUser();
        if(user) await addUserLog(user.id, 'ACTION', 'Pagamento Aprovado - Premium');
    }
    return success;
};
