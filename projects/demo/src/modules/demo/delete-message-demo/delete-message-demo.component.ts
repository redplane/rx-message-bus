import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {IMessageBusService, MESSAGE_BUS_SERVICE} from '@message-bus/core';
import {MessageChannelNameConstant} from '../../../constants/message-channel-name.constant';
import {MessageEventNameConstant} from '../../../constants/message-event-name.constant';
import {LocalTimePipe} from 'ngx-moment';
import {delay, timeout} from 'rxjs/operators';
import {of, Subscription} from 'rxjs';

@Component({
  selector: 'delete-message-demo',
  templateUrl: 'delete-message-demo.component.html',
  styleUrls: ['./delete-message-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteMessageDemoComponent implements OnInit {

  //#region Properties

  private readonly __subscription = new Subscription();

  private __ableToSendMessage = true;

  public shouldComponentAvailable = false;

  //#endregion

  //#region Accessors

  public get ableToSendMessage(): boolean {
    return this.__ableToSendMessage;
  }

  //#endregion

  //#region Constructor

  public constructor(@Inject(MESSAGE_BUS_SERVICE) protected readonly _messageBusService: IMessageBusService,
                     protected readonly _changeDetectorRef: ChangeDetectorRef,
                     protected readonly _localTimePipe: LocalTimePipe) {
  }

  //#endregion

  //#region Methods


  public ngOnInit(): void {
    this.clickSendMessage();
  }

  public clickToggleComponent(): void {
    this.shouldComponentAvailable = !this.shouldComponentAvailable;
  }

  public clickSendMessage(): void {
    const date = new Date();
    const localTime = this._localTimePipe.transform(date);
    this._messageBusService
      .addMessage<string>(MessageChannelNameConstant.ui, MessageEventNameConstant.deleteMessage, localTime.format('YYYY-MM-DD HH:mm:ss'));
  }

  public clickDeleteMessage(): void {
    this._messageBusService
      .deleteChannelMessage(MessageChannelNameConstant.ui, MessageEventNameConstant.deleteMessage);

    const previousStatus = this.shouldComponentAvailable;
    this.shouldComponentAvailable = false;
    this.__ableToSendMessage = false;

    const subscription = of(void (0))
      .pipe(
        delay(2000)
      )
      .subscribe(() => {
        this.shouldComponentAvailable = previousStatus;
        this.__ableToSendMessage = true;
        this._changeDetectorRef.markForCheck();
      });
    this.__subscription.add(subscription);
  }

  //#endregion
}
