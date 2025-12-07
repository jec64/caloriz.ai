
export enum GoalType {
  LOSE = 'LOSE',
  MAINTAIN = 'MAINTAIN',
  GAIN = 'GAIN',
}

export enum ActivityLevel {
  SEDENTARY = 'SEDENTARY',
  MODERATE = 'MODERATE',
  ACTIVE = 'ACTIVE',
}

export interface MacroData {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  weight: number; // kg
  height: number; // cm
  age: number;
  sex: 'M' | 'F';
  goal: GoalType;
  activityLevel: ActivityLevel;
  createdAt: number; // Timestamp for trial logic
  userCode: string; // e.g., CZ2919283
  isPremium: boolean;
  isBanned: boolean;
  // New Fields
  dailyStepsGoal: number;
  customMacros?: MacroData; // If set, overrides calculated defaults
  currentSteps?: number; // Mock data for today's steps
  mealPlanUrl?: string; // URL or Base64 of the PDF plan
  acceptedTermsAt?: number; // Timestamp of when terms were accepted
}

export interface UserLog {
  id: string;
  userId: string;
  action: 'REGISTER' | 'LOGIN' | 'LOGOUT' | 'VIEW' | 'ACTION';
  details: string; // e.g., "Acessou Aba Treinos"
  timestamp: number;
}

export interface Meal {
  id: string;
  name: string;
  timestamp: number;
  imageUrl?: string;
  macros: MacroData;
}

export interface Workout {
  id: string;
  title: string;
  description?: string;
  durationMin: number;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Todos';
  type: 'Sem Impacto' | 'Cardio' | 'Força' | 'Flexibilidade';
  caloriesBurn: number;
  thumbnail: string;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // "12-15" or "30s"
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  scheduledFor: string; // ISO Date string
  createdAt: number;
}

export interface AppConfig {
  themeMode: 'light' | 'dark';
  monthlyPrice: number;
  annualPrice: number;
  seasonalTheme: 'NONE' | 'XMAS' | 'HALLOWEEN';
}