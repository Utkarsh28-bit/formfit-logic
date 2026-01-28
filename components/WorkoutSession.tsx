import React, { useState, useEffect } from 'react';
import { Exercise, ExerciseLog, WorkoutTarget } from '../types';
import { calculateNextTarget } from '../services/workoutLogic';
import { getLastLog, saveLog } from '../services/storageService';
import { generateFormTip } from '../services/geminiService';
import { Timer, CheckCircle, AlertCircle, TrendingUp, Info, ArrowLeft, MoreHorizontal } from 'lucide-react';
import ExerciseDetail from './ExerciseDetail';

interface Props {
  exercise: Exercise;
  onFinish: () => void;
}

const WorkoutSession: React.FC<Props> = ({ exercise, onFinish }) => {
  const [log, setLog] = useState<Partial<ExerciseLog>>({
    weightUsed: 0,
    repsPerformed: 0,
    rpe: 7
  });
  const [target, setTarget] = useState<WorkoutTarget | null>(null);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Initialize Target on Mount
  useEffect(() => {
    const lastLog = getLastLog(exercise.id);
    const calculatedTarget = calculateNextTarget(lastLog, exercise.defaultWeight, exercise.targetReps);
    setTarget(calculatedTarget);
    
    // Set default input values to target for easier logging
    setLog({
      weightUsed: calculatedTarget.weight,
      repsPerformed: calculatedTarget.reps,
      rpe: 7
    });
  }, [exercise]);

  // Timer Effect
  useEffect(() => {
    if (isResting) {
      const interval = setInterval(() => {
        setRestTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isResting]);

  const handleLogSet = async () => {
    if (!log.weightUsed || !log.repsPerformed || !log.rpe) return;

    const newLog: ExerciseLog = {
      id: Date.now().toString(),
      exerciseId: exercise.id,
      date: Date.now(),
      weightUsed: log.weightUsed,
      repsPerformed: log.repsPerformed,
      rpe: log.rpe
    };

    saveLog(newLog);

    // AI Feedback trigger if struggling
    if (log.repsPerformed < exercise.targetReps || log.rpe > 8) {
       const tip = await generateFormTip(exercise.name, log.repsPerformed < exercise.targetReps ? 'Failed Reps' : 'High RPE');
       setAiTip(tip);
    }

    setIsResting(true);
    setRestTimer(0);
  };

  // If viewing details, show the detail component as a full-screen overlay
  if (showDetail) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900">
        <ExerciseDetail 
          exerciseId={exercise.id} 
          onBack={() => setShowDetail(false)}
          // No onStart because we are already in session
        />
      </div>
    );
  }

  if (!target) return <div className="p-8 text-center text-slate-400">Loading Intelligence...</div>;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 max-w-xl mx-auto min-h-screen">
      {/* 1. Header & Visual */}
      <div className="relative h-64 w-full bg-slate-800 overflow-hidden shrink-0">
        <img 
          src={exercise.gifUrl} 
          alt={exercise.name} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute top-4 right-4 z-10">
          <button 
             onClick={() => setShowDetail(true)}
             className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold hover:bg-black/80 transition-all"
          >
            <Info size={16} /> Details
          </button>
        </div>
        <div className="absolute top-4 left-4 z-10">
          <button onClick={onFinish} className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors">
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-900 to-transparent p-4">
          <h2 className="text-3xl font-bold text-white">{exercise.name}</h2>
          <p className="text-sm text-slate-300 flex items-center gap-2 truncate pr-4">
             {exercise.instructions}
          </p>
        </div>
      </div>

      {/* 2. The Algorithm's Target */}
      <div className="p-4 flex-1">
        <div className="bg-slate-800 border-l-4 border-emerald-500 rounded-r-lg p-4 shadow-lg mb-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Algorithmic Target</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-400">{target.weight} <span className="text-lg text-slate-400">kg</span></span>
                <span className="text-xl text-slate-500">x</span>
                <span className="text-3xl font-bold text-white">{target.reps} <span className="text-lg text-slate-400">reps</span></span>
              </div>
            </div>
            <div className="bg-emerald-500/10 p-2 rounded-lg">
                <TrendingUp className="text-emerald-400" size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 italic border-t border-slate-700 pt-2">
             "{target.reason}"
          </p>
        </div>

        {/* 3. Inputs */}
        {!isResting ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Weight (kg)</label>
                <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                   <button onClick={() => setLog(p => ({...p, weightUsed: (p.weightUsed || 0) - 2.5}))} className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-xl">-</button>
                   <input 
                      type="number" 
                      className="w-full bg-transparent text-center font-bold text-xl focus:outline-none"
                      value={log.weightUsed}
                      onChange={e => setLog({...log, weightUsed: Number(e.target.value)})}
                   />
                   <button onClick={() => setLog(p => ({...p, weightUsed: (p.weightUsed || 0) + 2.5}))} className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-xl">+</button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Reps</label>
                <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                   <button onClick={() => setLog(p => ({...p, repsPerformed: (p.repsPerformed || 0) - 1}))} className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-xl">-</button>
                   <input 
                      type="number" 
                      className="w-full bg-transparent text-center font-bold text-xl focus:outline-none"
                      value={log.repsPerformed}
                      onChange={e => setLog({...log, repsPerformed: Number(e.target.value)})}
                   />
                   <button onClick={() => setLog(p => ({...p, repsPerformed: (p.repsPerformed || 0) + 1}))} className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-xl">+</button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-slate-300">RPE (Difficulty 1-10)</label>
                <span className={`text-sm font-bold ${ (log.rpe || 0) > 8 ? 'text-red-400' : 'text-blue-400'}`}>
                   {(log.rpe || 0) > 8 ? 'Hard' : (log.rpe || 0) < 5 ? 'Easy' : 'Moderate'} ({log.rpe})
                </span>
              </div>
              <input 
                type="range" 
                min="1" max="10" 
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                value={log.rpe}
                onChange={e => setLog({...log, rpe: Number(e.target.value)})}
              />
              <div className="flex justify-between text-xs text-slate-500 px-1">
                <span>1 (Easy)</span>
                <span>10 (Fail)</span>
              </div>
            </div>

            <button 
              onClick={handleLogSet}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <CheckCircle size={20} /> Log Set
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-6 animate-in fade-in duration-500">
             <div className="relative flex items-center justify-center w-40 h-40 rounded-full border-4 border-slate-700 bg-slate-800 shadow-2xl">
                <Timer className="absolute text-slate-600 w-full h-full p-10 opacity-20" />
                <div className="text-4xl font-mono font-bold text-emerald-400">
                  {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}
                </div>
                <div className="absolute -bottom-8 text-sm text-slate-400">Resting...</div>
             </div>

             {aiTip && (
               <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl max-w-sm">
                 <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                   <AlertCircle size={16} /> Smart Feedback
                 </div>
                 <p className="text-sm text-slate-300">{aiTip}</p>
               </div>
             )}

             <button 
               onClick={() => { setIsResting(false); onFinish(); }} 
               className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium text-slate-200"
             >
               Next Exercise / Finish
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutSession;