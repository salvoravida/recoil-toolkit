import Axios from 'axios';
import { addCancelSignal } from 'recoil-toolkit';

export function getAxiosToken(key) {
   const newTokenSource = Axios.CancelToken.source();
   addCancelSignal(key, {
      signal: newTokenSource.token,
      cancel: () => {
         newTokenSource.cancel();
      },
   });
   return newTokenSource.token;
}
