import {Component, Inject, OnDestroy, Optional, SkipSelf} from "@angular/core";
import {INgRxMessageBusService} from "../../../../../../ngrx-message-bus/src/lib/ngrx-message-bus-service.interface";
import {Subscription} from "rxjs";

@Component({
  selector: 'hook-level-child',
  templateUrl: 'hook-channel-event-child.component.html',
})
export class HookChannelEventChildComponent implements OnDestroy {

  //#region Properties

  private _hookChannelMessageSubscription: Subscription;

  public message: string;

  //#endregion]

  //#region Constructor

  public constructor(
    @SkipSelf() @Optional() @Inject('INgRxMessageBusService') public messageBusService: INgRxMessageBusService) {

    this.messageBusService
      .channelAddedEvent
      .subscribe(instance => {
        this.handleChannelCreateEvent(instance.channelName, instance.eventName);
      })
  }

  //#endregion

  //#region Methods

  public ngOnDestroy(): void {
    if (this._hookChannelMessageSubscription && !this._hookChannelMessageSubscription.closed) {
      this._hookChannelMessageSubscription.unsubscribe();
    }
  }

  protected handleChannelCreateEvent(channelName: string, channelEventName: string): void {
    this._hookChannelMessageSubscription = this._hookChannelMessageSubscription = this.messageBusService
      .hookMessageChannel(channelName, channelEventName)
      .subscribe((message: string) => this.message = message);
  }


  //#endregion
}
