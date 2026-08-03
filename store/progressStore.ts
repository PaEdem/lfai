import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ProgressState {
  streakDays: number;
  xpToday: number;
  dailyGoalXp: number;
  completedActivityIds: string[];
  completedLessonIds: string[];
  hasHydrated: boolean;
  completeActivity: (activityId: string, xpReward: number) => void;
  completeLesson: (lessonId: string) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      streakDays: 1,
      xpToday: 0,
      dailyGoalXp: 20,
      completedActivityIds: [],
      completedLessonIds: [],
      hasHydrated: false,
      completeActivity: (activityId, xpReward) =>
        set((state) =>
          state.completedActivityIds.includes(activityId)
            ? state
            : {
                completedActivityIds: [...state.completedActivityIds, activityId],
                xpToday: state.xpToday + xpReward,
              }
        ),
      completeLesson: (lessonId) =>
        set((state) =>
          state.completedLessonIds.includes(lessonId)
            ? state
            : { completedLessonIds: [...state.completedLessonIds, lessonId] }
        ),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        streakDays: state.streakDays,
        xpToday: state.xpToday,
        dailyGoalXp: state.dailyGoalXp,
        completedActivityIds: state.completedActivityIds,
        completedLessonIds: state.completedLessonIds,
      }),
    }
  )
);
