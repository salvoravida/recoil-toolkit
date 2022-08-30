import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { RecoilTunnel, RecoilReduxBridge, RecoilDevTools } from 'recoil-toolkit';
import App from './App';
import { CurrentTime } from './CurrentTime';
import { store } from './store';

const container = document.getElementById('root');

if (container) {
   ReactDOM.createRoot(container).render(
      <React.StrictMode>
         <RecoilRoot>
            <RecoilDevTools />
            <RecoilTunnel>
               <RecoilReduxBridge store={store}>
                  <CurrentTime />
                  <ChakraProvider>
                     <App />
                  </ChakraProvider>
               </RecoilReduxBridge>
            </RecoilTunnel>
         </RecoilRoot>
      </React.StrictMode>,
   );
}
