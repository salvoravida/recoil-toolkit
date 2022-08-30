export type NodeInfo = {
   isModified: boolean;
   key: string;
   subNodes?: string[];
   type: string;
   state: 'hasValue' | 'loading' | 'hasError';
   value?: string | unknown;
};

export type SnapshotState = {
   id: string;
   nodes: NodeInfo[];
};
