import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {MessageChannelNameConstant} from '../../constants/message-channel-name.constant';
import {MessageEventNameConstant} from '../../constants/message-event-name.constant';
import {IMessageBusService, MESSAGE_BUS_SERVICE} from '@message-bus/core';
import {ModuleLevelMessageEvent} from '../../models/module-level.message-event';

@Component({
  selector: 'child-component',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class ChildComponent implements OnDestroy {

  //#region Properties

  private _message: string;

  private _typedMessage: string;

  private  readonly __subscription: Subscription;

  //#endregion

  //#region Accessors

  public get message(): string {
    return this._message;
  }

  public set message(value: string) {
    this._message = value;
  }

  public get typedMessage(): string {
    return this._typedMessage;
  }

  //#endregion

  //#region Constructor

  protected constructor(@Inject(MESSAGE_BUS_SERVICE) protected readonly _messageBusService: IMessageBusService,
                        protected readonly _changeDetectorRef: ChangeDetectorRef) {

    // Initialize subscription manager.
    this.__subscription = new Subscription();

    const hookParentMessageSubscription = this._messageBusService
      .hookMessageChannel(MessageChannelNameConstant.parent,
        MessageEventNameConstant.sendParentMessage)
      .subscribe((message: string) => {
        this._message = message;
        this._changeDetectorRef.markForCheck();
      });

    const hookParentTypedMessageSubscription = this._messageBusService
      .hookMessage(ModuleLevelMessageEvent)
      .subscribe(({message}) => {
        this._typedMessage = message;
        this._changeDetectorRef.markForCheck();
      });

    this.__subscription.add(hookParentMessageSubscription);
    this.__subscription.add(hookParentTypedMessageSubscription);
  }

  //#endregion

  //#region Methods

  public ngOnDestroy(): void {

    // Destroy the subscription to prevent memory leak.
    if (this.__subscription && !this.__subscription.closed) {
      this.__subscription.unsubscribe();
    }
  }

  //#endregion
}
