import { useRecoilState, useRecoilValue } from 'recoil';
import { useRecoilTask } from 'recoil-toolkit';
import { itemLocked, itemStatus, todoList } from './atoms';
import {
   addItemTask,
   editAndRemoveTask,
   editItemTask,
   getTodoListTask,
   removeItemTask,
} from './tasks';

export const useItemStatus = (id: number) => useRecoilState(itemStatus(id));
export const useItemLocked = (id: number) => useRecoilValue(itemLocked(id));

export const useTodoList = () =>
   useRecoilTask(getTodoListTask, [], {
      dataSelector: todoList,
      autoStart: [],
   });

export const useAddItemTask = () =>
   useRecoilTask(addItemTask, [], {
      loaderStack: 'addItemTask',
      errorStack: true,
   });

export const useRemoveItemTask = () => useRecoilTask(removeItemTask, []);
export const useEditItemTask = () => useRecoilTask(editItemTask, []);
export const useEditAndRemoveTask = () => useRecoilTask(editAndRemoveTask, []);
