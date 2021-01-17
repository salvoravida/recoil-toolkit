import React from 'react';
import ReactDOM from 'react-dom';
import { atom, RecoilRoot, useRecoilValue, useRecoilState, selector } from 'recoil';
import { inc, reduxSelector, ReduxTunnel, useReduxDispatch, useReduxSelector } from 'recoil-toolkit';

//reduxStore is a simple counter { counter:0 }
import { reduxStore } from './reduxStore';
const getReduxCount = (s: { count: number }) => s.count;

const counterAtom = atom({ key: 'counter', default: 0 });
const maxCounterType = selector<string>({
   key: 'maxCounter',
   get: ({ get }) => {
      const re = get(counterAtom);
      //reduxSelector allow recoil to reactive on redux selector change (memoized)
      const rx = get(reduxSelector(getReduxCount)) as number;
      return re === rx ? '' : re > rx ? 'recoil' : 'redux';
   },
});

function App() {
   const reduxCount = useReduxSelector(getReduxCount);
   const dispatch = useReduxDispatch();
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
      <ReduxTunnel reduxStore={reduxStore}>
         <App />
      </ReduxTunnel>
   </RecoilRoot>,
   document.getElementById('root'),
);
