import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {INgRxMessageBusService, MESSAGE_BUS_SERVICE_PROVIDER} from 'ngrx-message-bus';
import {GreetingChannelEvent} from '../../../../../ngrx-message-bus/e2e/src/models/greeting.channel-event';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'skip-historical-message-demo',
  templateUrl: 'skip-historical-message-demo.component.html',
  styleUrls: ['skip-historical-message-demo.component.css']
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

  protected readonly _messageBusService: INgRxMessageBusService;

  //#endregion

  //#region Constructor

  public constructor(injector: Injector) {
    this._historicalMessageSubscription = new Subscription();

    // Service reflection.
    this._messageBusService = injector.get(MESSAGE_BUS_SERVICE_PROVIDER);
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
    this._messageBusService.addTypedMessage(new GreetingChannelEvent(), `${new Date()}: This is a sample message`);

    this._historicalMessageSubscription = this._messageBusService
      .hookTypedMessageChannel(new GreetingChannelEvent(), {skipHistoricalMessages: this.skipHistoricalMessage})
      .subscribe((message: string) => {
        this._receivedMessage = message;
        this._hasMessageReceived = true;
      });

    this._hasSubscriptionStarted = true;
  }

  //#endregion

}
