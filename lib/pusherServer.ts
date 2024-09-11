import Pusher from "pusher";

// Configurazione di Pusher Server
export const pusher = new Pusher({
  appId: "1862741",
  key: "558598d8ff2114630776",
  secret: "5a9212c7f34ff3e110e9",
  cluster: "eu",
  useTLS: true,
});
