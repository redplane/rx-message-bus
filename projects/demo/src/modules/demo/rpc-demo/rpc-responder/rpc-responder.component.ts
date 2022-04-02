import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {RPC_SERVICE, IRpcService, RpcMessage} from '@message-bus/core';
import {Subscription} from 'rxjs';
import {RpcNamespaces} from '../../../../constants/rpc-namespaces';
import {RpcMethodNames} from '../../../../constants/rpc-method-names';

@Component({
  selector: 'rpc-responder',
  templateUrl: 'rpc-responder.component.html',
  styleUrls: ['rpc-responder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RpcResponderComponent implements OnInit, OnDestroy {

  //#region Properties

  // Whether request has been received or not.
  private __messageId = '';

  protected readonly _subscription: Subscription;

  //#endregion

  //#region Accessors

  public get messageId(): string {
    return this.__messageId;
  }

  public get hasMessage(): boolean {
    return this.__messageId && this.__messageId.length > 0;
  }

  //#endregion

  //#region Constructor


  public constructor(@Inject(RPC_SERVICE) protected readonly _rpcService: IRpcService,
                     protected readonly _changeDetectorRef: ChangeDetectorRef) {
    this._subscription = new Subscription();
  }

//#endregion

  //#region Life cycle hooks

  public ngOnInit(): void {

    const message = new RpcMessage(RpcNamespaces.singleRpcNamespace, RpcMethodNames.getTime);
    const hookMessageSubscription = this._rpcService
      .hookMethodRequestAsync(message)
      .subscribe((receivedMessage: RpcMessage<any>) => {
        this.__messageId = receivedMessage.id;
        console.log('Received message ' + receivedMessage.id);
        this._changeDetectorRef.markForCheck();
      });
    this._subscription.add(hookMessageSubscription);
  }

  public ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  //#endregion

  //#region Methods

  public sendResponse(): void {

    if (!this.__messageId) {
      return;
    }

    const message = new RpcMessage(RpcNamespaces.singleRpcNamespace, RpcMethodNames.getTime);
    this._rpcService.sendResponse(message, this.__messageId, `${new Date().toISOString()}`);
    this.__messageId = '';
    this._changeDetectorRef.markForCheck();
  }

  //#endregion
}
