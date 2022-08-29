import { delay, push, RecoilTaskInterface, removeObj, updateObj } from 'recoil-toolkit';
import {
   Item,
   delRemoteTodoItem,
   postRemoteTodoItem,
   putRemoteTodoItem,
   getRemoteTodoList,
} from '../server';
import { itemStatus, todoList } from './atoms';
import { ItemStatus } from './types';

export const getTodoListTask =
   ({ set }: RecoilTaskInterface) =>
   async () => {
      const items = (await getRemoteTodoList()) as Item[];
      set(todoList, items);
   };

export const addItemTask =
   ({ set }: RecoilTaskInterface) =>
   async (text: string) => {
      const item = (await postRemoteTodoItem(text)) as Item;
      set(todoList, push(item));
   };

export const removeItemTask =
   ({ set }: RecoilTaskInterface) =>
   async (id: number) => {
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

export const editItemTask =
   ({ set }: RecoilTaskInterface) =>
   async (item: Item) => {
      try {
         set(itemStatus(item.id), ItemStatus.Saving);
         await putRemoteTodoItem(item);
         set(itemStatus(item.id), ItemStatus.Idle);
         set(todoList, updateObj<Item>(item, { id: item.id }));
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
