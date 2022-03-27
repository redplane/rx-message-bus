import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {ChildComponent} from '../../child.component';
import {INgRxMessageBusService, MESSAGE_BUS_SERVICE_PROVIDER} from '@message-bus/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'module-level-child',
  templateUrl: 'module-level-child.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModuleLevelChildComponent extends ChildComponent {

  //#region Properties

  //#endregion

  //#region Constructor

  public constructor(@Inject(MESSAGE_BUS_SERVICE_PROVIDER) public messageBusService: INgRxMessageBusService) {
    super(messageBusService);
  }

  //#endregion

  //#region Methods

  //#endregion
}
