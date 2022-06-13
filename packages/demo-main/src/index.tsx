import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { RecoilTunnel, ReduxBridge } from 'recoil-toolkit';
import { ChakraProvider } from '@chakra-ui/react';
import { CurrentTime } from './CurrentTime';
import { store } from './store';

import App from './App';

ReactDOM.render(
   <RecoilRoot>
     <RecoilTunnel >
       <ReduxBridge store={store}>
         <CurrentTime />
         <ChakraProvider>
           <App />
         </ChakraProvider>
       </ReduxBridge>
     </RecoilTunnel>
   </RecoilRoot>,
   document.getElementById('root'),
);
