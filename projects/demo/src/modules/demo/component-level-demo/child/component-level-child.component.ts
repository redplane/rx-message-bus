import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input} from '@angular/core';
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

  private __title: string;

  //#endregion

  //#region Accessors

  public get title(): string {
    return this.__title;
  }

  @Input()
  public set title(value: string) {
    this.__title = value;
  }

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
