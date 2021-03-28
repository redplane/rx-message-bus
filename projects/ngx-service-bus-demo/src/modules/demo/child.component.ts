import {Component, Inject, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {MessageChannelNameConstant} from '../../constants/message-channel-name.constant';
import {MessageEventNameConstant} from '../../constants/message-event-name.constant';
import {INgRxMessageBusService} from '../../../../ngrx-message-bus/src/services/interfaces/ngrx-message-bus-service.interface';
import {MESSAGE_BUS_SERVICE_PROVIDER} from '../../../../ngrx-message-bus/src/constants/injection-tokens.constant';
import {TypedChannelEvent} from '../../../../ngrx-message-bus/src/models/typed-channel-event';
import {ModuleLevelMessageEvent} from '../../models/module-level.message-event';

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

  public constructor(@Inject(MESSAGE_BUS_SERVICE_PROVIDER) protected messageBusService: INgRxMessageBusService) {

    // Initialize subscription manager.
    this._subscription = new Subscription();

    const hookParentMessageSubscription = this.messageBusService
      .hookMessageChannel(MessageChannelNameConstant.parent,
        MessageEventNameConstant.sendParentMessage)
      .subscribe((message: string) => {
        this._message = message;
      });

    const channelEvent = new ModuleLevelMessageEvent();
    const hookParentTypedMessageSubscription = this.messageBusService
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
