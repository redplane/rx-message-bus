import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {IMessageBusService, IRpcService, ITypedRpcRequest, MESSAGE_BUS_SERVICE, RPC_SERVICE} from '@message-bus/core';
import {Observable, ReplaySubject, Subscription} from 'rxjs';
import {TimeQueryMessageEvent} from '../../../models/time-query.message-event';
import {GetTimeCommandRequest} from '../../../models/get-time-command-request';
import {delay, finalize, take} from 'rxjs/operators';
import {TimeUpdateMessageEvent} from '../../../models/time-update.message-event';
import {GetTimeCommandResponse} from '../../../models/get-time-command-response';
import * as moment from 'moment';

@Component({
  selector: 'rpc-demo',
  templateUrl: 'rpc-demo.component.html',
  styleUrls: ['rpc-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RpcDemoComponent implements OnInit, OnDestroy {

  //#region Properties

  private readonly _namespace = 'demo-namespace';

  private readonly _method = 'demo-method';

  private _sendingCommand: boolean;

  private readonly _messageRespondTime = 5;

  // Subscription watch list.
  private _subscription: Subscription;

  //#endregion

  //#region Accessors

  //#endregion

  //#region Constructor

  public constructor(@Inject(MESSAGE_BUS_SERVICE) protected readonly _messageBusService: IMessageBusService,
                     @Inject(RPC_SERVICE) protected readonly _rpcService: IRpcService,
                     protected readonly _changeDetectorRef: ChangeDetectorRef) {
    this._sendingCommand = false;
    this._subscription = new Subscription();
  }

  //#endregion

  //#region Life cycle hooks

  public ngOnInit(): void {

    // Initialize subscription watch list.
    this._subscription = new Subscription();

    // Fake listener to listen to time query command.
    // Wait for 10 seconds and reply to requested command.
    const hookTimeQuerySubscription = this._messageBusService
      .hookTypedMessageChannel(new TimeQueryMessageEvent())
      .pipe(
        delay(this._messageRespondTime * 1000)
      )
      .subscribe((value: GetTimeCommandRequest) => {
        const commandResponse = new GetTimeCommandResponse(value.id);
        this._messageBusService.addTypedMessage(new TimeUpdateMessageEvent(), commandResponse);
      });

    const typedRequest: ITypedRpcRequest<string, string> = {namespace: this._namespace, method: this._method};
    const hookRpcMessageSubscription = this._rpcService
      .hookMethodRequestAsync(typedRequest, {
        skipHistoricalMessages: true
      })
      .pipe(
        delay(5000)
      )
      .subscribe(message => {
        this._rpcService.sendResponse(typedRequest, message.id, 'Message has been resolved.');
        this._changeDetectorRef.markForCheck();
      });

    this._subscription.add(hookTimeQuerySubscription);
    this._subscription.add(hookRpcMessageSubscription);
  }

  public ngOnDestroy(): void {
    if (this._subscription && !this._subscription.closed) {
      this._subscription.unsubscribe();
    }
  }

  //#endregion

  //#region Internal methods

  protected loadTimeAsync(): Observable<string> {
    const resolver = new ReplaySubject<string>(1);
    this._messageBusService.hookTypedMessageChannel(new TimeUpdateMessageEvent())
      .pipe(
        take(1)
      )
      .subscribe((value: GetTimeCommandResponse) => {
        resolver.next(moment(value.value).format('YYYY-MM-DD HH:mm:ss'));
      });

    this._messageBusService.addTypedMessage(new TimeQueryMessageEvent(), new GetTimeCommandRequest());
    return resolver.pipe(take(1));
  }

  //#endregion

}
