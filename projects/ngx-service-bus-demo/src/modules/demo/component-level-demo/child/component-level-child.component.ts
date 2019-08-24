import {Component, Inject} from "@angular/core";
import {ChildComponent} from "../../child.component";
import {INgRxMessageBusService} from "../../../../../../ngrx-message-bus/src/services/interfaces/ngrx-message-bus-service.interface";
import {MESSAGE_BUS_SERVICE_INJECTOR} from "../../../../../../ngrx-message-bus/src/constants/injection-tokens.constant";

@Component({
  selector: 'component-level-child',
  templateUrl: 'component-level-child.component.html'
})
export class ComponentLevelChildComponent extends ChildComponent {

  //#region Properties

  //#endregion

  //#region Constructor

  public constructor(@Inject(MESSAGE_BUS_SERVICE_INJECTOR) public messageBusService: INgRxMessageBusService) {
    super(messageBusService);
  }

  //#endregion

  //#region Methods

  //#endregion
}
