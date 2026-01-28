import { Exercise, DietType, Allergy } from './types';

export const EXERCISES: Exercise[] = [
  {
    id: 'squat',
    name: 'Barbell Squat',
    // Using loremflickr to get an actual squat image or similar
    gifUrl: 'https://loremflickr.com/400/300/squat,gym/all', 
    defaultWeight: 60,
    targetReps: 8,
    muscleGroup: 'Legs',
    instructions: 'Keep chest up. Drive through heels. Maintain neutral spine.'
  },
  {
    id: 'front_squat',
    name: 'Front Squat',
    gifUrl: 'https://loremflickr.com/400/300/frontsquat,gym/all',
    defaultWeight: 40,
    targetReps: 8,
    muscleGroup: 'Legs',
    instructions: 'Rest bar on front delts. Keep elbows high. Squat deep keeping torso upright.'
  },
  {
    id: 'bench_press',
    name: 'Bench Press',
    gifUrl: 'https://loremflickr.com/400/300/benchpress,gym/all',
    defaultWeight: 40,
    targetReps: 10,
    muscleGroup: 'Push',
    instructions: 'Retract scapula. Lower bar to mid-chest. Press up explosively.'
  },
  {
    id: 'incline_db_press',
    name: 'Incline DB Press',
    gifUrl: 'https://loremflickr.com/400/300/dumbbellpress,gym/all',
    defaultWeight: 20,
    targetReps: 12,
    muscleGroup: 'Push',
    instructions: 'Set bench to 30 degrees. Press weights up converging slightly at top. Control descent.'
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    gifUrl: 'https://loremflickr.com/400/300/deadlift,gym/all',
    defaultWeight: 80,
    targetReps: 5,
    muscleGroup: 'Pull',
    instructions: 'Hinge at hips. Keep bar close to shins. Lock out hips at top.'
  },
  {
    id: 'rdl',
    name: 'Romanian Deadlift',
    gifUrl: 'https://loremflickr.com/400/300/deadlift,hamstrings/all',
    defaultWeight: 60,
    targetReps: 10,
    muscleGroup: 'Pull',
    instructions: 'Hinge primarily at hips with slight knee bend. Lower until hamstring stretch.'
  }
];

export const INITIAL_PROFILE = {
  name: '',
  heightCm: 180,
  weightKg: 75,
  experienceYears: 0,
  diet: DietType.VEG,
  allergy: Allergy.NONE,
  onboardingComplete: false
};