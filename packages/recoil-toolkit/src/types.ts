import type { CallbackInterface, Loadable, RecoilValue, Snapshot } from 'recoil';

export type Cancelled = () => boolean;
export type WaitFor = <T>(promiseOrMs: Promise<T> | number) => Promise<T | void>;
export type Fork = <Args extends readonly unknown[], Return = void>(
   taskCreator: (recoilTask: RecoilTaskInterface) => (...args: Args) => Return,
   executeArgs: Args,
   debugKey?: string,
) => {
   id: number;
   cancel: () => void;
   task: Promise<Return | undefined>;
   getTaskState: () => Task<Return> | undefined;
};

export type RecoilTaskInterface = CallbackInterface & {
   getSnapshot: RecoilGetSnapshot;
   getLoadable: Snapshot['getLoadable'];
   cancelled: Cancelled;
   waitFor: WaitFor;
   fork: Fork;
};

export type RecoilGetPromise = <T>(recoilValue: RecoilValue<T>) => Promise<T>;
export type RecoilGetLoadable = <T>(recoilValue: RecoilValue<T>) => Loadable<T>;
export type RecoilGetSnapshot = () => Snapshot;

export type RecoilStore = {
   set: CallbackInterface['set'];
   reset: CallbackInterface['reset'];
   refresh: CallbackInterface['refresh'];
   gotoSnapshot: CallbackInterface['gotoSnapshot'];
   getSnapshot: RecoilGetSnapshot;
   getPromise: Snapshot['getPromise'];
   getLoadable: Snapshot['getLoadable'];
};

// eslint-disable-next-line no-shadow
export enum TaskStatus {
   Running,
   Error,
   Done,
}

export type TaskOptions<Data = unknown, Args = unknown> = {
   key?: string;
   errorStack?: boolean;
   loaderStack?: string | boolean;
   exclusive?: boolean;
   dataSelector?: RecoilValue<Data>;
   autoStart?: Args;
   cancelOnUnmount?: boolean;
};

export type Task<Data = unknown, Error = unknown> = {
   parentId?: number;
   id: number;
   status: TaskStatus;
   args: ReadonlyArray<unknown>;
   startedAt: Date;
   endAt?: Date;
   error?: Error;
   data?: Data;
   options?: TaskOptions;
   extra?: unknown;
};

export type ErrorAtom = {
   id: number;
   key?: string;
   error?: unknown;
   taskId?: number;
};
