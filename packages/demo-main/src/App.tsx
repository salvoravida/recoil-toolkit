import React, { useState } from 'react';
import { Box, Checkbox, Divider, Heading, Text } from '@chakra-ui/react';
import { Todolist } from './comps/TodoList';
import TodoItemAdd from './comps/TodoItemAdd';
import { TaskManager } from './comps/TaskManager';
import { ErrorStack } from './comps/ErrorStack';

function App() {
   const [showList, setShowList] = useState(true);
   return (
      <>
         <Box d={'flex'}>
            <Box padding={30} maxW={'1024px'} margin={'0 auto'} width={'100%'}>
               <Heading fontSize="3xl" marginBottom={"5px"} textAlign={'center'}>
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
