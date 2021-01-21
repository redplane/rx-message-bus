import {TypedChannelEvent} from '../../../ngrx-message-bus/src/public_api';
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
