import { renderHook } from '@testing-library/react-hooks';
import { delay, uniqueId, useMountedRef } from '../src';

describe('core - helpers ', () => {
   test('uniqueId increment', () => {
      expect(uniqueId()).toBe(1);
      expect(uniqueId()).toBe(2);
   });

   test('delay effect', async () => {
      const begin = new Date().getTime();
      await delay(1000);
      const msElapsed = new Date().getTime() - begin;
      expect(msElapsed).toBeGreaterThanOrEqual(1000);
   });

   test('useMountedRef hook', () => {
      const { result, unmount } = renderHook(() => useMountedRef());
      expect(result.current).toEqual({ current: true });
      unmount();
      expect(result.current).toEqual({ current: false });
   });
});
