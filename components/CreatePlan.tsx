import React, { useState } from 'react';
import { EXERCISES } from '../constants';
import { WorkoutPlan } from '../types';
import { savePlan } from '../services/storageService';
import { ArrowLeft, Save, Plus, Check } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSave: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Flexible'];

const CreatePlan: React.FC<Props> = ({ onBack, onSave }) => {
  const [name, setName] = useState('');
  const [day, setDay] = useState('Flexible');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleExercise = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSave = () => {
    if (!name || selectedIds.length === 0) return;
    const newPlan: WorkoutPlan = {
      id: Date.now().toString(),
      name,
      day: day === 'Flexible' ? undefined : day,
      exerciseIds: selectedIds
    };
    savePlan(newPlan);
    onSave();
  };

  return (
    <div className="p-6 max-w-xl mx-auto min-h-screen bg-slate-900 text-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
       {/* Header */}
       <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700">
           <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Create Routine</h2>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pb-20">
        <div>
           <label className="block text-sm font-medium text-slate-400 mb-2">Routine Name</label>
           <input 
             value={name}
             onChange={e => setName(e.target.value)}
             placeholder="e.g., Chest & Tris"
             className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-lg font-medium focus:border-blue-500 outline-none text-white placeholder:text-slate-600"
             autoFocus
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-400 mb-2">Schedule Day</label>
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {DAYS.map(d => (
                <button
                  key={d}
                  onClick={() => setDay(d)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border ${
                    day === d 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
           </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-400 mb-2">Select Exercises ({selectedIds.length})</label>
           <div className="space-y-2">
             {EXERCISES.map(ex => {
               const isSelected = selectedIds.includes(ex.id);
               return (
                 <div 
                   key={ex.id}
                   onClick={() => toggleExercise(ex.id)}
                   className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all ${
                     isSelected 
                       ? 'bg-blue-600/10 border-blue-500' 
                       : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                   }`}
                 >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                       isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-500 bg-slate-800'
                    }`}>
                       {isSelected ? <Check size={14} className="text-white" /> : <Plus size={14} className="text-slate-500" />}
                    </div>
                    <img src={ex.gifUrl} className="w-12 h-12 rounded-lg object-cover opacity-80 bg-slate-700" alt={ex.name} />
                    <div>
                      <p className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>{ex.name}</p>
                      <p className="text-xs text-slate-500">{ex.muscleGroup}</p>
                    </div>
                 </div>
               )
             })}
           </div>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-800 backdrop-blur-sm bg-slate-900/80">
        <button 
          onClick={handleSave}
          disabled={!name || selectedIds.length === 0}
          className="w-full py-4 bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
        >
          <Save size={20} /> Save Routine
        </button>
      </div>
    </div>
  );
};

export default CreatePlan;