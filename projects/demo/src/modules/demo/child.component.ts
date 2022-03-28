import {Component, Inject, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {MessageChannelNameConstant} from '../../constants/message-channel-name.constant';
import {MessageEventNameConstant} from '../../constants/message-event-name.constant';
import {MESSAGE_BUS_SERVICE, IMessageBusService} from '@message-bus/core';
import {ModuleLevelMessageEvent} from '../../models/module-level.message-event';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'child-component',
  template: ''
})
export abstract class ChildComponent implements OnDestroy {

  //#region Properties

  private _message: string;

  private _typedMessage: string;

  private _subscription: Subscription;

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

  protected constructor(@Inject(MESSAGE_BUS_SERVICE) protected readonly _messageBusService: IMessageBusService) {

    // Initialize subscription manager.
    this._subscription = new Subscription();

    const hookParentMessageSubscription = this._messageBusService
      .hookMessageChannel(MessageChannelNameConstant.parent,
        MessageEventNameConstant.sendParentMessage)
      .subscribe((message: string) => {
        this._message = message;
      });

    const channelEvent = new ModuleLevelMessageEvent();
    const hookParentTypedMessageSubscription = this._messageBusService
      .hookTypedMessageChannel(channelEvent)
      .subscribe((value: string) => {
        this._typedMessage = value;
      });

    this._subscription.add(hookParentMessageSubscription);
    this._subscription.add(hookParentTypedMessageSubscription);
  }

  //#endregion

  //#region Methods

  public ngOnDestroy(): void {

    // Destroy the subscription to prevent memory leak.
    if (this._subscription && !this._subscription.closed) {
      this._subscription.unsubscribe();
    }
  }

  //#endregion
}