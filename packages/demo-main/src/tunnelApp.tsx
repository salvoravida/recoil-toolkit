import React from 'react';
import ReactDOM from 'react-dom';
import { atom, RecoilRoot, useRecoilValue } from 'recoil';
import { getRecoilStore, RecoilTunnel } from 'recoil-toolkit';

const timeAtom = atom({
   key: 'timeAtom',
   default: new Date(),
});

export const CurrentTime = () => {
   const currentTime = useRecoilValue(timeAtom);
   return <p>{currentTime.toLocaleTimeString()}</p>;
};

ReactDOM.render(
   <RecoilRoot>
      <RecoilTunnel />
      <CurrentTime />
   </RecoilRoot>,
   document.getElementById('root'),
);

getRecoilStore().then(store => {
   console.log('RecoilTunnel captured Recoil store:', store);
   setInterval(() => {
      store.set(timeAtom, new Date());
   }, 999);
});
