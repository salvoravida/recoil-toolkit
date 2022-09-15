import { useEffect, useRef, useState } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import type { CallbackInterface } from 'recoil';
import {
   uniqueId,
   hide,
   show,
   useRecoilCurrentSnapshot,
   useRecoilCurrentGetLoadable,
} from '../_core';
import {
   lastTaskByKey,
   taskById,
   tasks,
   errorStack as errorStackAtom,
   loader,
   DEFAULT_LOADER,
} from '../atoms';
import type { TaskOptions, RecoilTaskInterface } from '../types';
import { TaskStatus } from '../types';
import { pushTask, updateTaskDone, updateTaskError, pushError } from '../updaters';
import { createFork } from './fork';
import { cancelTask, createCancelled, createWaitFor } from './waitFor';

export function useRecoilTask<Args extends ReadonlyArray<unknown>, Return = void, Data = unknown>(
   taskCreator: (a: RecoilTaskInterface) => (...args: Args) => Return,
   deps?: ReadonlyArray<unknown>,
   options?: TaskOptions<Data, Args>,
) {
   const optionsRef = useRef(options || {}); //options freeze
   const { cancelOnUnmount, key, errorStack, loaderStack, exclusive, dataSelector, autoStart } =
      optionsRef.current;

   if (exclusive && !key) {
      throw new Error('Exclusive tasks must have a key!');
   }

   const [taskId, setTaskId] = useState(0);
   const task = useRecoilValue(exclusive ? lastTaskByKey(key || '') : taskById(taskId));

   // eslint-disable-next-line react-hooks/rules-of-hooks
   const taskData = dataSelector ? useRecoilValue(dataSelector) : task?.data;

   const getSnapshot = useRecoilCurrentSnapshot();

   const getLoadable = useRecoilCurrentGetLoadable();

   const execute = useRecoilCallback(
      ({ set, snapshot, ...rest }: CallbackInterface) =>
         async (...args: Args) => {
            if (exclusive && key) {
               const t = snapshot.getLoadable(lastTaskByKey(key)).getValue();
               if (t && t.status === TaskStatus.Running) return;
            }
            const id = uniqueId();
            setTaskId(id);

            const cancelled = createCancelled(id);
            const waitFor = createWaitFor(cancelled);
            const fork = createFork(id, {
               cancelled,
               waitFor,
               getSnapshot,
               getLoadable,
               set,
               snapshot,
               ...rest,
            });
            try {
               if (loaderStack)
                  set(loader(loaderStack === true ? DEFAULT_LOADER : loaderStack), show);
               set(tasks, pushTask({ id, options, args }));
               const data = await taskCreator({
                  fork,
                  cancelled,
                  waitFor,
                  getSnapshot,
                  getLoadable,
                  set,
                  snapshot,
                  ...rest,
               })(...args);
               set(tasks, updateTaskDone({ data, id }));
            } catch (error) {
               set(tasks, updateTaskError({ error, id }));
               if (errorStack) {
                  set(errorStackAtom, pushError({ key, error, taskId: id }));
               }
            } finally {
               if (loaderStack)
                  set(loader(loaderStack === true ? DEFAULT_LOADER : loaderStack), hide);
            }
         },
      deps,
   );

   useEffect(() => {
      if (autoStart) {
         execute(...autoStart);
      }
   }, [execute]);

   useEffect(() => {
      if (cancelOnUnmount && taskId) {
         return () => {
            cancelTask(taskId);
         };
      }
   }, [taskId]);

   return {
      loading: task?.status === TaskStatus.Running,
      execute,
      error: task?.error,
      data: taskData as Data,
      success: task?.status === TaskStatus.Done,
      taskId,
   };
}
