import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {RPC_SERVICE, IRpcService, RpcMessage} from '@message-bus/core';
import {finalize, mergeMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {RpcNamespaces} from '../../../../constants/rpc-namespaces';
import {RpcMethodNames} from '../../../../constants/rpc-method-names';
import {MessageModalService} from '../../../shared/message-modal/message-modal.service';

@Component({
  selector: 'rpc-broadcaster',
  templateUrl: 'rpc-broadcaster.component.html',
  styleUrls: ['rpc-broadcaster.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RpcBroadcasterComponent implements OnInit, OnDestroy {

  //#region Properties

  private __sendingMessage = false;

  private __messageReceived = false;

  protected _subscription: Subscription;

  //#endregion

  //#region Accessors

  public get sendingMessage(): boolean {
    return this.__sendingMessage;
  }

  public get messageReceived(): boolean {
    return this.__messageReceived;
  }

  //#endregion

  //#region Constructor

  public constructor(@Inject(RPC_SERVICE) protected readonly _rpcService: IRpcService,
                     protected readonly _modalService: MessageModalService,
                     protected readonly _changeDetectorRef: ChangeDetectorRef) {
    this._subscription = new Subscription();
  }

  //#endregion

  //#region Life cycle hooks

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  //#endregion

  //#region Methods

  public sendMessage(): void {
    this.__sendingMessage = true;
    this.__messageReceived = false;

    const request = new RpcMessage(RpcNamespaces.singleRpcNamespace, RpcMethodNames.getTime, void (0));
    const sendMessageSubscription = this._rpcService
      .sendRequestAsync(request, void (0))
      .pipe(
        finalize(() => {
          this.__sendingMessage = false;
          this._changeDetectorRef.markForCheck();
        }),
        mergeMap((message: string) => {
          this.__messageReceived = true;
          return this._modalService.displayAsync(`Message has been received successfully: ${message}`, 'Received message');
        })
      )
      .subscribe();
    this._subscription.add(sendMessageSubscription);
  }

  //#endregion
}
