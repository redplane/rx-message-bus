import {TypedChannelEvent} from '../../../ngrx-message-bus/src/models/typed-channel-event';
import {MessageChannelNameConstant} from '../constants/message-channel-name.constant';
import {MessageEventNameConstant} from '../constants/message-event-name.constant';

export class ModuleLevelMessageEvent extends TypedChannelEvent<string> {

  //#region Properties

  public readonly channelName: string;

  public readonly eventName: string;

  //#endregion

  //#region Constructor

  constructor() {
    super();

    this.channelName = MessageChannelNameConstant.parent;
    this.eventName = MessageEventNameConstant.sendParentMessage;
  }

  //#endregion
}
