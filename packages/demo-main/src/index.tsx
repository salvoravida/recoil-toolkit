import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { RecoilTunnel, ReduxBridge } from 'recoil-toolkit';
import App from './App';
import { CurrentTime } from './CurrentTime';
import { store } from './store';

const container = document.getElementById('root');

if (container) {
   ReactDOM.createRoot(container).render(
      <React.StrictMode>
         <RecoilRoot>
            <RecoilTunnel>
               <ReduxBridge store={store}>
                  <CurrentTime />
                  <ChakraProvider>
                     <App />
                  </ChakraProvider>
               </ReduxBridge>
            </RecoilTunnel>
         </RecoilRoot>
      </React.StrictMode>,
   );
}
