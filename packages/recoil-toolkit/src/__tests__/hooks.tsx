import React from 'react';
import { atom, RecoilRoot, useRecoilValue } from 'recoil';
import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import { RecoilTaskInterface } from '../types';
import { useRecoilTask, delay, useRecoilRequest } from '../index';

const requestAtom = atom({
   key: 'requestAtom',
   default: 0,
});

const useRequest = () => {
   const id = useRecoilValue(requestAtom);
   const inc = useRecoilRequest(requestAtom);
   return { id, inc };
};
const notifications = atom<{ id: number; text: string }[]>({
   key: 'notifications',
   default: [],
});

const getNotificationsTask = ({ set }: RecoilTaskInterface) => async () => {
   await delay(500);
   set(notifications, [{ id: 1, text: 'string' }]);
};

const useNotificationsTask = () => {
   return useRecoilTask(getNotificationsTask, [], {
      dataSelector: notifications,
      loaderStack: 'notify',
      errorStack: true,
      exclusive: true,
      key: 'notificationTask',
   });
};

describe('hooks tests ', () => {
   test('useRecoilRequest', () => {
      const wrapper = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;
      const { result } = renderHook(() => useRequest(), { wrapper });
      expect(result.current.id).toEqual(0);
      act(() => {
         result.current.inc();
      });
      expect(result.current.id).toEqual(1);
   });

   test('useRecoilTask', async () => {
      const wrapper = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;
      const { result, waitForNextUpdate } = renderHook(() => useNotificationsTask(), { wrapper });
      act(() => {
         result.current.execute();
      });
      expect(result.current.loading).toEqual(true);
      await waitForNextUpdate();
      expect(result.current.data).toEqual([{ id: 1, text: 'string' }]);
   });
});
