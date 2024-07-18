import { toast } from 'react-toastify';

import dayjs from 'dayjs';

interface NotificationData {
  title: string;
  body: string;
}

interface NotificationTimer extends NotificationData {
  id: string;
  timer: number;
}

const notificationQueue: NotificationTimer[] = [];

export const pushNotification = (data: NotificationTimer) => {
  removeNotification(data.id);
  notificationQueue.push(data);
};

export const removeNotification = (id: string) => {
  for (let i = notificationQueue.length - 1; i >= 0; i--) {
    if (notificationQueue[i].id === id) {
      notificationQueue.splice(i, 1);
    }
  }
};

export const showNotification = (data: NotificationData) => {
  if (window.Notification && Notification.permission === 'granted') {
    // eslint-disable-next-line
    new Notification(data.title, {
      body: data.body,
      icon: 'https://cdn.mahoutsukai.cn/assets/tilty/images/tilty_logo_round.png',
    });
  } else {
    toast.info(`${data.title}: ${data.body}`);
  }
};

setInterval(() => {
  for (let i = notificationQueue.length - 1; i >= 0; i--) {
    if (dayjs().diff(dayjs(notificationQueue[i].timer)) > 0) {
      showNotification(notificationQueue[i]);
      notificationQueue.splice(i, 1);
    }
  }
}, 1000);
