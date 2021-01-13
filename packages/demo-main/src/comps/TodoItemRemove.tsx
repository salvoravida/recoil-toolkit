import React from 'react';
import { Button } from '@chakra-ui/react';
import { ItemStatus, useItemLocked, useItemStatus, useRemoveItemTask } from '../recoil';

export function TodoItemRemove({ id }: { id: number }) {
   const removeTask = useRemoveItemTask();
   const locked = useItemLocked(id);
   const [status] = useItemStatus(id);
   return (
      <Button
         minW={'150px'}
         marginLeft={'10px'}
         onClick={() => {
            removeTask.execute(id);
         }}
         isLoading={removeTask.loading && status !== ItemStatus.Deleted}
         isDisabled={locked}
         loadingText={'Deleting ...'}
      >
         {status === ItemStatus.Deleted ? 'Deleted' : 'Delete'}
      </Button>
   );
}
