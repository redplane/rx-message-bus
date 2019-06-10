import {Inject, OnDestroy} from "@angular/core";
import {IRxMessageBusService} from "../../../../ngrx-message-bus/src/lib/rx-message-bus-service.interface";
import {Subscription} from "rxjs";
import {MessageChannelNameConstant} from "../../constants/message-channel-name.constant";
import {MessageEventNameConstant} from "../../constants/message-event-name.constant";

export class ChildComponent implements OnDestroy {

  //#region Properties

  private _message: string;

  private _subscription: Subscription;

  //#endregion

  //#region Accessors

  public get message(): string {
    return this._message;
  }

  public set message(value: string) {
    this._message = value;
  }

  //#endregion

  //#region Constructor

  public constructor(@Inject('IRxMessageBusService') protected messageBusService: IRxMessageBusService) {

    // Initialize subscription manager.
    this._subscription = new Subscription();

    const hookParentMessageSubscription = this.messageBusService
      .hookMessageChannel(MessageChannelNameConstant.parent,
        MessageEventNameConstant.sendParentMessage,
        false, {
          subscriptionAttemptMode: 'infinite',
          channelConnectionAttemptDelay: 100
        })
      .subscribe((message: string) => {
        this._message = message;
      });

    this._subscription.add(hookParentMessageSubscription);
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
