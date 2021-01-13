import React, { useEffect } from 'react';
import { Box, Button, Heading, Skeleton, Stack, Text } from '@chakra-ui/react';
import { useIsLoading } from 'recoil-toolkit';
import { useTodoList } from '../recoil';
import { TodoItemEdit } from './TodoItemEdit';

export function Todolist() {
   const { loading, data, execute: refresh } = useTodoList();
   const isAdding = useIsLoading('addItemTask');
   useEffect(() => {
      refresh();
   }, [refresh]);
   return (
      <Box>
         <Box d={'flex'} padding={'20px 0'} alignItems={'center'}>
            <Heading fontSize="xl">List</Heading>
            <Button
               minW={'150px'}
               onClick={() => refresh()}
               isLoading={loading}
               marginLeft={'auto'}
               loadingText={'Refresh ...'}
            >
               Refresh
            </Button>
         </Box>
         <Box padding={'20px 0'}>
            {(isAdding || (loading && data.length === 0)) && (
               <Stack>
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
               </Stack>
            )}
            {!loading && !isAdding && data.length === 0 && (
               <Text textAlign={'center'} color="gray.500">
                  Empty list
               </Text>
            )}
            {data?.map(({ id, text }) => (
               <TodoItemEdit key={id + text} id={id} text={text} />
            ))}
         </Box>
      </Box>
   );
}
