import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {ParentComponent} from '../../parent.component';
import {MessageChannelNameConstant} from '../../../../constants/message-channel-name.constant';
import {MessageEventNameConstant} from '../../../../constants/message-event-name.constant';
import {IMessageBusService, MESSAGE_BUS_SERVICE, MessageBusService} from '@message-bus/core';
import {ModuleLevelMessageEvent} from '../../../../models/module-level.message-event';

@Component({
  selector: 'component-level-parent',
  templateUrl: 'component-level-parent.component.html',
  providers: [
    {provide: MESSAGE_BUS_SERVICE, useFactory: () => new MessageBusService()}
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentLevelParentComponent extends ParentComponent {

  //#region Properties

  //#endregion

  //#region Constructor

  public constructor(
    @Inject(MESSAGE_BUS_SERVICE) protected readonly _messageBusService: IMessageBusService) {
    super();
  }

  //#endregion

  //#region Methods

  public clickSendMessage(): void {

    // Get current date.
    const date = new Date();
    const message = `${date.toLocaleTimeString()} [${this.name}] says: Hello`;

    this._messageBusService
      .addMessage(MessageChannelNameConstant.parent, MessageEventNameConstant.sendParentMessage, message);
  }

  public clickSendTypedMessage(): void {

    const date = new Date();
    const message = `${date.toLocaleTimeString()} [${this.name}] says: Hello`;
    const messageEvent = new ModuleLevelMessageEvent(message);

    this._messageBusService.publish(messageEvent);
  }

  //#endregion
}
