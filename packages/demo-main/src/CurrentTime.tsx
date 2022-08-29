import React from 'react';
import { atom, useRecoilValue } from 'recoil';
import { delay, getRecoilStore, set } from 'recoil-toolkit';

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

export async function clockService() {
   while (true) {
      await delay(999);
      set(timeAtom, new Date());
   }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
getRecoilStore().then(store => {
   console.log('RecoilTunnel captured Recoil store:', store);
   clockService();
});
