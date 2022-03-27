import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {ParentComponent} from '../../parent.component';
import {MessageChannelNameConstant} from '../../../../constants/message-channel-name.constant';
import {MessageEventNameConstant} from '../../../../constants/message-event-name.constant';
import {INgRxMessageBusService, MESSAGE_BUS_SERVICE_PROVIDER, NgRxMessageBusService} from '@message-bus/core';
import {ModuleLevelMessageEvent} from '../../../../models/module-level.message-event';

@Component({
  selector: 'component-level-parent',
  templateUrl: 'component-level-parent.component.html',
  providers: [
    {provide: MESSAGE_BUS_SERVICE_PROVIDER, useFactory: () => new NgRxMessageBusService()}
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentLevelParentComponent extends ParentComponent {

  //#region Properties

  //#endregion

  //#region Constructor

  public constructor(@Inject(MESSAGE_BUS_SERVICE_PROVIDER) protected messageBusService: INgRxMessageBusService) {
    super();
  }

  //#endregion

  //#region Methods

  public clickSendMessage(): void {

    // Get current date.
    const date = new Date();
    const message = `${date.toLocaleTimeString()} [${this.name}] says: Hello`;

    this.messageBusService
      .addMessage(MessageChannelNameConstant.parent, MessageEventNameConstant.sendParentMessage, message);
  }

  public clickSendTypedMessage(): void {

    const channelEvent = new ModuleLevelMessageEvent();
    const date = new Date();
    const message = `${date.toLocaleTimeString()} [${this.name}] says: Hello`;

    this.messageBusService
      .addTypedMessage(channelEvent, message);
  }

  //#endregion
}
