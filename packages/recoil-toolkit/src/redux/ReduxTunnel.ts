import { createElement, ReactNode, useEffect, useState } from 'react';
import { Store } from 'redux';
import { useRecoilCurrentSet } from '../_core';
import { reduxState } from './atoms';
import { RecoilReduxContext } from './context';

export function ReduxTunnel({ reduxStore, children }: { reduxStore: Store; children: ReactNode }) {
   const set = useRecoilCurrentSet();
   const [sub, setSub] = useState(false);
   useEffect(() => {
      const unsub = reduxStore.subscribe(() => {
         set(reduxState, reduxStore.getState());
      });
      set(reduxState, reduxStore.getState());
      setSub(true);
      return unsub;
   }, []);
   return createElement(RecoilReduxContext.Provider, {
      children: sub ? children : undefined,
      value: { store: reduxStore },
   });
}
