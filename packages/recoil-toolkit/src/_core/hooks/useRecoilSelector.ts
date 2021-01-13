import { useEffect, useRef } from 'react';
import { useRecoilValueLoadable, RecoilValue } from 'recoil';

export const useRecoilSelector = <V>(selector: RecoilValue<V>) => {
   const { state, contents } = useRecoilValueLoadable<V>(selector);
   const loading = state === 'loading';
   const error = state === 'hasError' ? contents : undefined;
   const data = (state === 'hasValue' ? contents : undefined) as V;
   const lastData = useRef<V>();

   useEffect(() => {
      if (data) {
         lastData.current = data;
      }
   }, [data]);

   return {
      loading,
      data: data || lastData.current,
      error,
   };
};
