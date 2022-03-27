import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {ParentComponent} from '../../parent.component';
import {INgRxMessageBusService, MESSAGE_BUS_SERVICE_PROVIDER} from '@message-bus/core';
import {ModuleLevelMessageEvent} from '../../../../models';
import {MessageChannelNameConstant, MessageEventNameConstant} from '../../../../constants';

@Component({
  selector: 'module-level-parent',
  templateUrl: 'module-level-parent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModuleLevelParentComponent extends ParentComponent {

  //#region Properties

  //#endregion

  //#region Constructor

  public constructor(@Inject(MESSAGE_BUS_SERVICE_PROVIDER) protected messageBusService: INgRxMessageBusService) {
    super();
  }

  //#endregion

  //#region Methods

  public clickSendTypedMessage(): void {

    // Get current date.
    const date = new Date();

    const channelEvent = new ModuleLevelMessageEvent();
    const data = `${date.toLocaleTimeString()} [${this.name}] says: Hello`;

    this.messageBusService.addTypedMessage(channelEvent, data);
  }

  public clickSendMessage(): void {
    // Get current date.
    const date = new Date();
    const data = `${date.toLocaleTimeString()} [${this.name}] says: Hello`;

    this.messageBusService.addMessage(MessageChannelNameConstant.parent,
      MessageEventNameConstant.sendParentMessage, data);
  }

  //#endregion
}
