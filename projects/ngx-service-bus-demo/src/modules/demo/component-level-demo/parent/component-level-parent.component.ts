import {Component, Inject} from "@angular/core";
import {ParentComponent} from "../../parent.component";
import {MessageChannelNameConstant} from "../../../../constants/message-channel-name.constant";
import {MessageEventNameConstant} from "../../../../constants/message-event-name.constant";
import {IRxMessageBusService} from "../../../../../../ngx-message-bus/src/lib/rx-message-bus-service.interface";
import {RxMessageBusService} from "../../../../../../ngx-message-bus/src/lib/rx-message-bus.service";

@Component({
  selector: 'component-level-parent',
  templateUrl: 'component-level-parent.component.html',
  providers: [
    {provide: 'IRxMessageBusService', useClass: RxMessageBusService}
  ]
})
export class ComponentLevelParentComponent extends ParentComponent {

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
