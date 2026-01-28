import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getHistoryForExercise } from '../services/storageService';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const Analytics: React.FC<Props> = ({ onBack }) => {
  const history = getHistoryForExercise('squat'); // Hardcoded for demo
  
  // Format data for Recharts (reverse to show chronological order)
  const data = [...history].reverse().map(log => ({
    date: new Date(log.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}),
    weight: log.weightUsed,
    reps: log.repsPerformed
  }));

  return (
    <div className="p-6 max-w-xl mx-auto min-h-screen bg-slate-900 text-slate-100">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700">
           <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Progress Logic</h2>
      </div>

      <div className="space-y-8">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
           <h3 className="text-lg font-medium text-slate-300 mb-4">Squat Max (Weight)</h3>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={data}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                 <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                 <YAxis stroke="#94a3b8" fontSize={12} domain={['dataMin - 5', 'dataMax + 5']} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                   itemStyle={{ color: '#34d399' }}
                 />
                 <Line 
                   type="monotone" 
                   dataKey="weight" 
                   stroke="#34d399" 
                   strokeWidth={3} 
                   dot={{ fill: '#34d399', strokeWidth: 2 }} 
                   activeDot={{ r: 8 }}
                 />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
           <h3 className="text-lg font-medium text-slate-300 mb-2">Performance Summary</h3>
           {data.length > 1 ? (
              <div className="space-y-4">
                 <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <span className="text-slate-400">Starting Weight</span>
                    <span className="font-mono">{data[0].weight} kg</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <span className="text-slate-400">Current Weight</span>
                    <span className="font-mono font-bold text-emerald-400">{data[data.length - 1].weight} kg</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Gain</span>
                    <span className="font-mono text-emerald-400">+{data[data.length - 1].weight - data[0].weight} kg</span>
                 </div>
              </div>
           ) : (
             <p className="text-slate-500 text-sm">Not enough data yet. Complete more workouts!</p>
           )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
