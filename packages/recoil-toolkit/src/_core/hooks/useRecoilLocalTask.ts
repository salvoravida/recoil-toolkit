import { useState } from 'react';
import { useRecoilCallback, CallbackInterface } from 'recoil';
import { useMountedRef } from '../helpers';

type LocalTaskState = {
   loading: boolean;
   error?: any;
   data?: any;
   success: boolean;
};

export function useRecoilLocalTask<Args extends ReadonlyArray<unknown>, Return>(
   taskCreator: (a: CallbackInterface) => (...args: Args) => Return,
   deps?: ReadonlyArray<unknown>,
) {
   const mounted = useMountedRef();
   const [task, setTask] = useState<LocalTaskState>({
      loading: false,
      error: undefined,
      data: undefined,
      success: false,
   });
   const execute = useRecoilCallback(
      (b: CallbackInterface) => async (...args: Args) => {
         try {
            if (mounted.current) {
               setTask(t => ({
                  ...t,
                  error: undefined,
                  success: false,
                  loading: true,
               }));
            }
            const data = await taskCreator(b)(...args);
            if (mounted.current) {
               setTask(t => ({
                  ...t,
                  data,
                  success: true,
                  loading: false,
               }));
            }
         } catch (error) {
            if (mounted.current) {
               setTask(t => ({
                  ...t,
                  error,
                  loading: false,
               }));
            }
         }
      },
      deps,
   );
   return { ...task, execute };
}
