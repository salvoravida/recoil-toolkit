import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import { RecoilTunnel, RecoilReduxTunnel, getRecoilStore } from 'recoil-toolkit';
import { reduxStore } from './reduxStore';

ReactDOM.render(
   <RecoilRoot>
      <RecoilTunnel />
      <RecoilReduxTunnel reduxStore={reduxStore}>
         <ChakraProvider>
            <App />
         </ChakraProvider>
      </RecoilReduxTunnel>
   </RecoilRoot>,
   document.getElementById('root'),
);

getRecoilStore().then(store => {
   console.log('RecoilTunnel captured Recoil store :', store);
});
