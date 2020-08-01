import {TypedChannelEvent} from '../../../ngrx-message-bus/src/models/typed-channel-event';

export class ProfileUpdateMessageEvent extends TypedChannelEvent<string> {

  //#region Properties

  public readonly channelName: string;

  public readonly eventName: string;

  //#endregion

  //#region Constructor

  public constructor() {
    super();

    this.channelName = 'profile';
    this.eventName = 'update-profile';
  }

  //#endregion

}
