import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {IMessageBusService, MESSAGE_BUS_SERVICE} from '@message-bus/core';
import {MessageChannelNameConstant} from '../../../constants/message-channel-name.constant';
import {MessageEventNameConstant} from '../../../constants/message-event-name.constant';
import {LocalTimePipe} from 'ngx-moment';

@Component({
  selector: 'delete-message-demo',
  templateUrl: 'delete-message-demo.component.html',
  styleUrls: ['./delete-message-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteMessageDemoComponent implements OnInit {

  //#region Properties

  public shouldComponentAvailable: boolean;

  //#endregion

  //#region Constructor

  public constructor(@Inject(MESSAGE_BUS_SERVICE) protected readonly _messageBusService: IMessageBusService,
                     protected readonly _localTimePipe: LocalTimePipe) {
    this.shouldComponentAvailable = false;
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
      .addMessage<string>(MessageChannelNameConstant.ui, MessageEventNameConstant.deleteMessage, localTime.format('YYYY-MM-DD HH:mm'));
  }

  public clickDeleteMessage(): void {
    this._messageBusService
      .deleteChannelMessage(MessageChannelNameConstant.ui, MessageEventNameConstant.deleteMessage);

    this.shouldComponentAvailable = false;
  }

  //#endregion
}
