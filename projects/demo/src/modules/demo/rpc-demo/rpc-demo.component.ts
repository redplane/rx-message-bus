import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {IMessageBusService, IRpcService, MESSAGE_BUS_SERVICE, RPC_SERVICE, RpcMessage} from '@message-bus/core';
import {Observable, ReplaySubject, Subscription} from 'rxjs';
import {LoadTimeCommand} from '../../../models/rpc-methods/load-time-command';

@Component({
  selector: 'rpc-demo',
  templateUrl: 'rpc-demo.component.html',
  styleUrls: ['rpc-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RpcDemoComponent implements OnInit, OnDestroy {

  //#region Properties

  private __systemMessages: string[];

  private __sendingCommand: boolean;

  // Subscription watch list.
  private readonly __subscription: Subscription;

  //#endregion

  //#region Accessors

  public get systemMessages(): string[] {
    return this.__systemMessages;
  }

  //#endregion

  //#region Constructor

  public constructor(@Inject(MESSAGE_BUS_SERVICE)
                     protected readonly _messageBusService: IMessageBusService,
                     @Inject(RPC_SERVICE)
                     protected readonly _rpcService: IRpcService,
                     protected readonly _changeDetectorRef: ChangeDetectorRef) {
    this.__sendingCommand = false;
    this.__systemMessages = [];
    this.__subscription = new Subscription();
  }

  //#endregion

  //#region Life cycle hooks

  public ngOnInit(): void {

    const hookMethodsRequestsSubscription = this._rpcService
      .hookMethodsRequestsAsync()
      .subscribe((message: RpcMessage<any>) => {
        const szMessage = `<b>${message.namespace}</b>-<b>${message.method}</b>-<b>${message.id}</b>: <i>${JSON.stringify(message.data)}</i>`;
        this.__systemMessages.push(szMessage);
        this._changeDetectorRef.markForCheck();
      });
    this.__subscription.add(hookMethodsRequestsSubscription);

    const hookMethodRequestsSubscription = this._rpcService
      .hookMethodRequestAsync(LoadTimeCommand)
      .subscribe((message: RpcMessage<any>) => {
        const szMessage = `<b>${message.namespace}</b>-<b>${message.method}</b>-<b>${message.id}</b>: <i>${JSON.stringify(message.data)}</i>`;
        console.log(szMessage);
      });
    this.__subscription.add(hookMethodRequestsSubscription);

  }

  public ngOnDestroy(): void {
    this.__subscription?.unsubscribe();
  }

  //#endregion
}
