import { ExerciseLog, WorkoutTarget } from '../types';

/**
 * The Core "Progressive Overload" Algorithm.
 * Decides the next workout's target based on the previous performance.
 */
export const calculateNextTarget = (
  lastLog: ExerciseLog | undefined,
  defaultWeight: number,
  targetReps: number
): WorkoutTarget => {
  // 1. No history? Start with defaults.
  if (!lastLog) {
    return {
      weight: defaultWeight,
      reps: targetReps,
      reason: "Calibration: Starting with baseline."
    };
  }

  const { weightUsed, repsPerformed, rpe } = lastLog;

  // 2. Scenario: User crushed it (Low RPE, hit reps).
  // Logic: "User is too strong. Increase weight."
  if (rpe < 7 && repsPerformed >= targetReps) {
    return {
      weight: weightUsed + 2.5,
      reps: targetReps,
      reason: "Progressive Overload: Previous set was easy (RPE < 7)."
    };
  }

  // 3. Scenario: User met the target but it was hard.
  // Logic: "Keep pushing, but don't increase weight yet."
  if (repsPerformed >= targetReps && rpe >= 7 && rpe <= 9) {
    return {
      weight: weightUsed,
      reps: targetReps,
      reason: "Maintenance: Good effort, reinforcing strength at this weight."
    };
  }

  // 4. Scenario: User failed to hit rep target or it was max effort.
  // Logic: "Deload or hold. Don't injure the user."
  if (repsPerformed < targetReps) {
    // If they missed by a lot (e.g., < 50% target), drop weight.
    if (repsPerformed < targetReps * 0.5) {
      return {
        weight: weightUsed - 5,
        reps: targetReps,
        reason: "Deload: Missed rep target significantly. Form check."
      };
    }
    // Just missed a few reps? Keep weight, try to match reps next time.
    return {
      weight: weightUsed,
      reps: repsPerformed, // Set the target to what they actually achieved to build confidence
      reason: "Adaptation: Matching previous rep max to build consistency."
    };
  }

  // Fallback
  return {
    weight: weightUsed,
    reps: targetReps,
    reason: "Standard: Maintaining target."
  };
};

export const calculateLevel = (years: number): string => {
  if (years < 1) return 'Beginner';
  if (years < 3) return 'Intermediate';
  return 'Advanced';
};

export const calculateProteinTarget = (weightKg: number): number => {
  // 2g per kg rule
  return Math.round(weightKg * 2);
};