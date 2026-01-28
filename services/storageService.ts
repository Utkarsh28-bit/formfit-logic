import { ExerciseLog, UserProfile, WorkoutPlan } from '../types';

const LOGS_KEY = 'formfit_logs';
const PROFILE_KEY = 'formfit_profile';
const PLANS_KEY = 'formfit_plans';

export const getLogs = (): ExerciseLog[] => {
  const data = localStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLog = (log: ExerciseLog) => {
  const logs = getLogs();
  logs.push(log);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

export const getHistoryForExercise = (exerciseId: string): ExerciseLog[] => {
  const logs = getLogs();
  return logs
    .filter(l => l.exerciseId === exerciseId)
    .sort((a, b) => b.date - a.date); // Newest first
};

export const getLastLog = (exerciseId: string): ExerciseLog | undefined => {
  const history = getHistoryForExercise(exerciseId);
  return history.length > 0 ? history[0] : undefined;
};

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getProfile = (): UserProfile | null => {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
};

// Plan Management
export const getPlans = (): WorkoutPlan[] => {
  const data = localStorage.getItem(PLANS_KEY);
  if (data) return JSON.parse(data);
  // Return Default Plans if empty
  return [
    { 
      id: 'ppl_push', 
      name: 'Push Power', 
      day: 'Monday', 
      exerciseIds: ['bench_press', 'incline_db_press'] 
    },
    { 
      id: 'ppl_pull', 
      name: 'Pull & Deadlift', 
      day: 'Wednesday', 
      exerciseIds: ['deadlift', 'rdl'] 
    },
    { 
      id: 'ppl_legs', 
      name: 'Leg Destruction', 
      day: 'Friday', 
      exerciseIds: ['squat', 'front_squat'] 
    }
  ];
};

export const savePlan = (plan: WorkoutPlan) => {
  const plans = getPlans();
  const index = plans.findIndex(p => p.id === plan.id);
  if (index >= 0) {
    plans[index] = plan;
  } else {
    plans.push(plan);
  }
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
};

export const deletePlan = (id: string) => {
  const plans = getPlans().filter(p => p.id !== id);
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
};