import { useEffect, useRef } from 'react';
import { RecoilValue, useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from 'recoil';
import { doCancelSignal } from './signals';

export type RecoilQueryValue<V> = {
   loading: boolean;
   data?: V;
   error?: unknown;
   refresh: () => void;
};

export type RecoilQueryOptions = {
   refreshOnMount?: 'always' | 'error';
   cancelOnUnmount?: boolean | (() => void);
};

//todo freeze options object

export const useRecoilQuery = <V>(
   selector: RecoilValue<V>,
   options?: RecoilQueryOptions,
): RecoilQueryValue<V> => {
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

   useEffect(() => {
      if (options?.refreshOnMount === 'always' || (options?.refreshOnMount === 'error' && error)) {
         !loading && refresh();
      }
   }, []); //eslint-disable-line

   useEffect(
      () => () => {
         if (options?.cancelOnUnmount === true) {
            doCancelSignal(selector.key);
         }
         if (typeof options?.cancelOnUnmount === 'function') {
            options?.cancelOnUnmount();
         }
      },
      [], //eslint-disable-line
   );

   return {
      loading,
      data: data !== undefined ? data : lastData.current,
      error,
      refresh,
   };
};
