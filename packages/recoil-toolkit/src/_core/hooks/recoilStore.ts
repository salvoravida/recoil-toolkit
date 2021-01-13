import { Snapshot, useRecoilCallback } from 'recoil';
import { RecoilGetLoadable, RecoilGetPromise } from '../../types';

export const useRecoilCurrentGetPromise = (): RecoilGetPromise =>
   useRecoilCallback(({ snapshot: { getPromise } }) => getPromise, []);

export const useRecoilCurrentGetLoadable = (): RecoilGetLoadable =>
   useRecoilCallback(({ snapshot: { getLoadable } }) => getLoadable, []);

export const useRecoilCurrentSnap = (): (() => Snapshot) =>
   useRecoilCallback(({ snapshot }) => () => snapshot, []);

export const useRecoilCurrentGet = useRecoilCurrentGetPromise;
