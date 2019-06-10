import {Component, Inject} from "@angular/core";
import {ChildComponent} from "../../child.component";
import {IRxMessageBusService} from "../../../../../../ngrx-message-bus/src/lib/rx-message-bus-service.interface";

@Component({
  selector: 'component-level-child',
  templateUrl: 'component-level-child.component.html'
})
export class ComponentLevelChildComponent extends ChildComponent {

  //#region Properties

  //#endregion

  //#region Constructor

  public constructor(@Inject('IRxMessageBusService') public messageBusService: IRxMessageBusService) {
    super(messageBusService);
  }

  //#endregion

  //#region Methods

  //#endregion
}
