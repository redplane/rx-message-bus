import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {ParentComponent} from '../../parent.component';
import {IMessageBusService, MESSAGE_BUS_SERVICE} from '@message-bus/core';
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

  public constructor(@Inject(MESSAGE_BUS_SERVICE) protected readonly _messageBusService: IMessageBusService) {
    super();
  }

  //#endregion

  //#region Methods

  public clickSendTypedMessage(): void {

    // Get current date.
    const date = new Date();

    const data = `${date.toLocaleTimeString()} [${this.name}] says: Hello`;
    const messageEvent = new ModuleLevelMessageEvent(data);

    this._messageBusService.addMessageInstance(messageEvent);
  }

  public clickSendMessage(): void {
    // Get current date.
    const date = new Date();
    const data = `${date.toLocaleTimeString()} [${this.name}] says: Hello`;

    this._messageBusService.addMessage(MessageChannelNameConstant.parent,
      MessageEventNameConstant.sendParentMessage, new ModuleLevelMessageEvent(data));
  }

  //#endregion
}
