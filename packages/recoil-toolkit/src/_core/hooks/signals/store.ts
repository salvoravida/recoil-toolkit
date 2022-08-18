let instanceId = 0;
function getInstanceId() {
   instanceId += 1;
   return instanceId;
}

export interface CancelSignal {
   signal: unknown;
   cancel: () => void;
}

const signalStore: {
   [key: string]: {
      [instance: number]: CancelSignal;
   };
} = {};

export function addCancelSignal(key: string, signal: CancelSignal) {
   if (!signalStore[key]) {
      signalStore[key] = {};
   }
   signalStore[key][getInstanceId()] = signal;
}

export function doCancelSignal(key: string) {
   if (signalStore[key]) {
      Object.values(signalStore[key]).forEach((abortsignal) => {
         try {
            abortsignal.cancel();
         } catch {
            // ignore
         }
      });
      signalStore[key] = {};
   }
}
