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

function tryJsonParse(str: string) {
   try {
      return JSON.parse(str);
   } catch {
      return str;
   }
}

function setOrCreatePath(obj: Record<string, unknown>, path: string[], value?: object | string) {
   let current: Record<string, unknown> = obj;
   for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (!current[key]) {
         current[key] = {};
      }
      // @ts-ignore
      current = current[key];
   }
   current[path[path.length - 1]] = typeof value === 'string' ? tryJsonParse(value) : value;
}

export const normalize = (obj: NodeInfo[]): Record<string, unknown> =>
   obj.reduce((a, v) => {
      const dottedPath = v.key
         .split('.')
         .flatMap((k) => k.split('__selectorFamily/'))
         .flatMap((k) => k.split('__'));
      setOrCreatePath(a, dottedPath, v.value as object);
      return a;
   }, {});
