import 'reflect-metadata';

export const CHANNEL_NAME_METADATA = 'channelName';
export const EVENT_NAME_METADATA = 'eventName';

export function MessageEvent(channelName: string, eventName: string): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(CHANNEL_NAME_METADATA, channelName, target.prototype);
    Reflect.defineMetadata(EVENT_NAME_METADATA, eventName, target.prototype);
  };
}
