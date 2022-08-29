import { atom, atomFamily, selectorFamily } from 'recoil';
import { Item } from '../server';
import { ItemStatus } from './types';

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
   get:
      (id: number) =>
      ({ get }) =>
         get(itemStatus(id)) > ItemStatus.Editing,
});
