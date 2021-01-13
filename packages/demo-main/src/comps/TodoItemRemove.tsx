import React from 'react';
import { Button } from '@chakra-ui/react';
import { useItemLocked, useRemoveItemTask } from '../recoil';

export function TodoItemRemove({ id }: { id: number }) {
   const removeTask = useRemoveItemTask();
   const locked = useItemLocked(id);
   return (
      <Button
         minW={'140px'}
         marginLeft={'10px'}
         onClick={() => {
            removeTask.execute(id);
         }}
         isLoading={removeTask.loading}
         isDisabled={locked}
         loadingText={'Removing ...'}
      >
         {removeTask.success ? 'Deleted' : 'Remove'}
      </Button>
   );
}
