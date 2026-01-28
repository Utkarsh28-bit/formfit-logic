export enum DietType {
  VEG = 'Vegetarian',
  VEGAN = 'Vegan',
  NON_VEG = 'Non-Vegetarian',
  EGGETARIAN = 'Eggetarian'
}

export enum Allergy {
  NONE = 'None',
  MILK = 'Milk/Lactose',
  NUTS = 'Nuts',
  GLUTEN = 'Gluten',
  SOY = 'Soy'
}

export interface UserProfile {
  name: string;
  heightCm: number;
  weightKg: number;
  experienceYears: number;
  diet: DietType;
  allergy: Allergy;
  onboardingComplete: boolean;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  date: number; // Timestamp
  weightUsed: number;
  repsPerformed: number;
  rpe: number; // 1-10
}

export interface WorkoutTarget {
  weight: number;
  reps: number;
  reason: string; // Explanation for the target (e.g., "Progressive Overload", "Maintenance")
}

export interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  defaultWeight: number;
  targetReps: number;
  muscleGroup: 'Push' | 'Pull' | 'Legs';
  instructions: string;
}

export interface DietMeal {
  type: string; // 'Breakfast', 'Lunch', 'Dinner', 'Snack'
  mealName: string;
  description: string;
  calories: number;
  protein: number;
  ingredients: string[];
  instructions: string[];
}

export interface DailyDietPlan {
  meals: DietMeal[];
  summary: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  day?: string; // e.g., 'Monday'
  exerciseIds: string[];
}