import { push, updateObj } from '../_core';
import { Task, TaskOptions, TaskStatus } from '../types';

export const pushTask = ({
   id,
   options,
   args,
   extra,
}: {
   id: number;
   options?: TaskOptions;
   args: ReadonlyArray<unknown>;
   extra?: any;
}) =>
   push({
      id,
      args,
      status: TaskStatus.Running,
      options,
      extra,
      startedAt: new Date(),
   } as Task);

export const updateTaskDone = ({ data, id }: { data?: any; id: number }) =>
   updateObj<Task>(
      { status: TaskStatus.Done, data, endAt: new Date() },
      {
         id,
      },
   );

export const updateTaskError = ({ error, id }: { error?: any; id: number }) =>
   updateObj<Task>({ status: TaskStatus.Error, error, endAt: new Date() } as Task, {
      id,
   });
