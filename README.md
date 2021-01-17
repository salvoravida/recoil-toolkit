# recoil-toolkit
<p align="center">
  <a href="https://www.npmjs.com/package/recoil-toolkit"><img src="https://img.shields.io/npm/v/recoil-toolkit.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/recoil-toolkit"><img src="https://img.shields.io/npm/dt/recoil-toolkit.svg?style=flat-square"></a><br/>
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
## 📖 Documentation

- [Api guide](https://github.com/salvoravida/recoil-toolkit/tree/master/docs) (work in progress...)

## ❤️ Core Concepts 
*read also the official recoil guide [recoiljs.org](https://recoiljs.org)*

- **Atom**: micro state 
- **Selector** : derived state from atoms and other selectors
- **Set**: function(microState, prev => next) dispatch micro updates
- **Task**: async function that do something and can read(get)/write(set) to/from the store.

Simple use pattern with hooks:
```javascript
const [state, setState] = useRecoilState(atom);
const value = useRecoilValue(atomOrSelector);
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
const task = ({ set, reset, snapshot }) => async ({}) => {
   // await do something and update store
};
   
function Component(){ 
    //recoil standard use
    const executeTask = useRecoilCallback(task,[]);
    //recoil-toolkit use
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
### 🔨 Advanced Task Concepts

... writing in progress ...

## :boom: RecoilTunnel
RecoilTunnel capture the current recoil store instance, and allow you to use it outside of React.

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

```typescript
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
