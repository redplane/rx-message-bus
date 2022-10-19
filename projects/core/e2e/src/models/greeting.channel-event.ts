import {MessageHook} from '@message-bus/core';

@MessageHook('greeting-channel', 'greeting-event')
export class GreetingChannelEvent {

  //#region Properties

  //#endregion

  //#region Constructor

  public constructor(public readonly message: string) {
  }

  //#endregion
}
