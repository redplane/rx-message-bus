import {Component, Inject, OnInit} from "@angular/core";
import {INgRxMessageBusService} from "../../../../../ngrx-message-bus/src/lib/ngrx-message-bus-service.interface";
import {MessageChannelNameConstant} from "../../../constants/message-channel-name.constant";
import {MessageEventNameConstant} from "../../../constants/message-event-name.constant";
import {Moment} from "moment";
import { LocalTimePipe} from "ngx-moment";

@Component({
  selector: 'delete-message-demo',
  templateUrl: 'delete-message-demo.component.html',
  styleUrls: ['./delete-message-demo.component.scss']
})
export class DeleteMessageDemoComponent implements OnInit {

  //#region Properties

  public shouldComponentAvailable: boolean;

  //#endregion

  //#region Constructor

  public constructor(@Inject('INgRxMessageBusService') protected messageBusService: INgRxMessageBusService,
                     protected localTimePipe: LocalTimePipe) {
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
    const localTime = this.localTimePipe.transform(date);
    this.messageBusService
      .addMessage<string>(MessageChannelNameConstant.ui, MessageEventNameConstant.deleteMessage, localTime.format('YYYY-MM-DD HH:mm'));
  }

  public clickDeleteMessage(): void {
    this.messageBusService
      .deleteChannelMessage(MessageChannelNameConstant.ui, MessageEventNameConstant.deleteMessage);

    this.shouldComponentAvailable = false;
  }

  //#endregion
}
