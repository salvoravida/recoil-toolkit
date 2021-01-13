# recoil-toolkit
Recoil is the next generation state management library: CM safe, memoized, atomic, transactional. [recoiljs.org](https://recoiljs.org)

## ℹ️ Abstract
`recoil-toolkit` is a set of helpers for writing great apps with less effort.

What you get out of the box:

- task manager integrated
- loading stacks
- error stack
- immutable atomic updaters
- ... more coming soon... stay tuned!

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

## Todolist CRUD demo
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
