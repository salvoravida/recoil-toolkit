import { useRecoilTask } from 'recoil-toolkit';
import { Item } from '../server';
import { useRecoilState, useRecoilValue } from 'recoil';
import { itemLocked, itemStatus, todoList } from './atoms';
import {
   addItemTask,
   editAndRemoveTask,
   editItemTask,
   getTodoListTask,
   removeItemTask,
} from './tasks';

export const useGetTodoListTask = () => useRecoilTask(getTodoListTask, []);

export const useTodoList = () => {
   return {
      ...useGetTodoListTask(),
      data: useRecoilValue<Item[]>(todoList),
   };
};

export const useItemStatus = (id: number) => useRecoilState(itemStatus(id));
export const useItemLocked = (id: number) => useRecoilValue(itemLocked(id));

export const useAddItemTask = () =>
   useRecoilTask(addItemTask, [], {
      loaderStack: 'addItemTask',
      errorStack: true,
   });

export const useRemoveItemTask = () => useRecoilTask(removeItemTask, []);
export const useEditItemTask = () => useRecoilTask(editItemTask, []);
export const useEditAndRemoveTask = () => useRecoilTask(editAndRemoveTask, []);
