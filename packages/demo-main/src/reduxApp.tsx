import React from 'react';
import ReactDOM from 'react-dom';
import { atom, RecoilRoot, useRecoilValue, useRecoilState, selector } from 'recoil';
import { inc, reduxSelector, ReduxBridge, useDispatch, useSelector } from 'recoil-toolkit';
import { store, State } from './store';

const getReduxCount = (s: State) => s.count;

const counterAtom = atom({ key: 'counter', default: 0 });

const maxCounterType = selector<string>({
   key: 'maxCounter',
   get: ({ get }) => {
      const re = get(counterAtom);
      const rx = get(reduxSelector(getReduxCount)) as number;
      return re === rx ? '' : re > rx ? 'recoil' : 'redux';
   },
});

function App() {
   const reduxCount = useSelector(getReduxCount);
   const dispatch = useDispatch();
   const [counter, setCounter] = useRecoilState(counterAtom);
   const maxType = useRecoilValue(maxCounterType);
   return (
      <>
         <div>
            reduxCounter : {reduxCount}
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>dispatch</button>
         </div>
         <div>
            recoilCounter : {counter}
            <button onClick={() => setCounter(inc)}>dispatch</button>
         </div>
         <div>{maxType}</div>
      </>
   );
}

ReactDOM.render(
   <RecoilRoot>
      <ReduxBridge store={store}>
         <App />
      </ReduxBridge>
   </RecoilRoot>,
   document.getElementById('root'),
);
