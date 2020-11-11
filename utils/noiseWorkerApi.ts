/// <reference lib="WebWorker" />

export enum HostMessage {
  Init = "init",
  Play = "play",
  Pause = "pause",
  Reset = "reset",
  UpdateNoise = "updateNoise",
  UpdateDarken = "updateDarken",
  UpdateLighten = "updateLighten",
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
  noise: number;
  lighten: number;
  darken: number;
}

interface UpdateNoiseMessage extends Message<HostMessage.UpdateNoise> {
  noise: number;
}

interface UpdateDarkenMessage extends Message<HostMessage.UpdateDarken> {
  darken: number;
}

interface UpdateLightenMessage extends Message<HostMessage.UpdateLighten> {
  lighten: number;
}

type MessageType = {
  [HostMessage.Init]: InitMessage;
  [HostMessage.Pause]: Message<HostMessage.Pause>;
  [HostMessage.Play]: Message<HostMessage.Play>;
  [HostMessage.Reset]: Message<HostMessage.Reset>;
  [HostMessage.UpdateNoise]: UpdateNoiseMessage;
  [HostMessage.UpdateDarken]: UpdateDarkenMessage;
  [HostMessage.UpdateLighten]: UpdateLightenMessage;
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
  noise: number,
  lighten: number,
  darken: number
): InitMessage => ({
  name: HostMessage.Init,
  canvas,
  height,
  width,
  noise,
  lighten,
  darken,
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

export const createUpdateNoiseMessage = (
  noise: number
): UpdateNoiseMessage => ({
  name: HostMessage.UpdateNoise,
  noise,
});

export const createUpdateDarkenMessage = (
  darken: number
): UpdateDarkenMessage => ({
  name: HostMessage.UpdateDarken,
  darken,
});

export const createUpdateLightenMessage = (
  lighten: number
): UpdateLightenMessage => ({
  name: HostMessage.UpdateLighten,
  lighten,
});

export const createReadyMessage = (): Message<WorkerMessage.Ready> => ({
  name: WorkerMessage.Ready,
});
