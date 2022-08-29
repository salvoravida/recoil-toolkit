import { Box, Table, TableCaption, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';
import { useRunningTasks, TaskStatus } from 'recoil-toolkit';

const TaskStatusLabel = {
   [TaskStatus.Running]: 'Running',
   [TaskStatus.Error]: 'Error',
   [TaskStatus.Done]: 'Done',
};

export function TaskManager() {
   const runningTasks = useRunningTasks();

   return (
      <Box display={'flex'} flexDirection={'column'} width={'500px'}>
         <Table variant="striped" colorScheme="teal" size={'sm'}>
            <TableCaption>TaskManager</TableCaption>
            <Thead>
               <Tr>
                  <Th>id</Th>
                  <Th>status</Th>
                  <Th>args</Th>
                  <Th>started</Th>
               </Tr>
            </Thead>
            <Tbody>
               {runningTasks.map(t => (
                  <Tr key={t.id}>
                     <Td>{t.id}</Td>
                     <Td>{TaskStatusLabel[t.status]}</Td>
                     <Td>{JSON.stringify(t.args)}</Td>
                     <Td>{t.startedAt.toLocaleTimeString()}</Td>
                  </Tr>
               ))}
            </Tbody>
         </Table>
      </Box>
   );
}
