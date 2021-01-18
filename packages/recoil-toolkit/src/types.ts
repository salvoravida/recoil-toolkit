import { CallbackInterface, Loadable, RecoilState, RecoilValue, Snapshot } from 'recoil';

export type RecoilTaskInterface = CallbackInterface;

export type RecoilGetPromise = <T>(recoilValue: RecoilValue<T>) => Promise<T>;
export type RecoilGetLoadable = <T>(recoilValue: RecoilValue<T>) => Loadable<T>;
export type RecoilSetState = <T>(
   recoilVal: RecoilState<T>,
   valOrUpdater: ((currVal: T) => T) | T,
) => void;
export type RecoilResetState = (recoilVal: RecoilState<any>) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
export type RecoilGetSnapshot = () => Snapshot;
export type RecoilGotoSnapshot = (snapshot: Snapshot) => void;

export type RecoilStore = {
   getPromise: RecoilGetPromise;
   getLoadable: RecoilGetLoadable;
   set: RecoilSetState;
   reset: RecoilResetState;
   getSnapshot: RecoilGetSnapshot;
   gotoSnapshot: RecoilGotoSnapshot;
};

// eslint-disable-next-line no-shadow
export enum TaskStatus {
   Running,
   Error,
   Done,
}

export type TaskOptions<T = unknown> = {
   key?: string;
   errorStack?: boolean;
   loaderStack?: string | boolean;
   exclusive?: boolean;
   dataSelector?: RecoilValue<T>;
};

export type Task = {
   id: number;
   status: TaskStatus;
   args: ReadonlyArray<unknown>;
   startedAt: Date;
   endAt?: Date;
   error?: any;
   data?: any;
   options?: TaskOptions;
   extra?: any;
};

export type ErrorAtom = {
   id: number;
   key?: string;
   error: any;
   taskId?: number;
};
