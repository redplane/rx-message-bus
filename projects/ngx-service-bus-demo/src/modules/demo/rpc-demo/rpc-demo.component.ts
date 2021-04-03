import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {INgRxMessageBusService, MESSAGE_BUS_SERVICE_PROVIDER} from '../../../../../ngrx-message-bus/src/public_api';
import {Observable, ReplaySubject, Subject, Subscription} from 'rxjs';
import {TimeQueryMessageEvent} from '../../../models/time-query.message-event';
import {GetTimeCommandRequest} from '../../../models/get-time-command-request';
import {delay, filter, finalize, first, last, take} from 'rxjs/operators';
import {TimeUpdateMessageEvent} from '../../../models/time-update.message-event';
import {GetTimeCommandResponse} from '../../../models/get-time-command-response';
import * as moment from 'moment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'rpc-demo',
  templateUrl: 'rpc-demo.component.html'
})
export class RpcDemoComponent implements OnInit, OnDestroy {

  //#region Properties

  private _sendingCommand: boolean;

  private _loadedTime: string = '';

  // Subscription watch list.
  private _subscription: Subscription;

  //#endregion

  //#region Accessors

  public get sendingCommand(): boolean {
    return this._sendingCommand;
  }

  public get loadedTime(): string {
    return this._loadedTime;
  }

  //#endregion

  //#region Constructor

  public constructor(@Inject(MESSAGE_BUS_SERVICE_PROVIDER) protected messageBusService: INgRxMessageBusService) {
    this._sendingCommand = false;
    this._subscription = new Subscription();
  }

  //#endregion

  //#region Methods

  public ngOnInit(): void {

    // Initialize subscription watch list.
    this._subscription = new Subscription();

    // Fake listener to listen to time query command.
    // Wait for 10 seconds and reply to requested command.
    const hookTimeQuerySubscription = this.messageBusService
      .hookTypedMessageChannel(new TimeQueryMessageEvent())
      .pipe(
        delay(5 * 1000)
      )
      .subscribe((value: GetTimeCommandRequest) => {
        const commandResponse = new GetTimeCommandResponse(value.id);
        this.messageBusService.addTypedMessage(new TimeUpdateMessageEvent(), commandResponse);
      });

    this._subscription.add(hookTimeQuerySubscription);
  }

  public ngOnDestroy(): void {
    if (this._subscription && !this._subscription.closed) {
      this._subscription.unsubscribe();
    }
  }

  public clickSendCommand(): void {

    this._sendingCommand = true;

    const loadTimeSubscription = this.loadTimeAsync()
      .pipe(
        finalize(() => this._sendingCommand = false)
      )
      .subscribe(value => {
        this._sendingCommand = false;
        this._loadedTime = value;
      });

    this._subscription.add(loadTimeSubscription);
  }

  protected loadTimeAsync(): Observable<string> {
    const resolver = new ReplaySubject<string>(1);
    this.messageBusService.hookTypedMessageChannel(new TimeUpdateMessageEvent())
      .pipe(
        take(1)
      )
      .subscribe((value: GetTimeCommandResponse) => {
        resolver.next(moment(value.value).format('YYYY-MM-DD HH:mm:ss'));
      });

    this.messageBusService.addTypedMessage(new TimeQueryMessageEvent(), new GetTimeCommandRequest());
    return resolver.pipe(take(1));
  }

  //#endregion

}
