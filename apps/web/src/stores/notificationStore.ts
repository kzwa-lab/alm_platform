import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  moduleId?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: '1',
      type: 'warning',
      title: 'LCR Buffer Narrowing',
      message: 'LCR has dropped to 118.5%, approaching amber threshold. Review HQLA position.',
      timestamp: new Date(),
      read: false,
      moduleId: 'liquidity',
    },
    {
      id: '2',
      type: 'error',
      title: 'GRC Limit Breach',
      message: 'FX exposure limit breached by 12%. 10-day BoG notification required.',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      moduleId: 'grc',
    },
    {
      id: '3',
      type: 'info',
      title: 'ORASS Submission Due',
      message: 'Monthly LMTD return due in 3 days. Auto-population complete.',
      timestamp: new Date(Date.now() - 7200000),
      read: false,
      moduleId: 'regulatory',
    },
  ],
  unreadCount: 3,
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },
  dismissNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: Math.max(0, state.unreadCount - (state.notifications.find((n) => n.id === id)?.read ? 0 : 1)),
    }));
  },
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
