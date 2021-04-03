import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {INgRxMessageBusService, IRpcService, ITypedRpcRequest, MESSAGE_BUS_SERVICE_PROVIDER, RPC_SERVICE_PROVIDER} from 'ngrx-message-bus';
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
  templateUrl: 'rpc-demo.component.html',
  styleUrls: ['rpc-demo.component.css']
})
export class RpcDemoComponent implements OnInit, OnDestroy {

  //#region Properties

  private readonly _namespace = 'demo-namespace';

  private readonly _method = 'demo-method';

  private _repliedRpcMessage = '';

  private _sendingCommand: boolean;

  private readonly _messageRespondTime = 5;

  private _loadedTime = '';

  // Whether message is being sent through rpc service or not.
  private _sendingMessageInRpcService = false;

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

  public get messageRespondTime(): number {
    return this._messageRespondTime;
  }

  public get sendingMessageInRpcService(): boolean {
    return this._sendingMessageInRpcService;
  }

  public get repliedRpcMessage(): string {
    return this._repliedRpcMessage;
  }

  //#endregion

  //#region Constructor

  public constructor(@Inject(MESSAGE_BUS_SERVICE_PROVIDER) protected messageBusService: INgRxMessageBusService,
                     @Inject(RPC_SERVICE_PROVIDER) protected rpcService: IRpcService) {
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
        delay(this._messageRespondTime * 1000)
      )
      .subscribe((value: GetTimeCommandRequest) => {
        const commandResponse = new GetTimeCommandResponse(value.id);
        this.messageBusService.addTypedMessage(new TimeUpdateMessageEvent(), commandResponse);
      });

    const typedRequest: ITypedRpcRequest<string, string> = {namespace: this._namespace, method: this._method};
    const hookRpcMessageSubscription = this.rpcService
      .hookMethodRequestAsync(typedRequest, {
        skipHistoricalMessages: true
      })
      .pipe(
        delay(5000)
      )
      .subscribe(message => {
        this.rpcService.sendResponse(typedRequest, message.id, 'Message has been resolved.');
      });

    this._subscription.add(hookTimeQuerySubscription);
    this._subscription.add(hookRpcMessageSubscription);
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

  public clickSendMessageInRpcMessage(): void {

    this._sendingMessageInRpcService = true;

    const typedRequest: ITypedRpcRequest<string, string> = {namespace: this._namespace, method: this._method};
    this.rpcService.sendRequestAsync(typedRequest, 'Hello world')
      .subscribe(x => {
        this._sendingMessageInRpcService = false;
        this._repliedRpcMessage = x;
      });
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
