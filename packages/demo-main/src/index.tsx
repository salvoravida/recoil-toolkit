import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';

ReactDOM.render(
   <RecoilRoot>
      <ChakraProvider>
         <App />
      </ChakraProvider>
   </RecoilRoot>,
   document.getElementById('root'),
);
