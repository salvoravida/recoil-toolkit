export type Item = {
   id: number;
   text: string;
};

let idCounter: number = 0;

let RemoteTodoList: Item[] = [];

export const getRemoteTodoList = () =>
   new Promise((resolve, reject) => {
      console.log('api -> getRemoteTodoList...');
      setTimeout(() => {
         console.log('api <- getRemoteTodoList...', RemoteTodoList);
         resolve([...RemoteTodoList]);
      }, 2500);
   });

export const postRemoteTodoItem = (text: string) => {
   return new Promise((resolve, reject) => {
      console.log('api -> postRemoteTodoItem ...', text);
      setTimeout(() => {
         if (!text || !text.trim()) {
            console.error('api -> postRemoteTodoItem ...', 'Empty Todo');
            return reject('Empty Todo');
         }
         if (text.toLowerCase().indexOf('trump') >= 0) {
            console.error('api -> postRemoteTodoItem ...', '<trump> not allowed!');
            return reject('<trump> not allowed!');
         }
         idCounter = idCounter + 1;
         const newItem = {
            id: idCounter,
            text,
         };
         RemoteTodoList = [...RemoteTodoList, newItem];
         console.log('api <- postRemoteTodoItem ...', newItem);
         resolve(newItem);
      }, 2500);
   });
};

export const putRemoteTodoItem = (item: Item) => {
   return new Promise((resolve, reject) => {
      console.log('api -> putRemoteTodoItem ...', { ...item });
      setTimeout(() => {
         const { id, text } = item;
         if (!text || !text.trim()) {
            console.error('api -> postRemoteTodoItem ...', 'Empty Todo');
            return reject('Empty Todo');
         }
         if (text.toLowerCase().indexOf('trump') >= 0) {
            console.error('api -> putRemoteTodoItem ...', '<trump> not allowed!');
            return reject('<trump> not allowed!');
         }

         const idx = RemoteTodoList.findIndex(i => i.id === id);

         if (idx < 0) {
            console.error('api -> putRemoteTodoItem ...', id, 'Item not found');
            return reject('Item not found');
         }

         RemoteTodoList[idx] = { ...item };
         console.log('api <- putRemoteTodoItem ...', { ...item });
         resolve({ ...item });
      }, 2500);
   });
};

export const delRemoteTodoItem = (id: number) => {
   return new Promise((resolve, reject) => {
      console.log('api -> delRemoteTodoItem ...', id);
      setTimeout(() => {
         const idx = RemoteTodoList.findIndex(i => i.id === id);
         if (idx < 0) {
            console.error('api -> delRemoteTodoItem ...', id, 'Item not found');
            return reject('Item not found');
         }
         RemoteTodoList = [...RemoteTodoList.filter(i => i.id !== id)];
         resolve(true);
         console.log('api <- delRemoteTodoItem ...', id);
      }, 2500);
   });
};
