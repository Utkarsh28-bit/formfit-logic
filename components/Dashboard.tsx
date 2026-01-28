import React, { useState, useEffect } from 'react';
import { UserProfile, WorkoutPlan } from '../types';
import { calculateLevel, calculateProteinTarget } from '../services/workoutLogic';
import { Dumbbell, Utensils, Activity, ChevronRight, Wand2, BookOpen, Plus, Trash2, Calendar } from 'lucide-react';
import { EXERCISES } from '../constants';
import { getPlans, deletePlan } from '../services/storageService';

interface Props {
  profile: UserProfile;
  onStartWorkout: (plan?: WorkoutPlan) => void;
  onCreatePlan: () => void;
  onViewAnalytics: () => void;
  onDietPlan: () => void;
  onImageEditor: () => void;
  onViewExercise: (id: string) => void;
}

const Dashboard: React.FC<Props> = ({ profile, onStartWorkout, onCreatePlan, onViewAnalytics, onDietPlan, onImageEditor, onViewExercise }) => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const level = calculateLevel(profile.experienceYears);
  const protein = calculateProteinTarget(profile.weightKg);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    setPlans(getPlans());
  }, []);

  const handleDeletePlan = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this routine?')) {
      deletePlan(id);
      setPlans(getPlans());
    }
  };

  const todaysPlan = plans.find(p => p.day === today) || plans[0];

  return (
    <div className="p-6 max-w-xl mx-auto space-y-8 pb-20">
      <header className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Hi, {profile.name}</h1>
          <p className="text-slate-400 text-sm">Let's crush your goals today.</p>
        </div>
        <div className="h-10 w-10 bg-slate-700 rounded-full flex items-center justify-center text-emerald-400 font-bold border border-slate-600">
           {profile.name[0]}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-xs uppercase font-bold">Level</p>
          <p className="text-xl font-semibold text-white mt-1">{level}</p>
          <p className="text-xs text-slate-500 mt-1">{profile.experienceYears}y Exp</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-xs uppercase font-bold">Protein Goal</p>
          <p className="text-xl font-semibold text-emerald-400 mt-1">{protein}g</p>
          <p className="text-xs text-slate-500 mt-1">2g/kg Daily</p>
        </div>
      </div>

      {/* Hero: Next Workout */}
      <div 
        onClick={() => todaysPlan ? onStartWorkout(todaysPlan) : onStartWorkout()}
        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-xl shadow-blue-900/20 cursor-pointer transition-transform active:scale-95"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-blue-100 mb-2">
             <Calendar size={20} />
             <span className="font-medium">
                {todaysPlan && todaysPlan.day === today ? "Today's Schedule" : "Suggested Workout"}
             </span>
          </div>
          {todaysPlan ? (
             <>
                <h2 className="text-3xl font-bold text-white mb-1">{todaysPlan.name}</h2>
                <p className="text-blue-200 text-sm">{todaysPlan.exerciseIds.length} Exercises</p>
             </>
          ) : (
             <>
                <h2 className="text-3xl font-bold text-white mb-1">Quick Start</h2>
                <p className="text-blue-200 text-sm">Start a freestyle session</p>
             </>
          )}
          
          <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white">
            START SESSION <ChevronRight size={14} />
          </div>
        </div>
        <Dumbbell className="absolute -right-4 -bottom-4 text-white opacity-10 w-32 h-32 transform group-hover:rotate-12 transition-transform" />
      </div>

      {/* Routine Management */}
      <div>
         <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-white">My Routines</h3>
            <button 
              onClick={onCreatePlan}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-full font-bold border border-slate-700 flex items-center gap-1"
            >
              <Plus size={14} /> New
            </button>
         </div>
         
         <div className="grid gap-3">
           {plans.length === 0 && (
             <div className="p-8 text-center bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
               <p className="text-slate-500 text-sm">No routines created yet.</p>
             </div>
           )}
           {plans.map(plan => (
             <div 
               key={plan.id}
               onClick={() => onStartWorkout(plan)}
               className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all cursor-pointer active:scale-[0.99] group"
             >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                    {plan.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{plan.name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      {plan.day || 'Flexible'} • {plan.exerciseIds.length} Exercises
                    </p>
                  </div>
                </div>
                <button 
                  onClick={(e) => handleDeletePlan(e, plan.id)}
                  className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
             </div>
           ))}
         </div>
      </div>

      {/* Tools */}
      <div className="grid grid-cols-3 gap-3">
         <button 
           onClick={onDietPlan}
           className="bg-slate-800 hover:bg-slate-750 p-3 rounded-xl border border-slate-700 flex flex-col items-center justify-center gap-2 group h-24"
         >
            <div className="p-2 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-colors">
              <Utensils className="text-emerald-400" size={20} />
            </div>
            <span className="text-xs font-medium text-slate-300">Diet</span>
         </button>

         <button 
           onClick={onViewAnalytics}
           className="bg-slate-800 hover:bg-slate-750 p-3 rounded-xl border border-slate-700 flex flex-col items-center justify-center gap-2 group h-24"
         >
            <div className="p-2 bg-purple-500/10 rounded-full group-hover:bg-purple-500/20 transition-colors">
              <Activity className="text-purple-400" size={20} />
            </div>
            <span className="text-xs font-medium text-slate-300">Analytics</span>
         </button>

         <button 
           onClick={onImageEditor}
           className="bg-slate-800 hover:bg-slate-750 p-3 rounded-xl border border-slate-700 flex flex-col items-center justify-center gap-2 group h-24"
         >
            <div className="p-2 bg-pink-500/10 rounded-full group-hover:bg-pink-500/20 transition-colors">
              <Wand2 className="text-pink-400" size={20} />
            </div>
            <span className="text-xs font-medium text-slate-300">AI Studio</span>
         </button>
      </div>

      {/* Exercise Library */}
      <div>
        <div className="flex items-center gap-2 mb-4 text-white">
          <BookOpen size={20} className="text-slate-400" />
          <h3 className="font-bold text-lg">Exercise Library</h3>
        </div>
        <div className="space-y-3">
          {EXERCISES.map(exercise => (
            <div 
              key={exercise.id}
              onClick={() => onViewExercise(exercise.id)}
              className="flex items-center gap-4 p-3 bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all cursor-pointer active:scale-[0.98]"
            >
               <div className="w-12 h-12 bg-slate-700 rounded-lg overflow-hidden shrink-0">
                 <img src={exercise.gifUrl} alt={exercise.name} className="w-full h-full object-cover" />
               </div>
               <div className="flex-1">
                 <h4 className="font-bold text-white text-sm">{exercise.name}</h4>
                 <p className="text-xs text-slate-400">{exercise.muscleGroup} • {exercise.targetReps} reps target</p>
               </div>
               <ChevronRight size={16} className="text-slate-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;