import { CallbackInterface, Loadable, RecoilValue } from 'recoil';

export type RecoilTaskInterface = CallbackInterface;

export type RecoilGetPromise = <T>(recoilValue: RecoilValue<T>) => Promise<T>;
export type RecoilGetLoadable = <T>(recoilValue: RecoilValue<T>) => Loadable<T>;

export enum TaskStatus {
   Running,
   Error,
   Done,
}

export type TaskOptions<T = unknown> = {
   key?: string;
   errorStack?: boolean;
   loaderStack?: string;
   exclusive?: boolean;
   startAuto?: boolean;
   startAutoArgs?: ReadonlyArray<unknown>;
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
