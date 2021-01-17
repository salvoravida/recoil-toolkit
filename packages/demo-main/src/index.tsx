import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { RecoilTunnel, ReduxTunnel } from 'recoil-toolkit';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import { reduxStore } from './reduxStore';
import { CurrentTime } from './CurrentTime';

ReactDOM.render(
   <RecoilRoot>
      <RecoilTunnel />
      <ReduxTunnel reduxStore={reduxStore}>
         <CurrentTime />
         <ChakraProvider>
            <App />
         </ChakraProvider>
      </ReduxTunnel>
   </RecoilRoot>,
   document.getElementById('root'),
);
