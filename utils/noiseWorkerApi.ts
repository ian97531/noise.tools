/// <reference lib="WebWorker" />

export enum HostMessage {
  Init = "init",
  Play = "play",
  Pause = "pause",
  Reset = "reset",
  UpdateV1 = "updateV1",
  UpdateV2 = "updateV2",
  UpdateA = "updateA",
}

export enum WorkerMessage {
  Ready = "ready",
}

export type EventName = HostMessage | WorkerMessage;

export type Message<Name extends EventName> = {
  name: Name;
};

interface InitMessage extends Message<HostMessage.Init> {
  canvas: OffscreenCanvas;
  height: number;
  width: number;
  v1: number;
  v2: number;
  a: number;
}

interface UpdateV1Message extends Message<HostMessage.UpdateV1> {
  v1: number;
}

interface UpdateV2Message extends Message<HostMessage.UpdateV2> {
  v2: number;
}

interface UpdateAMessage extends Message<HostMessage.UpdateA> {
  a: number;
}

type MessageType = {
  [HostMessage.Init]: InitMessage;
  [HostMessage.Pause]: Message<HostMessage.Pause>;
  [HostMessage.Play]: Message<HostMessage.Play>;
  [HostMessage.Reset]: Message<HostMessage.Reset>;
  [HostMessage.UpdateV1]: UpdateV1Message;
  [HostMessage.UpdateV2]: UpdateV2Message;
  [HostMessage.UpdateA]: UpdateAMessage;
  [WorkerMessage.Ready]: Message<WorkerMessage.Ready>;
};

export interface ApiEvent<T> extends MessageEvent {
  data: T;
}

type Subscription<T extends keyof MessageType = any> = {
  name: T;
  callback: (evt: ApiEvent<MessageType[T]>) => void;
};

export type CreateListener = {
  listen: <Name extends keyof MessageType>(
    name: Name,
    callback: (evt: ApiEvent<MessageType[Name]>) => void
  ) => void;
  onMessage: <Name extends keyof MessageType>(
    evt: ApiEvent<MessageType[Name]>
  ) => void;
  stopListening: () => void;
};

export const createListener = (): CreateListener => {
  let subscriptions: Subscription[] = [];
  return {
    listen: <Name extends keyof MessageType>(
      name: Name,
      callback: (evt: ApiEvent<MessageType[Name]>) => void
    ): void => {
      subscriptions.push({
        name,
        callback,
      });
    },
    onMessage: <Name extends keyof MessageType>(
      evt: ApiEvent<MessageType[Name]>
    ): void =>
      subscriptions.forEach((subscription) => {
        if (subscription.name === evt.data.name) {
          subscription.callback(evt);
        }
      }),
    stopListening: (): void => {
      subscriptions = [];
    },
  };
};

export const createInitMessage = (
  canvas: OffscreenCanvas,
  width: number,
  height: number,
  v1: number,
  v2: number,
  a: number
): InitMessage => ({
  name: HostMessage.Init,
  canvas,
  height,
  width,
  v1,
  v2,
  a,
});

export const createPlayMessage = (): Message<HostMessage.Play> => ({
  name: HostMessage.Play,
});

export const createPauseMessage = (): Message<HostMessage.Pause> => ({
  name: HostMessage.Pause,
});

export const createResetMessage = (): Message<HostMessage.Reset> => ({
  name: HostMessage.Reset,
});

export const createUpdateV1Message = (v1: number): UpdateV1Message => ({
  name: HostMessage.UpdateV1,
  v1,
});

export const createUpdateV2Message = (v2: number): UpdateV2Message => ({
  name: HostMessage.UpdateV2,
  v2,
});

export const createUpdateAMessage = (a: number): UpdateAMessage => ({
  name: HostMessage.UpdateA,
  a,
});

export const createReadyMessage = (): Message<WorkerMessage.Ready> => ({
  name: WorkerMessage.Ready,
});
