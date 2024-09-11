import Pusher from 'pusher-js';

let pusherInstance: Pusher | null = null;

export const getPusherClient = (): Pusher => {
  if (!pusherInstance) {
    pusherInstance = new Pusher('558598d8ff2114630776', {
      cluster: 'eu',
      forceTLS: true,
    });
  }
  return pusherInstance;
};

// Funzione per disconnettere Pusher quando necessario
export const disconnectPusher = (): void => {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
};