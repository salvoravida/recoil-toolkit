import Axios from 'axios';
import { addCancelSignal } from './store';

export function getAxiosToken(key: string) {
   const newTokenSource = Axios.CancelToken.source();
   addCancelSignal(key, {
      signal: newTokenSource.token,
      cancel: () => {
         newTokenSource.cancel();
      },
   });
   return newTokenSource.token;
}
