import React, { useState } from 'react';
import { UserProfile, DietType, Allergy } from '../types';
import { INITIAL_PROFILE } from '../constants';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ ...profile, onboardingComplete: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-slate-100">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          FormFit Logic
        </h1>
        <p className="text-slate-400 mb-8">Configure your digital brain.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Display Name</label>
            <input
              required
              type="text"
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Alex"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Height (cm)</label>
              <input
                required
                type="number"
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={profile.heightCm}
                onChange={e => setProfile({ ...profile, heightCm: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Weight (kg)</label>
              <input
                required
                type="number"
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={profile.weightKg}
                onChange={e => setProfile({ ...profile, weightKg: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Experience (Years)</label>
            <input
              required
              type="number"
              step="0.5"
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={profile.experienceYears}
              onChange={e => setProfile({ ...profile, experienceYears: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Dietary Preference</label>
            <select
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={profile.diet}
              onChange={e => setProfile({ ...profile, diet: e.target.value as DietType })}
            >
              {Object.values(DietType).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Food Allergies</label>
            <select
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={profile.allergy}
              onChange={e => setProfile({ ...profile, allergy: e.target.value as Allergy })}
            >
              {Object.values(Allergy).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/30"
          >
            Generate My Plan
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
