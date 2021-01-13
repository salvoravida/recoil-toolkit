import { useEffect, useRef } from 'react';

export function useMountedRef() {
   const mounted = useRef(true);
   useEffect(
      () => () => {
         mounted.current = false;
      },
      [],
   );
   return mounted;
}
