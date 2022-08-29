import { Box, Checkbox, Divider, Heading, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ErrorStack } from './comps/ErrorStack';
import { TaskManager } from './comps/TaskManager';
import TodoItemAdd from './comps/TodoItemAdd';
import { Todolist } from './comps/TodoList';

function App() {
   const [showList, setShowList] = useState(true);
   return (
      <>
         <Box display={'flex'}>
            <Box padding={30} maxW={'1024px'} margin={'0 auto'} width={'100%'}>
               <Heading fontSize="3xl" marginBottom={'5px'} textAlign={'center'}>
                  Recoil Todolist CRUD Example
               </Heading>
               <Text textAlign={'center'}>Fake Api delay : 2.500 ms</Text>
               <TodoItemAdd />
               <Checkbox isChecked={showList} onChange={() => setShowList(s => !s)}>
                  {!showList ? 'Hide List' : 'Show List'}
               </Checkbox>
               <Divider marginTop={'20px'} />
               {showList && <Todolist />}
            </Box>
            <TaskManager />
         </Box>
         <ErrorStack />
      </>
   );
}

export default App;
