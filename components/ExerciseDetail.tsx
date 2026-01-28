import React from 'react';
import { ArrowLeft, History, Trophy, Info, Play, TrendingUp, Calendar } from 'lucide-react';
import { EXERCISES } from '../constants';
import { getHistoryForExercise, getLastLog } from '../services/storageService';
import { calculateNextTarget } from '../services/workoutLogic';

interface Props {
  exerciseId: string;
  onBack: () => void;
  onStart?: () => void;
}

const ExerciseDetail: React.FC<Props> = ({ exerciseId, onBack, onStart }) => {
  const exercise = EXERCISES.find(e => e.id === exerciseId);
  
  if (!exercise) return <div className="p-6 text-white">Exercise not found</div>;

  const history = getHistoryForExercise(exerciseId);
  const lastLog = getLastLog(exerciseId);
  const target = calculateNextTarget(lastLog, exercise.defaultWeight, exercise.targetReps);
  
  const maxWeight = history.reduce((max, log) => Math.max(max, log.weightUsed), 0);
  const totalSets = history.length;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 animate-in slide-in-from-right duration-300 min-h-screen">
      {/* Header */}
      <div className="relative h-64 w-full bg-slate-800 shrink-0">
        <img 
          src={exercise.gifUrl} 
          alt={exercise.name} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute top-4 left-4 z-10">
          <button onClick={onBack} className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors">
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-6">
          <h1 className="text-3xl font-bold text-white mb-1">{exercise.name}</h1>
          <span className="inline-block px-2 py-1 bg-blue-600/20 text-blue-400 text-xs font-bold rounded uppercase">
            {exercise.muscleGroup}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Next Target Card */}
        <div className="bg-slate-800 border-l-4 border-emerald-500 rounded-r-xl p-5 shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
             <TrendingUp size={100} />
           </div>
           <p className="text-xs uppercase tracking-wider text-slate-400 mb-1 font-bold">Next Target</p>
           <div className="flex items-baseline gap-2 mb-2 relative z-10">
              <span className="text-4xl font-bold text-white">{target.weight}<span className="text-lg text-slate-500 ml-1">kg</span></span>
              <span className="text-slate-600">x</span>
              <span className="text-2xl font-bold text-emerald-400">{target.reps}<span className="text-lg text-slate-500 ml-1">reps</span></span>
           </div>
           <p className="text-sm text-slate-400 italic">"{target.reason}"</p>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Info size={18} className="text-blue-400" /> Form Cues
          </h3>
          <p className="text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700 leading-relaxed">
            {exercise.instructions}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
             <div className="flex items-center gap-2 text-amber-400 mb-1">
               <Trophy size={16} /> <span className="text-xs font-bold uppercase">PB</span>
             </div>
             <p className="text-2xl font-bold text-white">{maxWeight > 0 ? `${maxWeight}kg` : '-'}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
             <div className="flex items-center gap-2 text-purple-400 mb-1">
               <History size={16} /> <span className="text-xs font-bold uppercase">Logs</span>
             </div>
             <p className="text-2xl font-bold text-white">{totalSets}</p>
          </div>
        </div>

        {/* History List */}
        <div>
           <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
             <Calendar size={18} className="text-slate-400" /> Recent History
           </h3>
           <div className="space-y-3">
             {history.length === 0 ? (
               <div className="text-center py-8 text-slate-500 text-sm">No logs yet. Start training!</div>
             ) : (
               history.map((log) => (
                 <div key={log.id} className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700/50">
                    <div>
                      <p className="text-slate-400 text-xs mb-1">
                        {new Date(log.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                      </p>
                      <div className="font-bold text-white">
                        {log.weightUsed}kg <span className="text-slate-500 font-normal">x {log.repsPerformed}</span>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${log.rpe > 8 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                         RPE {log.rpe}
                       </span>
                    </div>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
      
      {/* Start Button (only if onStart provided) */}
      {onStart && (
        <div className="p-4 bg-slate-900 border-t border-slate-800 sticky bottom-0">
           <button 
             onClick={onStart}
             className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
           >
             <Play size={20} fill="currentColor" /> Start Session
           </button>
        </div>
      )}
    </div>
  );
};

export default ExerciseDetail;