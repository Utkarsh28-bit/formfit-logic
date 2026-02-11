import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import WorkoutSession from './components/WorkoutSession';
import Analytics from './components/Analytics';
import DietPlan from './components/DietPlan';
import ImageEditor from './components/ImageEditor';
import ExerciseDetail from './components/ExerciseDetail';
import CreatePlan from './components/CreatePlan';
import EditProfile from './components/EditProfile';
import WorkoutSummary from './components/WorkoutSummary';
import { UserProfile, WorkoutPlan, Exercise } from './types';
import { getProfile, saveProfile } from './services/storageService';
import { EXERCISES } from './constants';

enum View {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  WORKOUT = 'WORKOUT',
  ANALYTICS = 'ANALYTICS',
  DIET = 'DIET',
  IMAGE_EDITOR = 'IMAGE_EDITOR',
  EXERCISE_DETAIL = 'EXERCISE_DETAIL',
  CREATE_PLAN = 'CREATE_PLAN',
  EDIT_PROFILE = 'EDIT_PROFILE',
  WORKOUT_SUMMARY = 'WORKOUT_SUMMARY'
}

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.ONBOARDING);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  
  // Workout State
  const [workoutQueue, setWorkoutQueue] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Load profile on startup
  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile && savedProfile.onboardingComplete) {
      setProfile(savedProfile);
      setView(View.DASHBOARD);
    }
  }, []);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    saveProfile(newProfile);
    setProfile(newProfile);
    setView(View.DASHBOARD);
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    saveProfile(updatedProfile);
    setProfile(updatedProfile);
    setView(View.DASHBOARD);
  };

  const handleViewExercise = (id: string) => {
    setSelectedExerciseId(id);
    setView(View.EXERCISE_DETAIL);
  };

  const startSingleExercise = (id: string) => {
    const ex = EXERCISES.find(e => e.id === id);
    if (ex) {
       setWorkoutQueue([ex]);
       setCurrentExerciseIndex(0);
       setSessionStartTime(null);
       setView(View.WORKOUT);
    }
  };

  const startPlan = (plan?: WorkoutPlan) => {
    if (!plan) {
      // Freestyle start (just first exercise default)
      setWorkoutQueue([EXERCISES[0]]);
    } else {
      const queue = plan.exerciseIds
        .map(id => EXERCISES.find(e => e.id === id))
        .filter(Boolean) as Exercise[];
      
      if (queue.length > 0) {
        setWorkoutQueue(queue);
      } else {
        setWorkoutQueue([EXERCISES[0]]); // Fallback
      }
    }
    setCurrentExerciseIndex(0);
    setSessionStartTime(null);
    setView(View.WORKOUT);
  };

  const renderView = () => {
    switch (view) {
      case View.ONBOARDING:
        return <Onboarding onComplete={handleOnboardingComplete} />;
      
      case View.DASHBOARD:
        if (!profile) return null;
        return (
          <Dashboard 
            profile={profile}
            onStartWorkout={startPlan}
            onCreatePlan={() => setView(View.CREATE_PLAN)}
            onViewAnalytics={() => setView(View.ANALYTICS)}
            onDietPlan={() => setView(View.DIET)}
            onImageEditor={() => setView(View.IMAGE_EDITOR)}
            onViewExercise={handleViewExercise}
            onEditProfile={() => setView(View.EDIT_PROFILE)}
          />
        );

      case View.EDIT_PROFILE:
        if (!profile) return null;
        return (
          <EditProfile 
            currentProfile={profile} 
            onSave={handleProfileUpdate} 
            onCancel={() => setView(View.DASHBOARD)} 
          />
        );

      case View.CREATE_PLAN:
        return (
          <CreatePlan 
            onBack={() => setView(View.DASHBOARD)}
            onSave={() => setView(View.DASHBOARD)}
          />
        );

      case View.WORKOUT:
        const currentExercise = workoutQueue[currentExerciseIndex] || EXERCISES[0];
        if (!currentExercise) return <div className="p-8 text-white">Exercise not found</div>;

        return (
          <WorkoutSession 
            exercise={currentExercise} 
            sessionStartTime={sessionStartTime}
            onFirstActivity={() => {
              if (!sessionStartTime) setSessionStartTime(Date.now());
            }}
            onFinish={() => {
              if (currentExerciseIndex < workoutQueue.length - 1) {
                // Next exercise in queue
                setCurrentExerciseIndex(prev => prev + 1);
              } else {
                // Finished queue, show summary
                setView(View.WORKOUT_SUMMARY);
                // We keep the queue for now so the summary might hypothetically access it, but session logs are time-based
              }
            }} 
          />
        );

      case View.WORKOUT_SUMMARY:
        return (
          <WorkoutSummary 
            startTime={sessionStartTime} 
            onClose={() => {
              setView(View.DASHBOARD);
              setWorkoutQueue([]);
              setCurrentExerciseIndex(0);
            }} 
          />
        );

      case View.ANALYTICS:
        return <Analytics onBack={() => setView(View.DASHBOARD)} />;

      case View.DIET:
        if (!profile) return null;
        return <DietPlan profile={profile} onBack={() => setView(View.DASHBOARD)} />;

      case View.IMAGE_EDITOR:
        return <ImageEditor onBack={() => setView(View.DASHBOARD)} />;

      case View.EXERCISE_DETAIL:
        if (!selectedExerciseId) return <div>Error</div>;
        return (
          <ExerciseDetail 
            exerciseId={selectedExerciseId} 
            onBack={() => setView(View.DASHBOARD)}
            onStart={() => startSingleExercise(selectedExerciseId)}
          />
        );

      default:
        return <div>Error: Unknown View</div>;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-900 text-slate-100">
      {renderView()}
    </div>
  );
};

export default App;