import React, { useEffect, useState } from 'react';
import { UserProfile, DailyDietPlan, DietMeal } from '../types';
import { generateDailyDietPlan } from '../services/geminiService';
import { ArrowLeft, Loader2, Leaf, ChefHat, Flame, UtensilsCrossed } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onBack: () => void;
}

const DietPlan: React.FC<Props> = ({ profile, onBack }) => {
  const [plan, setPlan] = useState<DailyDietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('Breakfast');

  useEffect(() => {
    const fetchDiet = async () => {
      const rec = await generateDailyDietPlan(profile);
      setPlan(rec);
      setLoading(false);
      // Ensure the active tab exists in the fetched plan, otherwise default to first
      if (rec && rec.meals.length > 0) {
        setActiveTab(rec.meals[0].type);
      }
    };
    fetchDiet();
  }, [profile]);

  const activeMeal = plan?.meals.find(m => m.type === activeTab);

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
           <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold">Chef Gemini</h2>
          <p className="text-xs text-slate-400">Daily Meal Plan & Recipes</p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
           <Loader2 className="animate-spin text-emerald-500" size={48} />
           <p className="text-slate-400 font-medium">Designing your menu...</p>
        </div>
      ) : plan ? (
        <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-700">
           
           {/* Summary Banner */}
           <div className="bg-slate-800 border-l-4 border-emerald-500 p-4 rounded-r-xl shadow-lg">
             <p className="text-sm text-slate-300 italic">"{plan.summary}"</p>
           </div>

           {/* Tabs */}
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
             {plan.meals.map((meal) => (
               <button
                 key={meal.type}
                 onClick={() => setActiveTab(meal.type)}
                 className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                   activeTab === meal.type 
                     ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' 
                     : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                 }`}
               >
                 {meal.type}
               </button>
             ))}
           </div>

           {/* Active Meal Content */}
           {activeMeal ? (
             <div className="space-y-6 key={activeMeal.type} animate-in fade-in duration-300">
                {/* Header Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 shadow-xl">
                   <div className="absolute top-0 right-0 p-6 opacity-10">
                     <ChefHat size={120} />
                   </div>
                   
                   <div className="relative z-10">
                     <div className="flex items-center gap-2 mb-2 text-emerald-400">
                        <UtensilsCrossed size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">{activeMeal.type}</span>
                     </div>
                     <h1 className="text-3xl font-bold text-white mb-2">{activeMeal.mealName}</h1>
                     <p className="text-slate-400">{activeMeal.description}</p>
                     
                     {/* Macros */}
                     <div className="flex gap-4 mt-6">
                        <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                          <Flame size={16} className="text-amber-500" />
                          <span className="font-bold text-white">{activeMeal.calories} <span className="text-xs font-normal text-slate-500">kcal</span></span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                          <Leaf size={16} className="text-blue-500" />
                          <span className="font-bold text-white">{activeMeal.protein}g <span className="text-xs font-normal text-slate-500">Pro</span></span>
                        </div>
                     </div>
                   </div>
                </div>

                {/* Ingredients & Instructions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Ingredients */}
                   <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <span className="bg-emerald-500/20 text-emerald-400 p-1 rounded">
                          <ChefHat size={16} />
                        </span>
                        Ingredients
                      </h3>
                      <ul className="space-y-3">
                        {activeMeal.ingredients.map((ing, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                             {ing}
                          </li>
                        ))}
                      </ul>
                   </div>

                   {/* Instructions */}
                   <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <span className="bg-blue-500/20 text-blue-400 p-1 rounded">
                          <UtensilsCrossed size={16} />
                        </span>
                        Recipe Steps
                      </h3>
                      <div className="space-y-4">
                        {activeMeal.instructions.map((step, idx) => (
                          <div key={idx} className="flex gap-3">
                             <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 text-xs font-bold text-slate-300 shrink-0">
                               {idx + 1}
                             </span>
                             <p className="text-sm text-slate-300 leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="text-center py-12 text-slate-500">Select a meal to view details.</div>
           )}

        </div>
      ) : (
        <div className="text-center text-slate-400">Failed to load diet plan.</div>
      )}
    </div>
  );
};

export default DietPlan;