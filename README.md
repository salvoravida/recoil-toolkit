# recoil-toolkit
<p align="center">
  <a href="https://www.npmjs.com/package/recoil-toolkit"><img src="https://img.shields.io/npm/v/recoil-toolkit.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/recoil-toolkit"><img src="https://img.shields.io/npm/dt/recoil-toolkit.svg?style=flat-square"></a><br/>
</p>

Recoil is the next generation state management library: CM safe, memoized, atomic, transactional. [recoiljs.org](https://recoiljs.org)

## ℹ️ Abstract
`recoil-toolkit` is a set of helpers for writing great apps with less effort.

What you get out of the box:

- 📈 task manager
- ⌚ loading stacks
- ❌ error stack
- :atom: immutable atomic updaters
- :boom: RecoilTunnel -> use recoil from outside React

🔜 more coming soon... stay tuned!

## 🧰 Installation

```bash
npm i recoil recoil-toolkit
# OR
yarn add recoil recoil-toolkit
```
## 📖 Documentation

- [Api guide](https://github.com/salvoravida/recoil-toolkit/tree/master/docs) (work in progress...)

## ⚙️ State Management Pattern

```
--------------------------------------------------------------------
|                                                                   |
---> atoms -> selectors -> view(hooks) -> set(sync)/tasks(async) --->
```
### Tasks
Task is a core concept of `recoil-toolkit`. It's an async function (Promise) with a closure of RecoilTaskInterface ```typescript ({ set, reset, snapshot })```.
Fetching Data Sample:
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
            <Notification key={id} text={text} id={id} />
         ))}
      </div>
   );
};
```
Send Data Sample:
```typescript
const notificationRead = atomFamily<boolean, number>({
   key: 'notificationRead',
   default: false,
});

const notifyServerNotificationRead = ({ set }: RecoilTaskInterface) => async (id: number) => {
   await fetch('/api/notification-read', { body: JSON.stringify({ id }), method: 'POST' });
   set(notificationRead(id), true);
};

export const Notification = ({ id, text }: { id: number; text: string }) => {
   const read = useRecoilValue(notificationRead(id));
   const { loading, execute: notify } = useRecoilTask(notifyServerNotificationRead, []);
   return (
      <div style={{ color: read ? 'green' : 'yellow' }}>
         <p>{text}</p>
         {!read && (
            <button disabled={loading} onClick={() => notify(id)}>
               {loading ? 'Sending ...' : 'Send Read'}
            </button>
         )}
      </div>
   );
};
```
### Advanced Task 
... writing in progres ...

---
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
