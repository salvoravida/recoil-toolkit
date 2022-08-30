import { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { reduxSelector } from './atoms';
import { RecoilReduxContext } from './context';
import { ReduxSelectorFunc } from './types';

export function useSelector(selector: ReduxSelectorFunc) {
   return useRecoilValue(reduxSelector(selector));
}

export function useDispatch() {
   const { store } = useContext(RecoilReduxContext);
   if (!store) throw new Error('RecoilReduxBridge with store not found!');
   return store.dispatch;
}
