# recoil-toolkit
<p align="center">
  <a href="https://www.npmjs.com/package/recoil-toolkit"><img src="https://img.shields.io/npm/v/recoil-toolkit.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/recoil-toolkit"><img src="https://img.shields.io/npm/dt/recoil-toolkit.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/recoil-toolkit"><img src="./packages/recoil-toolkit/cov-badge.svg"></a><br/>
</p>

Recoil is the next generation state management library: CM safe, memoized, atomic, transactional. [recoiljs.org](https://recoiljs.org)

## ℹ️ Abstract
`recoil-toolkit` is a set of helpers, patterns and best practices about app state management (`recoil` based) for writing great apps with less effort.

What you get out of the box:

- 📈 task manager
- ⌚ loading states / loader stacks
- ❌ error states / error stack
- :atom: immutable updaters
- :boom: RecoilTunnel -> read/update a recoilStore outside of React
- :electron: ReduxTunnel -> mix redux and recoil selectors (gradually upgrade redux apps to recoil!)

and what is coming soon ...
- 🔜 advanced task manager - chrome dev tools
- 🔜 easy debugging long/duplicated/onError tasks
- 🔜 task statistics, kpi
- 🔜 reactive/observable pattern implementation
- :question: any idea? open an issue!

...stay tuned!

## 🧰 Installation

```bash
npm i recoil recoil-toolkit
# OR
yarn add recoil recoil-toolkit
```
## 📖 Table of contents

- [Core Concepts](https://github.com/salvoravida/recoil-toolkit#%EF%B8%8F-core-concepts)
- [State Management Pattern](https://github.com/salvoravida/recoil-toolkit#%EF%B8%8F-state-management-pattern)
  + [Tasks](https://github.com/salvoravida/recoil-toolkit#-tasks)
  + [Advanced Tasks](https://github.com/salvoravida/recoil-toolkit#-advanced-tasks)
  + [Immutable updaters](https://github.com/salvoravida/recoil-toolkit#wrench-immutable-updaters)
- [Recoil Tunnel](https://github.com/salvoravida/recoil-toolkit#boom-recoiltunnel)
- [Redux Tunnel](https://github.com/salvoravida/recoil-toolkit#electron-reduxtunnel)
- [Recoil vs Redux](https://github.com/salvoravida/recoil-toolkit#-recoil-vs-redux)
- [Demo Todolist CRUD](https://github.com/salvoravida/recoil-toolkit#-demo-todolist-crud)
- [Contributing](https://github.com/salvoravida/recoil-toolkit#-contributing)

## ❤️ Core Concepts 
*First of all: read the official recoil guide [recoiljs.org](https://recoiljs.org)*

- **Atom**: micro state 
- **Selector** : derived state from atoms and other selectors
- **Set**: function(atom, prev => next) set next atom value
- **Task**: async function that do something and can read(get)/write(set) to/from the store.

Simple use pattern with hooks:
```javascript
import { useRecoilState, useRecoilValue, useRecoilCallback } from 'recoil';
import { useRecoilTask } from 'recoil-toolkit';

const task = ({ set, reset, snapshot }) => async () => {
   // await do something and update store
};

//in your component ...
const [state, setState] = useRecoilState(atom);
const value = useRecoilValue(atomOrSelector);
//with recoil
const execute = useRecoilCallback(task,[]);
//with recoil-toolkit
const { loading, data, error, execute } = useRecoilTask(task, []);
```

## ⚙️ State Management Pattern

```
--------------------------------------------------------------------
|                                                                   |
---> atoms -> selectors -> view(hooks) -> set(sync)/tasks(async) --->
```

###  🕒 Tasks
Task is a core concept of `recoil-toolkit`.
Basically it's an async function (Promise) that have access to the store with a closure of `({ set, reset, snapshot })`.

```javascript
const task = ({ set, reset, snapshot }) => async () => {
   // await do something and update store
};
   
function Component(){ 
    //with recoil
    const execute = useRecoilCallback(task,[]);
    //with recoil-toolkit
    const { loading, data, error, execute } = useRecoilTask(task, []);
   
    return ...
}
```
Fetching data example:
```typescript
import { atom } from 'recoil';
import { RecoilTaskInterface, useRecoilTask } from 'recoil-toolkit';

const notifications = atom<{ id: number; text: string }[]>({
   key: 'notifications',
   default: [],
});

const getNotificationsTask = ({ set }: RecoilTaskInterface) => async () => {
   const body = await fetch('/api/notifications');
   const resp = await body.json();
   set(notifications, resp);
};

export const NotificationsView = () => {
   const { loading, data, error, execute: refresh } = useRecoilTask(getNotificationsTask, [], {
      dataSelector: notifications,
   });
   if (loading) return 'Loading…';
   if (error) return 'Sorry! Something went wrong. Please try again.';
   return (
      <div>
         <button onClick={refresh}>Refresh</button>
         {data.map(({ id, text }) => (
            <NotificationItem key={id} text={text} id={id} />
         ))}
      </div>
   );
};
```
Sending data example:
```typescript
const notificationRead = atomFamily<boolean, number>({
   key: 'notificationRead',
   default: false,
});

const notifyServerNotificationRead = ({ set }: RecoilTaskInterface) => async (id: number) => {
   await fetch('/api/notification-read', { body: JSON.stringify({ id }), method: 'POST' });
   set(notificationRead(id), true);
};

export const NotificationItem = ({ id, text }: { id: number; text: string }) => {
   const read = useRecoilValue(notificationRead(id));
   const { loading, error, execute: notify } = useRecoilTask(notifyServerNotificationRead, []);
   return (
      <div style={{ color: read ? 'green' : 'yellow' }}>
         <p>{text}</p>
         {!read && (
            <button disabled={loading} onClick={() => notify(id)}>
               {loading ? 'Sending ...' : 'Send Read'}
            </button>
         )}
         {error && 'Sorry, server error while set notification read!'}
      </div>
   );
};
```
Tasks composition: simple create macro tasks by composing micro tasks
```typescript
export const removeItemTask = (rti: RecoilTaskInterface) => async (id: number) => {
   // ...
};

export const editItemTask = (rti: RecoilTaskInterface) => async (item: Item) => {
   // ...
};

// task composition example
export const editAndRemoveTask = (rti: RecoilTaskInterface) => async (item: Item) => {
   await editItemTask(rti)(item);
   await removeItemTask(rti)(item.id);
};
```
### 🔨 Advanced Tasks
Task can have options for advanced use case.
```typescript
 type TaskOptions = {
   key?: string;
   errorStack?: boolean;
   loaderStack?: boolean | string;
   exclusive?: boolean;
};
```
Send error to global errorStack:
```typescript
import { useRecoilTask, useLastError } from 'recoil-toolkit';

export const useAdvancedTask = () =>
   useRecoilTask(advancedTask, [], {
      errorStack: true,
   });

// somewhere in your ui ...
const lastError = useLastError();
```
Use a common loader stack:
```typescript
import { useRecoilTask, useIsLoading } from 'recoil-toolkit';

export const useAdvancedTask1 = () =>
   useRecoilTask(advancedTask1, [], {
      loaderStack: true,
   });
   
export const useAdvancedTask2 = () =>
   useRecoilTask(advancedTask2, [], {
      loaderStack: true,
   });

// somewhere in your ui ...
const isGlobalLoading = useIsLoading();
```
loaderStack can be a string, so you can have many loader stacks if needed. 
```typescript
export const useAdvancedTask1 = () =>
   useRecoilTask(advancedTask1, [], {
      loaderStack: 'widgetA',
   });
export const useAdvancedTask2 = () =>
   useRecoilTask(advancedTask2, [], {
      loaderStack: 'widgetA',
   });

// somewhere in your ui ...
const isWidgetALoading = useIsLoading('widgetA');
```
Exclusive tasks (no double run): ComponentA, ComponentB read from the same task instance, that is exclusive. So if componentA already execute the task, componentB, will see the same loading, data, error.
```typescript
export const useAdvancedExclusiveTask = () =>
   useRecoilTask(advancedTask, [], {
      key:'advancedTask',  
      exclusive:true   // no double run
   });


function ComponentA(){
   const {loading, data, error, execute} = useAdvancedExclusiveTask();
   // ....
}

function ComponentB(){
   const {loading, data, error, execute} = useAdvancedExclusiveTask();
   // ....
}
```
### :wrench: Immutable updaters
Recoil atom set api need an immutable updater function, `recoil-toolkit` has a built in lib for common cases.
Number atoms:
```typescript
import { inc, dec, decAbs, show, hide } from '/recoil-toolkit';

export const counter = atom<number>({
   key: 'counter',
   default: 0,
});

set(counter, inc);     // set(counter, s=>s+1)
set(counter, dec);     // set(counter, s=>s-1)
set(counter, decAbs);  // dec to zero
set(counter, show);    // alias for inc (loader stack)
set(counter, hide);    // alias for decAbs (loader stack)
```
Boolean atoms:
```typescript
import { and, or, not, toggle } from '/recoil-toolkit';

export const flag = atom<boolean>({
   key: 'counter',
   default: false,
});

set(flag, and(value));    // set(counter, s=>s && !!value)
set(flag, or(value);      // set(counter, s=>s || !!value)
set(flag, not);           // set(counter, s=>!s)
set(flag, toggle);        // alias for not
```
Array atoms:
```typescript
import { push, pushTop, unshift, reverse, filter, updateObj, removeObj } from '/recoil-toolkit';

export const list = atom<any[]>({
   key: 'counter',
   default: [],
});

set(list, push(value));                 // push value to array and return a new array
set(list, unshift(value);               // insert at top and return a new array
set(list, pushTop(value);               // alias for unshift
set(list, reverse);                     // revers array and return a new array
set(list, filter(predicate));           // set(list, l=>l.filter(predicate)
set(list, updateObj(value, match));     // update item, based on match ({id} for example)
set(list, removeObj(value, match));     // remove item, based on match ({id} for example)
```

## :boom: RecoilTunnel
RecoilTunnel capture the current recoil store instance, and allow you to use it outside of React.
https://codesandbox.io/s/k6ri5

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { atom, RecoilRoot, useRecoilValue } from 'recoil';
import { getRecoilStore, RecoilTunnel } from 'recoil-toolkit';

const timeAtom = atom({
   key: 'timeAtom',
   default: new Date(),
});

export const CurrentTime = () => {
   const currentTime = useRecoilValue(timeAtom);
   return <p>{currentTime.toLocaleTimeString()}</p>;
};

ReactDOM.render(
   <RecoilRoot>
      <RecoilTunnel />
      <CurrentTime />
   </RecoilRoot>,
   document.getElementById('root'),
);

getRecoilStore().then(store => {
   console.log('RecoilTunnel captured Recoil store:', store);
   setInterval(() => {
      store.set(timeAtom, new Date());
   }, 999);
});
```

## :electron: ReduxTunnel
Read, Write from/to Redux. Mix redux and recoil selectors (gradually upgrade redux apps to recoil!)
https://zhb1x.csb.app/ - src: https://codesandbox.io/s/zhb1x

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { atom, RecoilRoot, useRecoilValue, useRecoilState, selector } from 'recoil';
import { inc, reduxSelector, ReduxTunnel, useReduxDispatch, useReduxSelector } from 'recoil-toolkit';

//reduxStore is a simple counter { counter:0 }
import { reduxStore } from './reduxStore';
const getReduxCount = (s: { count: number }) => s.count;

const counterAtom = atom({ key: 'counter', default: 0 });
const maxCounterType = selector<string>({
   key: 'maxCounter',
   get: ({ get }) => {
      const re = get(counterAtom);
      //reduxSelector allow recoil to reactive on redux selector change (memoized)
      const rx = get(reduxSelector(getReduxCount)) as number;
      return re === rx ? '' : re > rx ? 'recoil' : 'redux';
   },
});

function App() {
   const reduxCount = useReduxSelector(getReduxCount);  
   //useReduxSelector it's an alias of useRecoilValue(reduxSelector(sel))
   //const reduxCount = useRecoilValue(reduxSelector(getReduxCount)); 
   const dispatch = useReduxDispatch();
   const [counter, setCounter] = useRecoilState(counterAtom);
   const maxType = useRecoilValue(maxCounterType);
   return (
      <>
         <div>
            reduxCounter : {reduxCount}
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>dispatch</button>
         </div>
         <div>
            recoilCounter : {counter}
            <button onClick={() => setCounter(inc)}>dispatch</button>
         </div>
         <div>{maxType}</div>
      </>
   );
}

ReactDOM.render(
   <RecoilRoot>
      <ReduxTunnel reduxStore={reduxStore}>
         <App />
      </ReduxTunnel>
   </RecoilRoot>,
   document.getElementById('root'),
);
```
Note: you can use `react-redux` useSelector/useDispatch to access reduxStore, instead of useReduxSelector from `recoil-toolkit`, or both at same time.
https://codesandbox.io/s/czobq
## ⚡ Recoil vs Redux

|  | Recoil | Redux |
| --- |--- |---  |
|Performance|          ✅  **O(1)** |    ❌ O(n)|
|Concurrent Mode        |  ✅  **yes**       |      ❌ no|
|Combine states   |  ✅  **graph**      |     ❌ tree|
|Boilerplate       | ✅  **1x**     |       ❌  5x|
|Hooks           |✅  **built in**     |    💡 `react-redux`
|Async         |  ✅  **built in**     |   💡 `redux-saga`|
|Memoized       | ✅  **built in**     |💡 `reselect`|
|Dynamic store  | ✅  **built in**     |    💡 `injectReducer`|
|Can read Recoil states |  ✅  **yes**   | ❌ no|
|Can read Redux states |  💡 `recoil-toolkit`  | ✅  **yes**|
|Use outside React  |  💡 `recoil-toolkit`   | ✅  **yes**|
|Dev Tools |  ⚠️ wip...   | ✅  **yes**|

Performance: Recoil subscriptions are on atom/selector updaters, while in Redux are on all actions. So if you have N connected component and dispatch an action that should trigger only one component, even if re-render is stopped by useSelector optimization, redux have to execute N subscribtion callbacks.

Redux will never be cm safe, without performance issue (like re-rendering everything) because it hasn't the commit phase. 
`dispatch` is sync (instantly executed) while `set` is async, it enqueues updaters.

Atomic states design allow you more flexiblity while thinking your app as small autonomous building blocks (widgets) eventually interconnected if needed (atoms, selectors, graph connection)

You could have less than 5x boilerplate with redux, with many wrappers like RTK or redux-query, but even that you will write less code more powerful witn recoil. Set(atom, value), Execute Task are much more easy concepts to managed with , than dispatch, actions, reducers, sagas, etc...

ReduxTunnel (read redux states from recoil selectors) helps you to gradually migrate your redux monolithic app to recoil atomic states.

DevTools: ok redux-devtools are much mature than recoilize or some others for recoil. But it is only a matter of time ...


## 💥 Demo Todolist CRUD
live: https://8u0zc.csb.app  src: [codesandbox](https://codesandbox.io/s/recoil-toolkit-main-demo-8u0zc) - [github](https://github.com/salvoravida/recoil-toolkit/tree/master/packages/demo-main)

### atoms - selectors

```typescript
import { atom, atomFamily, selectorFamily } from 'recoil';

export const todoList = atom<Item[]>({
   key: 'todoList',
   default: [],
});

export const itemStatus = atomFamily<ItemStatus, number>({
   key: 'itemStatus',
   default: ItemStatus.Idle,
});

export const itemLocked = selectorFamily<boolean, number>({
   key: 'itemLocked',
   get: (id: number) => ({ get }) => get(itemStatus(id)) > ItemStatus.Editing,
```

### tasks
```typescript
import { delay, push, removeObj, updateObj, RecoilTaskInterface } from 'recoil-toolkit';
import { itemStatus, todoList } from './atoms';

export const getTodoListTask = ({ set }: RecoilTaskInterface) => async () => {
   const items = (await getRemoteTodoList()) as Item[];
   set(todoList, items);
};

export const addItemTask = ({ set }: RecoilTaskInterface) => async (text: string) => {
   const item = (await postRemoteTodoItem(text)) as Item;
   set(todoList, push(item));
};

export const removeItemTask = ({ set }: RecoilTaskInterface) => async (id: number) => {
   try {
      set(itemStatus(id), ItemStatus.Deleting);
      await delRemoteTodoItem(id);
      set(itemStatus(id), ItemStatus.Deleted);
      await delay(1000);
      set(todoList, removeObj<Item>({ id }));
   } catch (e) {
      set(itemStatus(id), ItemStatus.Idle);
      throw e;
   }
};

export const editItemTask = ({ set }: RecoilTaskInterface) => async (item: Item) => {
   try {
      set(itemStatus(item.id), ItemStatus.Saving);
      await putRemoteTodoItem(item);
      set(itemStatus(item.id), ItemStatus.Idle);
      set(todoList, updateObj(item, { id: item.id }));
   } catch (e) {
      set(itemStatus(item.id), ItemStatus.Editing);
      throw e;
   }
};

// task composition example
export const editAndRemoveTask = (cb: RecoilTaskInterface) => async (item: Item) => {
   await editItemTask(cb)(item);
   await removeItemTask(cb)(item.id);
};
```

### hooks
```typescript
import { useRecoilState, useRecoilValue } from 'recoil';
import { useRecoilTask } from 'recoil-toolkit';

export const useTodoList = () =>
   useRecoilTask(getTodoListTask, [], {
      dataSelector: todoList,
   });

export const useAddItemTask = () =>
   useRecoilTask(addItemTask, [], {
      loaderStack: 'addItemTask',
      errorStack: true,
   });

export const useRemoveItemTask = () => useRecoilTask(removeItemTask, []);
export const useEditItemTask = () => useRecoilTask(editItemTask, []);
```

### view
```typescript
 function Todolist() {
   const { loading, data, error } = useTodoList();
   return 
      //...
 }    

function TodoItemAdd() {
   const addItemTask = useAddItemTask();
   const inputRef = useRef<HTMLInputElement>(null);
   const addItem = () => {
      if (inputRef.current && inputRef.current.value) {
         addItemTask.execute(inputRef.current.value);
         inputRef.current.value = '';
      }
   };
   return 
      //...
 }

export function TodoItem({ id, text }: Item) {
   const editTask = useEditItemTask();
   const locked = useItemLocked(id);
   const [status, setStatus] = useItemStatus(id);
   return
   //...
}
```   


## 👏 Contributing

If you are interested in contributing to `recoil-toolkit`, open an issue or a pr!

## 🎉 Thanks

Thank You, Open Source!

## 📜 License

`recoil-toolkit` is 100% free and open-source, under [MIT](LICENSE).
