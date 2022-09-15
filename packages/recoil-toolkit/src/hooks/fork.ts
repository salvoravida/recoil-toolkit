import { uniqueId } from '../_core';
import { tasks, taskById } from '../atoms';
import type { Fork, RecoilTaskInterface, Task } from '../types';
import { pushTask, updateTaskDone, updateTaskError } from '../updaters';
import { cancelTask, createCancelled, createWaitFor } from './waitFor';

export const createFork =
   (parentId: number, recoil: Omit<RecoilTaskInterface, 'fork'>): Fork =>
   <Args extends ReadonlyArray<unknown>, Return = void>(
      taskCreator: (recoilTaskInterface: RecoilTaskInterface) => (...args: Args) => Return,
      args: Args,
      debugKey?: string,
   ) => {
      /* child task id */
      const id = uniqueId();
      const cancelledChild = createCancelled(id);
      const cancelled = () => recoil.cancelled() || cancelledChild();
      const cancel = () => cancelTask(id);
      const waitFor = createWaitFor(cancelled);

      /* injected current snapshot */
      const snapshot = recoil.getSnapshot();
      const childRecoil = {
         ...recoil,
         snapshot,
         waitFor,
         cancelled,
      };

      /* injected fork recursively */
      const fork = createFork(id, childRecoil);
      const execute = taskCreator({ ...childRecoil, fork });

      const childTaskObj = {
         parentId,
         id,
         args,
         options: debugKey ? { key: debugKey } : undefined,
      };

      const taskRunner = async () => {
         try {
            recoil.set(tasks, pushTask(childTaskObj));
            const data = await execute(...args);
            recoil.set(tasks, updateTaskDone({ data, id }));
            return data;
         } catch (error) {
            recoil.set(tasks, updateTaskError({ error, id }));
         }
      };

      /* run child task */
      const task = taskRunner();

      const getTaskState = () =>
         recoil.getLoadable(taskById(id)).getValue() as Task<Return> | undefined;

      return { id, cancel, task, getTaskState };
   };
