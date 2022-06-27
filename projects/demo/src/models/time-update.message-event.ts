import {TypedChannelEvent} from '@message-bus/core';
import {GetTimeCommandResponse} from './get-time-command-response';

export class TimeUpdateMessageEvent extends TypedChannelEvent<GetTimeCommandResponse> {

  //#region Properties

  public readonly channelName: string;

  public readonly eventName: string;

  //#endregion

  //#region Constructor

  public constructor() {
    super();
    this.channelName = 'time-channel';
    this.eventName = 'time-updated';
  }

  //#endregion

}
