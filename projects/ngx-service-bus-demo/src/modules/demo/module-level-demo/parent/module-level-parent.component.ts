import {Component, Inject} from "@angular/core";
import {ParentComponent} from "../../parent.component";
import {MessageChannelNameConstant} from "../../../../constants/message-channel-name.constant";
import {MessageEventNameConstant} from "../../../../constants/message-event-name.constant";
import {IRxMessageBusService} from "../../../../../../ngrx-message-bus/src/lib/rx-message-bus-service.interface";

@Component({
  selector: 'module-level-parent',
  templateUrl: 'module-level-parent.component.html'
})
export class ModuleLevelParentComponent extends ParentComponent {

  //#region Properties

  //#endregion

  //#region Constructor

  public constructor(@Inject('IRxMessageBusService') protected messageBusService: IRxMessageBusService) {
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
