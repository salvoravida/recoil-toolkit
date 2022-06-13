import { useEffect, useRef } from 'react';
import { RecoilValue, useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from 'recoil';

export type RecoilAsyncValue<V> = {
   loading: boolean;
   data?: V;
   error?: unknown;
   refresh: () => void;
};

export type RecoilAsyncValueOptions = { refreshOnMount?: 'always' | 'error' };

export const useRecoilAsyncValue = <V>(
   selector: RecoilValue<V>,
   options?: RecoilAsyncValueOptions,
): RecoilAsyncValue<V> => {
   const { state, contents } = useRecoilValueLoadable<V>(selector);
   const loading = state === 'loading';
   const error = state === 'hasError' ? contents : undefined;
   const data = (state === 'hasValue' ? contents : undefined) as V;

   const lastData = useRef<V>();

   useEffect(() => {
      if (data !== undefined) {
         lastData.current = data;
      }
   }, [data]);

   const refresh = useRecoilRefresher_UNSTABLE(selector);

   /* refresh on mount */
   useEffect(() => {
      if (options?.refreshOnMount === 'always' || (options?.refreshOnMount === 'error' && error)) {
         refresh();
      }
   }, []); //eslint-disable-line

   return {
      loading,
      data: data !== undefined ? data : lastData.current,
      error,
      refresh,
   };
};
