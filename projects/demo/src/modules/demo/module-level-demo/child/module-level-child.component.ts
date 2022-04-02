import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {ChildComponent} from '../../child.component';
import {IMessageBusService, MESSAGE_BUS_SERVICE} from '@message-bus/core';

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

  public constructor(
    changeDetectorRef: ChangeDetectorRef,
    @Inject(MESSAGE_BUS_SERVICE) public readonly _messageBusService: IMessageBusService) {
    super(_messageBusService, changeDetectorRef);
  }

  //#endregion

  //#region Methods

  //#endregion
}
