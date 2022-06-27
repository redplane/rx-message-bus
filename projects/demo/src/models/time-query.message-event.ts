import {TypedChannelEvent} from '@message-bus/core';
import {GetTimeCommandRequest} from './get-time-command-request';

export class TimeQueryMessageEvent extends TypedChannelEvent<GetTimeCommandRequest> {

  //#region Properties

  public readonly channelName: string;

  public readonly eventName: string;

  //#endregion

  //#region Constructor

  public constructor() {
    super();
    this.channelName = 'time-channel';
    this.eventName = 'time-request';
  }

  //#endregion
}
