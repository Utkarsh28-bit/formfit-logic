import React from 'react';
import { getLogs } from '../services/storageService';
import { EXERCISES } from '../constants';
import { Trophy, Clock, Dumbbell, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  startTime: number | null;
  onClose: () => void;
}

const WorkoutSummary: React.FC<Props> = ({ startTime, onClose }) => {
  const endTime = Date.now();
  const durationMs = startTime ? endTime - startTime : 0;
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  
  const allLogs = getLogs();
  // Filter logs that happened since start time
  // If startTime is null, it means no set was logged, so no session logs.
  const sessionLogs = startTime ? allLogs.filter(log => log.date >= startTime) : [];

  // Calculate stats
  const totalVolume = sessionLogs.reduce((acc, log) => acc + (log.weightUsed * log.repsPerformed), 0);
  const totalSets = sessionLogs.length;
  
  // Group by exercise
  const exerciseStats = sessionLogs.reduce((acc, log) => {
     if (!acc[log.exerciseId]) {
       acc[log.exerciseId] = { sets: 0, maxWeight: 0, totalReps: 0 };
     }
     acc[log.exerciseId].sets += 1;
     acc[log.exerciseId].totalReps += log.repsPerformed;
     if (log.weightUsed > acc[log.exerciseId].maxWeight) {
       acc[log.exerciseId].maxWeight = log.weightUsed;
     }
     return acc;
  }, {} as Record<string, { sets: number, maxWeight: number, totalReps: number }>);

  const exercisesPerformed = Object.keys(exerciseStats).map(id => {
    const ex = EXERCISES.find(e => e.id === id);
    return {
      name: ex ? ex.name : 'Unknown Exercise',
      ...exerciseStats[id]
    };
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-500">
      
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 text-center relative overflow-hidden">
         {/* Confetti / Decoration Background */}
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500"></div>
         <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
         <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>

         <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 border-4 border-slate-800 shadow-xl">
               <Trophy size={40} />
            </div>
         </div>

         <h1 className="text-3xl font-bold text-white mb-2">Workout Complete!</h1>
         <p className="text-slate-400 mb-8">Great job putting in the work.</p>

         <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
               <Clock className="mx-auto mb-2 text-blue-400" size={24} />
               <p className="text-2xl font-bold text-white">{minutes}:{seconds.toString().padStart(2, '0')}</p>
               <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Duration</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
               <Dumbbell className="mx-auto mb-2 text-purple-400" size={24} />
               <p className="text-2xl font-bold text-white">{(totalVolume / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-500">tons</span></p>
               <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Volume</p>
            </div>
         </div>

         <div className="text-left mb-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Session Summary</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
               {exercisesPerformed.map((ex, idx) => (
                 <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                       <CheckCircle2 size={14} className="text-emerald-500" />
                       <span className="font-medium text-white">{ex.name}</span>
                    </div>
                    <div className="text-slate-400">
                       {ex.sets} sets <span className="mx-1">•</span> Max {ex.maxWeight}kg
                    </div>
                 </div>
               ))}
               {exercisesPerformed.length === 0 && (
                 <p className="text-slate-500 text-center text-xs italic">No exercises logged.</p>
               )}
            </div>
         </div>

         <button 
           onClick={onClose}
           className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all active:scale-95 group"
         >
           Return to Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default WorkoutSummary;