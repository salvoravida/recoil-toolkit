import React, { createElement, useEffect, useState } from 'react';
import { Store } from 'redux';
import { useRecoilCurrentSet } from '../_core';
import { reduxState } from './atoms';
import { RecoilReduxContext } from './context';

export const ReduxBridge: React.FC<{ store: Store }> = ({ store, children }) => {
   const set = useRecoilCurrentSet();
   const [sub, setSub] = useState(false);
   useEffect(() => {
      const unsub = store.subscribe(() => {
         set(reduxState, store.getState());
      });
      set(reduxState, store.getState());
      setSub(true);
      return unsub;
   }, []);
   return createElement(RecoilReduxContext.Provider, {
      children: sub ? children : undefined,
      value: { store },
   });
};
