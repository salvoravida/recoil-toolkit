import React, { useRef, memo } from 'react';
import { Box, Button, Input } from '@chakra-ui/react';
import { useAddItemTask } from '../recoil';
import { useTestTask } from '../recoil/test';

export function TodoItemAdd() {
   const addItemTask = useAddItemTask();
   const testTask = useTestTask();

   const inputRef = useRef<HTMLInputElement>(null);
   const addItem = () => {
      if (inputRef.current && inputRef.current.value) {
         addItemTask.execute(inputRef.current.value);
         inputRef.current.value = '';
      }
   };

   return (
      <Box d={'flex'} alignItems={'center'}>
         <Input
            placeholder="New todo item"
            ref={inputRef}
            onKeyPress={event => {
               if (event.charCode === 13) {
                  addItem();
               }
            }}
         />
         <Box padding={'20px 0'} d={'flex'}>
            <Button minW={'140px'} marginLeft={'20px'} onClick={addItem}>
               Add
            </Button>
            <Button
               minW={'140px'}
               marginLeft={'20px'}
               onClick={() => {
                  testTask.execute();
                  //  addItemTask.execute("")
               }}
            >
               Add Empty
            </Button>
         </Box>
      </Box>
   );
}

export default memo(TodoItemAdd);
