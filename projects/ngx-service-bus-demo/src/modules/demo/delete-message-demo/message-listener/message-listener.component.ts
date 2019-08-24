import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {INgRxMessageBusService} from "../../../../../../ngrx-message-bus/src/services/interfaces/ngrx-message-bus-service.interface";
import {MessageChannelNameConstant} from "../../../../constants/message-channel-name.constant";
import {MessageEventNameConstant} from "../../../../constants/message-event-name.constant";
import {Subscription} from "rxjs";
import {MESSAGE_BUS_SERVICE_INJECTOR} from "../../../../../../ngrx-message-bus/src/constants/injection-tokens.constant";

@Component({
  selector: 'message-listener',
  templateUrl: 'message-listener.component.html'
})
export class MessageListenerComponent implements OnInit, OnDestroy {

  //#region Properties

  public message: string;

  private _hookMessageSubscription: Subscription;

  //#endregion

  //#region Constructor

  public constructor(@Inject(MESSAGE_BUS_SERVICE_INJECTOR) protected messageBusService: INgRxMessageBusService) {
  }


  //#endregion

  //#region Methods

  public ngOnInit(): void {
    this._hookMessageSubscription = this.messageBusService
      .hookMessageChannel(MessageChannelNameConstant.ui, MessageEventNameConstant.deleteMessage)
      .subscribe((message: string) => {
        this.message = message;
      })
  }

  public ngOnDestroy(): void {
    if (this._hookMessageSubscription && !this._hookMessageSubscription.closed) {
      this._hookMessageSubscription.unsubscribe();
    }
  }

  //#endregion
}
