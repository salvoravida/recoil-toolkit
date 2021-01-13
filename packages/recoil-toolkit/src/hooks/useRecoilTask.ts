import { useRecoilCallback, useRecoilValue } from 'recoil';
import { useRef } from 'react';
import { uniqueId, hide, show } from '../_core';
import { lastTaskByKey, taskById, tasks, errorStack as errorStackAtom, loader } from '../atoms';
import { pushTask, updateTaskDone, updateTaskError, pushError } from '../updaters';
import { TaskOptions, TaskStatus, RecoilTaskInterface } from '../types';

export function useRecoilTask<Args extends ReadonlyArray<unknown>, Return>(
   taskCreator: (a: RecoilTaskInterface) => (...args: Args) => Return,
   deps?: ReadonlyArray<unknown>,
   options?: TaskOptions,
) {
   const optionsRef = useRef(options || {}); //options freeze
   const { key, errorStack, loaderStack, exclusive } = optionsRef.current;

   if (exclusive && !key) {
      throw 'Exclusive tasks must have a key!';
   }

   const taskId = useRef(0);
   const task = useRecoilValue(exclusive ? lastTaskByKey(key || '') : taskById(taskId.current));

   const execute = useRecoilCallback(
      ({ set, snapshot, ...rest }: RecoilTaskInterface) => async (...args: Args) => {
         if (exclusive && key) {
            const t = snapshot.getLoadable(lastTaskByKey(key)).getValue();
            if (t && t.status === TaskStatus.Running) return;
         }
         const id = uniqueId();
         taskId.current = id;
         try {
            if (loaderStack) set(loader(loaderStack), show);
            set(tasks, pushTask({ id, options, args }));
            const data = await taskCreator({ set, snapshot, ...rest })(...args);
            set(tasks, updateTaskDone({ data, id }));
         } catch (error) {
            set(tasks, updateTaskError({ error, id }));
            if (errorStack) {
               set(errorStackAtom, pushError({ key, error, taskId: id }));
            }
         } finally {
            if (loaderStack) set(loader(loaderStack), hide);
         }
      },
      deps,
   );

   return {
      loading: task && task.status === TaskStatus.Running,
      execute,
      error: task && task.error,
      data: task && task.data,
      success: task && task.status === TaskStatus.Done,
      taskId: taskId.current,
   };
}
