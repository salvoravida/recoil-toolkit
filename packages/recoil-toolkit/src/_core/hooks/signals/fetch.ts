import { addCancelSignal } from './store';

export function getFetchSignal(key: string) {
   const newAbortController = new AbortController();
   addCancelSignal(key, {
      signal: newAbortController.signal,
      cancel: () => {
         newAbortController.abort();
      },
   });
   return newAbortController.signal;
}
