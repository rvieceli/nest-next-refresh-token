export const authChannel: BroadcastChannel = process.browser
  ? new BroadcastChannel('auth')
  : undefined;
