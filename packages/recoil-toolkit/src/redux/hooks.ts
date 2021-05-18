import { useRecoilValue } from 'recoil';
import { useContext } from 'react';
import { reduxSelector } from './atoms';
import { ReduxSelectorFunc } from './types';
import { RecoilReduxContext } from './context';

export function useSelector(selector: ReduxSelectorFunc) {
   return useRecoilValue(reduxSelector(selector));
}

export function useDispatch() {
   const { store } = useContext(RecoilReduxContext);
   if (!store) throw new Error('ReduxBridge with store not found!');
   return store.dispatch;
}
