import { atom, atomFamily, useRecoilValue } from 'recoil';
import { RecoilTaskInterface, useRecoilTask } from 'recoil-toolkit';

const notifications = atom<{ id: number; text: string }[]>({
   key: 'notifications',
   default: [],
});

const getNotificationsTask =
   ({ set }: RecoilTaskInterface) =>
   async () => {
      const body = await fetch('/api/notifications');
      const resp = await body.json();
      set(notifications, resp);
   };

export const NotificationsView = () => {
   const {
      loading,
      data,
      error,
      execute: refresh,
   } = useRecoilTask(getNotificationsTask, [], {
      dataSelector: notifications,
   });
   if (loading) return 'Loading…';
   if (error) return 'Sorry! Something went wrong. Please try again.';
   return (
      <div>
         <button onClick={refresh}>Refresh</button>
         {data.map(({ id, text }) => (
            <Notification key={id} text={text} id={id} />
         ))}
      </div>
   );
};

const notificationRead = atomFamily<boolean, number>({
   key: 'notificationRead',
   default: false,
});

const notifyServerNotificationRead =
   ({ set }: RecoilTaskInterface) =>
   async (id: number) => {
      await fetch('/api/notification-read', { body: JSON.stringify({ id }), method: 'POST' });
      set(notificationRead(id), true);
   };

export const Notification = ({ id, text }: { id: number; text: string }) => {
   const read = useRecoilValue(notificationRead(id));
   const { loading, execute: notify } = useRecoilTask(notifyServerNotificationRead, []);
   return (
      <div style={{ color: read ? 'green' : 'yellow' }}>
         <p>{text}</p>
         {!read && (
            <button disabled={loading} onClick={() => notify(id)}>
               {loading ? 'Sending ...' : 'Send Read'}
            </button>
         )}
      </div>
   );
};
