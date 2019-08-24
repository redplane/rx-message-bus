import {Component, Inject} from "@angular/core";
import {ParentComponent} from "../../parent.component";
import {MessageChannelNameConstant} from "../../../../constants/message-channel-name.constant";
import {MessageEventNameConstant} from "../../../../constants/message-event-name.constant";
import {INgRxMessageBusService} from "../../../../../../ngrx-message-bus/src/services/interfaces/ngrx-message-bus-service.interface";
import {MESSAGE_BUS_SERVICE_INJECTOR} from "../../../../../../ngrx-message-bus/src/constants/injection-tokens.constant";

@Component({
  selector: 'module-level-parent',
  templateUrl: 'module-level-parent.component.html'
})
export class ModuleLevelParentComponent extends ParentComponent {

  //#region Properties

  //#endregion

  //#region Constructor

  public constructor(@Inject(MESSAGE_BUS_SERVICE_INJECTOR) protected messageBusService: INgRxMessageBusService) {
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
