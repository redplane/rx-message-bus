import {Component, Inject} from "@angular/core";
import {ParentComponent} from "../../parent.component";
import {MessageChannelNameConstant} from "../../../../constants/message-channel-name.constant";
import {MessageEventNameConstant} from "../../../../constants/message-event-name.constant";
import {INgRxMessageBusService} from "../../../../../../ngrx-message-bus/src/lib/ngrx-message-bus-service.interface";
import {NgRxMessageBusService} from "../../../../../../ngrx-message-bus/src/lib/ngrx-message-bus.service";

@Component({
  selector: 'hook-level-parent',
  templateUrl: 'hook-channel-event-parent.component.html',
  providers: [
    {provide: 'INgRxMessageBusService', useFactory: () => new NgRxMessageBusService()}
  ]
})
export class HookChannelEventParentComponent extends ParentComponent {

  //#region Properties

  //#endregion

  //#region Constructor

  public constructor(@Inject('INgRxMessageBusService') protected messageBusService: INgRxMessageBusService) {
    super();
  }

  //#endregion

  //#region Methods

  public clickSendMessage(): void {

    // Get current date.
    const date = new Date();

    this.messageBusService
      .addMessage(MessageChannelNameConstant.parent, MessageEventNameConstant.sendParentMessage,
        `${date.toLocaleTimeString()} [${this.name}] says: Hello`)
  }

  //#endregion
}
