import { delay } from '../_core';
import type { Cancelled, WaitFor } from '../types';

const cancelledTaskMap = new Map<number, boolean>();

export const createCancelled =
   (taskId: number): Cancelled =>
   () =>
      cancelledTaskMap.get(taskId) || false;

export const createWaitFor =
   (cancelled: () => boolean): WaitFor =>
   async <T>(promiseOrMs: Promise<T> | number): Promise<T | void> => {
      if (typeof promiseOrMs === 'number') {
         const d = promiseOrMs < 0 ? 0 : Math.trunc(promiseOrMs);
         const times = Math.trunc(d / 50);
         for (let i = 0; i < times; i++) {
            await delay(50);
            if (cancelled()) throw new Error('Cancelled!');
         }
         return;
      } else {
         const data = await promiseOrMs;
         if (cancelled()) throw new Error('Cancelled!');
         return data;
      }
   };

export const cancelTask = (taskId: number) => {
   cancelledTaskMap.set(taskId, true);
};
