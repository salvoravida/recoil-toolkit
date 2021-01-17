import { createStore } from 'redux';

export const reduxStore = createStore((state: { count: number } = { count: 0 }, action) => {
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
   }// @ts-ignore
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
