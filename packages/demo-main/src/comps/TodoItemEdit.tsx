import { Box, Button, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useEditItemTask, useItemLocked, useItemStatus, ItemStatus } from '../recoil';
import { Item } from '../server';
import { TodoItemRemove } from './TodoItemRemove';

export function TodoItemEdit({ id, text }: Item) {
   const editTask = useEditItemTask();
   const locked = useItemLocked(id);
   const [status, setStatus] = useItemStatus(id);

   const [editText, setEditText] = useState(text);
   const showInput = status === ItemStatus.Editing || status === ItemStatus.Saving;

   return (
      <Box display={'flex'} alignItems={'top'} padding={'15px 0'} borderBottom={'1px solid gray'}>
         <Box width={'100%'} display={'flex'}>
            {showInput ? (
               <Box width={'100%'}>
                  <InputGroup size="md">
                     <Input
                        value={editText}
                        disabled={status !== ItemStatus.Editing}
                        onChange={e => setEditText(e.target.value)}
                        onKeyPress={event => {
                           if (event.charCode === 13) {
                              editTask.execute({ id, text: editText });
                           }
                        }}
                     />
                     <InputRightElement width="4.5rem">
                        <Button
                           h="1.75rem"
                           size="sm"
                           disabled={status !== ItemStatus.Editing}
                           onClick={() => {
                              setStatus(ItemStatus.Idle);
                              setEditText(text);
                           }}
                        >
                           {'X'}
                        </Button>
                     </InputRightElement>
                  </InputGroup>
                  <Text color="red.300">{(editTask.error as string) || ''}</Text>
               </Box>
            ) : (
               <Text
                  textDecoration={status === ItemStatus.Deleted ? 'line-through' : undefined}
                  width={'100%'}
                  cursor={'pointer'}
                  padding={'10px'}
                  onClick={() => {
                     if (!locked) setStatus(ItemStatus.Editing);
                  }}
               >
                  {editText}
               </Text>
            )}
         </Box>
         <Box marginLeft={'auto'} display={'flex'}>
            <Button
               minW={'150px'}
               marginLeft={'10px'}
               onClick={() => editTask.execute({ id, text: editText })}
               isLoading={editTask.loading}
               isDisabled={text === editText || !showInput || locked}
               loadingText={'Saving ...'}
            >
               Save
            </Button>
            <TodoItemRemove id={id} />
         </Box>
      </Box>
   );
}
