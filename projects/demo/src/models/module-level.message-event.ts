import {MessageHook} from '@message-bus/core';
import {MessageChannelNameConstant} from '../constants/message-channel-name.constant';
import {MessageEventNameConstant} from '../constants/message-event-name.constant';

@MessageHook(MessageChannelNameConstant.parent, MessageEventNameConstant.sendParentMessage)
export class ModuleLevelMessageEvent {

  //#region Constructor

  public constructor(public readonly message: string) {
  }

  //#endregion
}
