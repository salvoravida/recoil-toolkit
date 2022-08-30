import { Snapshot } from 'recoil';
import { NodeInfo, SnapshotState } from './types';

//todo traverse and json stringify Errors
export function getSnapshotState(snapshot: Snapshot): SnapshotState {
   const nodes: NodeInfo[] = [];
   for (const node of snapshot.getNodes_UNSTABLE({ isInitialized: true })) {
      const nodeInfo = snapshot.getInfo_UNSTABLE(node);
      const loadable = snapshot.getLoadable(node);
      const subNodes: string[] = [];
      for (const comp of nodeInfo.subscribers.nodes) {
         subNodes.push(comp.key);
      }

      nodes.sort((a, b) => a.key.localeCompare(b.key));

      nodes.push({
         key: node.key,
         type: nodeInfo.type,
         // isSet: nodeInfo.isSet,
         // isActive: nodeInfo.isActive,
         isModified: nodeInfo.isModified,
         subNodes,
         state: loadable.state,
         value:
            loadable.state === 'hasValue'
               ? loadable.contents
               : loadable.state === 'loading'
               ? '... loading ...'
               : JSON.stringify(loadable.contents?.message || loadable.contents),
      });
   }
   return {
      id: snapshot.getID().toString(),
      nodes,
   };
}
