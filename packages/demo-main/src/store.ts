import { createStore } from 'redux';

export type State = { count: number };

// eslint-disable-next-line unicorn/no-object-as-default-parameter
export const store = createStore((state: State = { count: 0 }, action) => {
   switch (action.type) {
      case 'INCREMENT':
         return {
            count: state.count + 1,
         };
      case 'DECREMENT':
         return {
            count: state.count - 1,
         };
      default:
         return state;
   } // @ts-ignore
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
