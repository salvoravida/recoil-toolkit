import { useCallback } from 'react';
import { RecoilState, useSetRecoilState } from 'recoil';
import { inc } from '../updaters';

export const useRecoilRequest = (request: RecoilState<number>) => {
   const setRequestId = useSetRecoilState(request);
   return useCallback(() => {
      setRequestId(inc);
   }, [setRequestId]);
};
