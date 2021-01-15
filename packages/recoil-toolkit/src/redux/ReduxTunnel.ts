import { createContext, createElement, useContext, useEffect } from 'react';
import { Store } from 'redux';
import { useRecoilCurrentSet } from '../_core';
import { reduxState } from './atoms';

export function ReduxTunnel({ reduxStore }: { reduxStore: Store }) {
   const set = useRecoilCurrentSet();
   useEffect(() => {
      const unsubscribe = reduxStore.subscribe(() => {
         set(reduxState, reduxStore.getState());
      });
      set(reduxState, reduxStore.getState());
      return unsubscribe;
   }, []);
   return null;
}

const RecoilReduxContext = createContext<{ store?: Store }>({});

export function RecoilReduxTunnel({ reduxStore, children }: { reduxStore: Store; children: any }) {
   const set = useRecoilCurrentSet();
   useEffect(() => {
      const unsubscribe = reduxStore.subscribe(() => {
         set(reduxState, reduxStore.getState());
      });
      set(reduxState, reduxStore.getState());
      return unsubscribe;
   }, []);
   return createElement(RecoilReduxContext.Provider, { children, value: { store: reduxStore } });
}

export const useReduxDispatch = () => {
   const reduxContext = useContext(RecoilReduxContext);
   const reduxStore = reduxContext.store;
   if (!reduxStore) throw 'RecoilReduxContext with reduxStore not found!';
   return reduxStore.dispatch;
};
