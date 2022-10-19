import {ChangeDetectionStrategy, Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {IMessageBusService, MESSAGE_BUS_SERVICE} from '@message-bus/core';
import {GreetingChannelEvent} from '../../../../../core/e2e/src/models/greeting.channel-event';

@Component({
  selector: 'skip-historical-message-demo',
  templateUrl: 'skip-historical-message-demo.component.html',
  styleUrls: ['skip-historical-message-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkipHistoricalMessageDemoComponent implements OnInit, OnDestroy {

  //#region Properties

  // Whether message has been received or not.
  private _hasMessageReceived = false;

  // Subscription started or not.
  private _hasSubscriptionStarted = false;

  // Message which has been received from message bus.
  private _receivedMessage: string;

  // Whether historical message must be skipped.
  private _skipHistoricalMessage: boolean;

  private _historicalMessageSubscription: Subscription;

  //#endregion

  //#region Accessor

  public get hasMessageReceived(): boolean {
    return this._hasMessageReceived;
  }

  public get receivedMessage(): string {
    return this._receivedMessage;
  }

  public get hasSubscriptionStarted(): boolean {
    return this._hasSubscriptionStarted;
  }

  public get skipHistoricalMessage(): boolean {
    return this._skipHistoricalMessage;
  }

  public set skipHistoricalMessage(value: boolean) {
    this._skipHistoricalMessage = value;
  }

  //#endregion

  //#region Services

  protected readonly _messageBusService: IMessageBusService;

  //#endregion

  //#region Constructor

  public constructor(injector: Injector) {
    this._historicalMessageSubscription = new Subscription();

    // Service reflection.
    this._messageBusService = injector.get(MESSAGE_BUS_SERVICE);
  }

  //#endregion

  //#region Life cycle

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this.deleteSubscription();
  }

  //#endregion

  //#region Methods

  public clickStartSubscription(): void {

    // Delete the previous subscription.
    this.startSubscription();
  }

  //#endregion

  //#region Internal methods

  protected deleteSubscription(): void {
    if (this._historicalMessageSubscription && !this._historicalMessageSubscription.closed) {
      this._historicalMessageSubscription.unsubscribe();
    }

    this._hasMessageReceived = false;
    this._hasSubscriptionStarted = false;
  }

  protected startSubscription(): void {
    this.deleteSubscription();

    // Send message.
    this._messageBusService.addMessageInstance(new GreetingChannelEvent(`${new Date()}: This is a sample message`));

    this._historicalMessageSubscription = this._messageBusService
      .hookMessageChannelByType(GreetingChannelEvent, {skipHistoricalMessages: this.skipHistoricalMessage})
      .subscribe(({message}) => {
        this._receivedMessage = message;
        this._hasMessageReceived = true;
      });

    this._hasSubscriptionStarted = true;
  }

  //#endregion

}
