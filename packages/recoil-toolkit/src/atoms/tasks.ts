import { atom, selector, selectorFamily, useRecoilValue } from 'recoil';
import { Task, TaskStatus } from '../types';

export const tasks = atom<Task[]>({
   key: 'recoil-toolkit/tasks',
   default: [],
});

export const runningTasks = selector<Task[]>({
   key: 'recoil-toolkit/runningTasks',
   get: ({ get }) => get(tasks).filter(t => t.status === TaskStatus.Running),
});

export const taskById = selectorFamily<Task | undefined, number>({
   key: 'recoil-toolkit/taskById',
   get: (id: number) => ({ get }) => {
      return get(tasks).find(t => t.id === id);
   },
});

export const lastTaskByKey = selectorFamily<Task | undefined, string>({
   key: 'recoil-toolkit/lastTaskType',
   get: (key: string) => ({ get }) => {
      return get(tasks)
         .filter(t => t?.options?.key === key)
         .pop();
   },
});

export const useRunningTasks = () => useRecoilValue(runningTasks);
