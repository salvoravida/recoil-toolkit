import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLastError } from 'recoil-toolkit';

export function ErrorStack() {
   const toast = useToast();
   const error = useLastError();

   useEffect(() => {
      if (error) {
         toast({
            position: 'top',
            duration: 2000,
            status: 'error',
            title: `[${error.taskId}] ${error.error}`,
         });
      }
   }, [error, toast]);

   return null;
}
