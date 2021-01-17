import { createContext } from 'react';
import { Store } from 'redux';

export const RecoilReduxContext = createContext<{ store?: Store }>({});
