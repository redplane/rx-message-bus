import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MessageChannelNameConstant} from '../../../../constants/message-channel-name.constant';
import {MessageEventNameConstant} from '../../../../constants/message-event-name.constant';
import {Subscription} from 'rxjs';
import {MESSAGE_BUS_SERVICE, IMessageBusService} from '@message-bus/core';

@Component({
  selector: 'message-listener',
  templateUrl: 'message-listener.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageListenerComponent implements OnInit, OnDestroy {

  //#region Properties

  public message: string;

  private _hookMessageSubscription: Subscription;

  //#endregion

  //#region Constructor

  public constructor(@Inject(MESSAGE_BUS_SERVICE) protected messageBusService: IMessageBusService) {
  }


  //#endregion

  //#region Methods

  public ngOnInit(): void {
    this._hookMessageSubscription = this.messageBusService
      .hookMessageChannel(MessageChannelNameConstant.ui, MessageEventNameConstant.deleteMessage)
      .subscribe((message: string) => {
        this.message = message;
      });
  }

  public ngOnDestroy(): void {
    if (this._hookMessageSubscription && !this._hookMessageSubscription.closed) {
      this._hookMessageSubscription.unsubscribe();
    }
  }

  //#endregion
}
