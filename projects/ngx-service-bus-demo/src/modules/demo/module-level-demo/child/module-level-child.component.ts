import {Component, Inject} from "@angular/core";
import {ChildComponent} from "../../child.component";
import {INgRxMessageBusService} from "../../../../../../ngrx-message-bus/src/lib/ngrx-message-bus-service.interface";

@Component({
  selector: 'module-level-child',
  templateUrl: 'module-level-child.component.html'
})
export class ModuleLevelChildComponent extends ChildComponent {

  //#region Properties

  //#endregion

  //#region Constructor

  public constructor(@Inject('INgRxMessageBusService') public messageBusService: INgRxMessageBusService) {
    super(messageBusService);
  }

  //#endregion

  //#region Methods

  //#endregion
}
