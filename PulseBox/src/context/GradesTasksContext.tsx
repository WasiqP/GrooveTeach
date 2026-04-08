import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'groove_grades_tasks_v1';

export type TaskKind = 'quiz' | 'assignment' | 'project' | 'test';

export interface ClassTask {
  id: string;
  classId: string;
  title: string;
  kind: TaskKind;
  /** Short label e.g. "Due Fri" */
  dueLabel?: string;
  /** When the task was assigned (for Recent activity). */
  createdAt: string;
}

export interface TaskGradeRecord {
  id: string;
  classId: string;
  taskId: string;
  studentId: string;
  grade: string;
  status: 'graded' | 'pending' | 'missing';
}

type Store = {
  tasks: ClassTask[];
  grades: TaskGradeRecord[];
};

const SEED: Store = {
  tasks: [
    {
      id: 'task-m1-mid',
      classId: '1',
      title: 'Midterm quiz',
      kind: 'quiz',
      dueLabel: 'Oct 15',
      createdAt: '2024-10-01T12:00:00.000Z',
    },
    {
      id: 'task-m1-ps',
      classId: '1',
      title: 'Problem set 3',
      kind: 'assignment',
      dueLabel: 'Oct 18',
      createdAt: '2024-10-03T09:30:00.000Z',
    },
    {
      id: 'task-m1-lab',
      classId: '1',
      title: 'Lab report — motion',
      kind: 'project',
      dueLabel: 'Oct 22',
      createdAt: '2024-10-05T16:00:00.000Z',
    },
    {
      id: 'task-e1-essay',
      classId: '2',
      title: 'Essay draft',
      kind: 'assignment',
      dueLabel: 'Oct 20',
      createdAt: '2024-10-02T11:00:00.000Z',
    },
    {
      id: 'task-e1-vocab',
      classId: '2',
      title: 'Vocabulary test',
      kind: 'test',
      dueLabel: 'Oct 12',
      createdAt: '2024-09-28T14:00:00.000Z',
    },
  ],
  grades: [
    // Mathematics 101 — class 1, students s1–s3
    { id: 'g1', classId: '1', taskId: 'task-m1-mid', studentId: 's1', grade: '92%', status: 'graded' },
    { id: 'g2', classId: '1', taskId: 'task-m1-mid', studentId: 's2', grade: '88%', status: 'graded' },
    { id: 'g3', classId: '1', taskId: 'task-m1-mid', studentId: 's3', grade: '76%', status: 'graded' },
    { id: 'g4', classId: '1', taskId: 'task-m1-ps', studentId: 's1', grade: 'A−', status: 'graded' },
    { id: 'g5', classId: '1', taskId: 'task-m1-ps', studentId: 's2', grade: 'B+', status: 'graded' },
    { id: 'g6', classId: '1', taskId: 'task-m1-ps', studentId: 's3', grade: '—', status: 'missing' },
    { id: 'g7', classId: '1', taskId: 'task-m1-lab', studentId: 's1', grade: '18/20', status: 'graded' },
    { id: 'g8', classId: '1', taskId: 'task-m1-lab', studentId: 's2', grade: '17/20', status: 'graded' },
    { id: 'g9', classId: '1', taskId: 'task-m1-lab', studentId: 's3', grade: 'Pending', status: 'pending' },
    // English — class 2, students s4–s5
    { id: 'g10', classId: '2', taskId: 'task-e1-essay', studentId: 's4', grade: 'B', status: 'graded' },
    { id: 'g11', classId: '2', taskId: 'task-e1-essay', studentId: 's5', grade: 'A−', status: 'graded' },
    { id: 'g12', classId: '2', taskId: 'task-e1-vocab', studentId: 's4', grade: '40/45', status: 'graded' },
    { id: 'g13', classId: '2', taskId: 'task-e1-vocab', studentId: 's5', grade: '42/45', status: 'graded' },
  ],
};

type GradesTasksContextValue = {
  tasks: ClassTask[];
  grades: TaskGradeRecord[];
  isLoading: boolean;
  getGrade: (classId: string, taskId: string, studentId: string) => TaskGradeRecord | undefined;
  getTasksForClass: (classId: string) => ClassTask[];
};

const GradesTasksContext = createContext<GradesTasksContextValue | undefined>(undefined);

export const GradesTasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<ClassTask[]>([]);
  const [grades, setGrades] = useState<TaskGradeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (raw) {
          const parsed = JSON.parse(raw) as Store;
          const loaded = (parsed.tasks ?? []).map((t) => ({
            ...t,
            createdAt: t.createdAt ?? new Date(0).toISOString(),
          }));
          setTasks(loaded);
          setGrades(parsed.grades ?? []);
        } else {
          setTasks(SEED.tasks);
          setGrades(SEED.grades);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
        }
      } catch (e) {
        console.warn('GradesTasks load failed', e);
        setTasks(SEED.tasks);
        setGrades(SEED.grades);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const getGrade = useCallback(
    (classId: string, taskId: string, studentId: string) =>
      grades.find((g) => g.classId === classId && g.taskId === taskId && g.studentId === studentId),
    [grades],
  );

  const getTasksForClass = useCallback(
    (classId: string) => tasks.filter((t) => t.classId === classId).sort((a, b) => a.title.localeCompare(b.title)),
    [tasks],
  );

  const value = useMemo(
    () => ({
      tasks,
      grades,
      isLoading,
      getGrade,
      getTasksForClass,
    }),
    [tasks, grades, isLoading, getGrade, getTasksForClass],
  );

  return <GradesTasksContext.Provider value={value}>{children}</GradesTasksContext.Provider>;
};

export function useGradesTasks(): GradesTasksContextValue {
  const ctx = useContext(GradesTasksContext);
  if (!ctx) {
    throw new Error('useGradesTasks must be used within GradesTasksProvider');
  }
  return ctx;
}
