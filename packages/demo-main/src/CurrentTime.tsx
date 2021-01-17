import React from 'react';
import { atom, useRecoilValue } from 'recoil';
import { getRecoilStore } from 'recoil-toolkit';

const timeAtom = atom({
   key: 'timeAtom',
   default: new Date(),
});

export const CurrentTime = () => {
   const currentTime = useRecoilValue(timeAtom);
   return (
      <p style={{ margin: '20px', fontSize: '20px', textAlign: 'right', fontWeight: 'bold' }}>
         {currentTime.toLocaleTimeString()}
      </p>
   );
};

getRecoilStore().then(store => {
   console.log('RecoilTunnel captured Recoil store:', store);
   setInterval(() => {
      store.set(timeAtom, new Date());
   }, 999);
});
