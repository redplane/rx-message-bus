import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {ChildComponent} from '../../child.component';
import {IMessageBusService, MESSAGE_BUS_SERVICE} from '@message-bus/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'component-level-child',
  templateUrl: 'component-level-child.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentLevelChildComponent extends ChildComponent {

  //#region Properties

  //#endregion

  //#region Constructor

  public constructor(@Inject(MESSAGE_BUS_SERVICE) public readonly _messageBusService: IMessageBusService) {
    super(_messageBusService);
  }

  //#endregion

  //#region Methods

  //#endregion
}
