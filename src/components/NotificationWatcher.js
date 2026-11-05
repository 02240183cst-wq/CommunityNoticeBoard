import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeNotices } from '../services/noticeService';
import {
  loadPrefs, requestNotificationPermission, sendLocalNotification,
} from '../services/notificationService';

export default function NotificationWatcher() {
  const { user } = useAuth();
  const seen = useRef(null);

  useEffect(() => {
    if (!user) {
      seen.current = null;
      return;
    }
    requestNotificationPermission();

    const unsub = subscribeNotices(
      async (list) => {
        // First load: remember existing notices, don't notify for them
        if (seen.current === null) {
          seen.current = new Set(list.map((n) => n.id));
          return;
        }
        const fresh = list.filter((n) => !seen.current.has(n.id));
        fresh.forEach((n) => seen.current.add(n.id));
        if (!fresh.length) return;

        const prefs = await loadPrefs();
        for (const n of fresh) {
          if (n.authorId === user.uid) continue;
          if (n.category === 'Emergency' && prefs.emergency) {
            await sendLocalNotification('EMERGENCY: ' + n.title, n.description, { id: n.id });
          } else if (n.category === 'Announcements' && prefs.announcements) {
            await sendLocalNotification('New announcement: ' + n.title, n.description, { id: n.id });
          } else if (n.category === 'Events' && prefs.events) {
            await sendLocalNotification('Event update: ' + n.title, n.description, { id: n.id });
          }
        }
      },
      () => {}
    );
    return unsub;
  }, [user?.uid]);

  return null;
}