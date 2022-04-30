import { useRecoilCallback, useRecoilValue } from 'recoil';
import { useRef, useState } from 'react';
import { uniqueId, hide, show } from '../_core';
import {
   lastTaskByKey,
   taskById,
   tasks,
   errorStack as errorStackAtom,
   loader,
   DEFAULT_LOADER,
} from '../atoms';
import { pushTask, updateTaskDone, updateTaskError, pushError } from '../updaters';
import { TaskOptions, TaskStatus, RecoilTaskInterface } from '../types';

export function useRecoilTask<Args extends ReadonlyArray<unknown>, Return = void, Data = unknown>(
   taskCreator: (a: RecoilTaskInterface) => (...args: Args) => Return,
   deps?: ReadonlyArray<unknown>,
   options?: TaskOptions<Data>,
) {
   const optionsRef = useRef(options || {}); //options freeze
   const { key, errorStack, loaderStack, exclusive, dataSelector } = optionsRef.current;

   if (exclusive && !key) {
      throw 'Exclusive tasks must have a key!';
   }

   const [taskId, setTaskId] = useState(0);
   const task = useRecoilValue(exclusive ? lastTaskByKey(key || '') : taskById(taskId));

   const taskData = dataSelector ? useRecoilValue(dataSelector) : task?.data;

   const execute = useRecoilCallback(
      ({ set, snapshot, ...rest }: RecoilTaskInterface) =>
         async (...args: Args) => {
            if (exclusive && key) {
               const t = snapshot.getLoadable(lastTaskByKey(key)).getValue();
               if (t && t.status === TaskStatus.Running) return;
            }
            const id = uniqueId();
            setTaskId(id);
            try {
               if (loaderStack)
                  set(loader(loaderStack === true ? DEFAULT_LOADER : loaderStack), show);
               set(tasks, pushTask({ id, options, args }));
               const data = await taskCreator({ set, snapshot, ...rest })(...args);
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

   return {
      loading: task?.status === TaskStatus.Running,
      execute,
      error: task?.error,
      data: taskData as Data,
      success: task?.status === TaskStatus.Done,
      taskId,
   };
}
