import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import ReactJson from 'react-json-view';
import type { Task } from 'recoil-toolkit';
import { version } from '../package.json';
import { backgroundPage } from './background';
import {
   Header,
   Page,
   Main,
   MainContent,
   Sidebar,
   SnapId,
   Toolbar,
   TaskTableContainer,
   MainTask,
   SidebarContainer,
} from './layout/styles';
import mock from './mock.json';
import { normalize, SnapshotState } from './normalize';

// @ts-ignore
const isDev: boolean = process.env.NODE_ENV === 'development';

function App() {
   const [showTask, setShowTask] = useState(true);

   const [hideRecoilTookit, setHideRecoilTookit] = useState(true);
   const [showRawNodes, setShowRawNode] = useState(false);
   const [onlyModified, setOnlyModified] = useState(false);
   const [onlyRunning, setOnlyRunning] = useState(true);

   const [messageList, setMessageList] = useState<SnapshotState[]>([]);
   const [snapshotId, setSnapshotId] = useState<string | undefined>();

   useEffect(() => {
      if (isDev) {
         // @ts-ignore
         setMessageList(Array.from({ length: 50 }).map((a) => mock.data));
         setSnapshotId(mock.data.id);
      }
      backgroundPage.connection?.onMessage.addListener(function (message: { data: SnapshotState }) {
         console.log('DevPanel --- Received Message From Background:', message.data);
         setMessageList((m) =>
            m.length > 0 && Number(message.data.id) < Number(m[m.length - 1].id)
               ? [message.data]
               : [...m.slice(-50), message.data],
         );
         setSnapshotId(message.data.id);
      });
   }, []);

   const ref = React.useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (ref.current) {
         ref.current.scrollTop = ref.current.scrollHeight;
      }
   }, [messageList.length]);

   const messageJson = useMemo(() => {
      const message = messageList.find((m) => m.id === snapshotId);
      if (!message) return {};
      let temp = message.nodes.map((n) => ({
         ...n,
         key: n.key.indexOf('redux') < 0 ? n.key : n.key.replace('@recoil-toolkit.', '@'),
      }));
      temp = hideRecoilTookit ? temp.filter((m) => m.key.indexOf('recoil-toolkit') < 0) : temp;
      temp = onlyModified ? temp.filter((m) => m.isModified) : temp;
      if (showRawNodes)
         return temp.reduce((acc, curr) => {
            const { key, ...rest } = curr;
            // @ts-ignore
            acc[key] = rest;
            return acc;
         }, {});
      return normalize(temp);
   }, [snapshotId, messageList, hideRecoilTookit, showRawNodes, onlyModified]);

   const taskInfo = useMemo(() => {
      if (messageList.length === 0) return undefined;
      const tasks: Task[] | undefined = messageList[messageList.length - 1].nodes.find(
         (m) => m.key === '@recoil-toolkit.tasks',
      )?.value as Task[] | undefined;
      if (!tasks) return undefined;
      return {
         running: tasks.filter((t) => t.status === 0).length,
         error: tasks.filter((t) => t.status === 1).length,
         taskToShow: !onlyRunning ? tasks : tasks.filter((t) => t.status === 0),
      };
   }, [messageList, onlyRunning]);

   return (
      <Page>
         <Header>
            <p>Recoil Toolkit DevTools</p>
            <p>
               <span className={'task-link'} onClick={() => setShowTask((c) => !c)}>
                  Tasks
               </span>{' '}
               - Running: <span style={{ color: 'green' }}>{taskInfo?.running || 0}</span> Error:{' '}
               <span style={{ color: 'red' }}>{taskInfo?.error || 0}</span>
            </p>
            <p>v{version}</p>
            {/*
             <button
               onClick={() => {
                  backgroundPage.connection?.postMessage({
                     name: 'test',
                  });
               }}
            >s
               Test Send Message To Page
            </button>
            */}
         </Header>
         <Main>
            <SidebarContainer>
               <h1>Snapshots</h1>
               <Sidebar ref={ref}>
                  {messageList.map((message, index) => (
                     <SnapId onClick={() => setSnapshotId(message.id)} key={index} active={snapshotId === message.id}>
                        Snapshot Id: {message.id}
                     </SnapId>
                  ))}
               </Sidebar>
            </SidebarContainer>
            <MainContent>
               <Toolbar>
                  <label htmlFor="onlyModified">
                     <input
                        type="checkbox"
                        id="onlyModified"
                        name="onlyModified"
                        checked={onlyModified}
                        onChange={() => setOnlyModified((c) => !c)}
                     />
                     showOnlyModified
                  </label>
                  <label htmlFor="showRawNodes">
                     <input
                        type="checkbox"
                        id="showRawNodes"
                        name="showRawNodes"
                        checked={showRawNodes}
                        onChange={() => setShowRawNode((c) => !c)}
                     />
                     showRawNodes
                  </label>
                  <label htmlFor="hideRecoilTookit" style={{ marginLeft: 'auto' }}>
                     <input
                        type="checkbox"
                        id="hideRecoilTookit"
                        name="hideRecoilTookit"
                        checked={hideRecoilTookit}
                        onChange={() => setHideRecoilTookit((c) => !c)}
                     />
                     hideToolkit
                  </label>
               </Toolbar>
               <ReactJson
                  src={messageJson}
                  quotesOnKeys={false}
                  sortKeys={true}
                  name={false}
                  iconStyle={'square'}
                  indentWidth={4}
                  collapseStringsAfterLength={false}
                  collapsed={2}
                  theme={'harmonic'}
                  displayDataTypes={false}
                  displayObjectSize={false}
                  enableClipboard={false}
               />
            </MainContent>
         </Main>
         {showTask && (
            <MainTask>
               <MainContent>
                  <Toolbar>
                     <h1>Tasks</h1>
                     <label htmlFor="onlyRunning" style={{ marginLeft: '8px' }}>
                        <input
                           type="checkbox"
                           id="onlyRunning"
                           name="onlyRunning"
                           checked={onlyRunning}
                           onChange={() => setOnlyRunning((c) => !c)}
                        />
                        showOnlyRunning
                     </label>
                  </Toolbar>
                  <TaskTableContainer>
                     <table>
                        <thead>
                           <tr>
                              <td>Id</td>
                              <td>Status</td>
                              <td>Key</td>
                              <td>Exclusive</td>
                              <td>Args</td>
                              <td>Start</td>
                              <td>End</td>
                           </tr>
                        </thead>
                        <tbody>
                           {taskInfo?.taskToShow?.map((task) => (
                              <tr key={task.id}>
                                 <td>{task.id}</td>
                                 <td>{task.status === 0 ? 'Running' : task.status === 1 ? 'Error' : 'Done'}</td>
                                 <td>{task.options?.key || 'anonymous'}</td>
                                 <td>{Boolean(!!task.options?.exclusive).toString()}</td>
                                 <td>{JSON.stringify(task.args)}</td>
                                 <td>{task.startedAt ? dayjs(task.startedAt).format('HH:mm:ss.SSS') : ''}</td>
                                 <td>{task.endAt ? dayjs(task.endAt).format('HH:mm:ss.SSS') : ''}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </TaskTableContainer>
               </MainContent>
            </MainTask>
         )}
      </Page>
   );
}

export default App;
