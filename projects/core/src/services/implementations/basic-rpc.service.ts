import {IRpcService} from '../interfaces/rpc-service.interface';
import {Observable, OperatorFunction, ReplaySubject, Subject} from 'rxjs';
import {take, timeout} from 'rxjs/operators';
import {MessageBusService} from './message-bus.service';
import {RpcMessage} from '../../models/rpc-message';
import {ITypedRpcRequest} from '../../interfaces/typed-rpc-request.interface';
import {IHookMethodRequestOptions} from '../../interfaces/hook-method-request-options';
import {Injectable} from '@angular/core';

function timeoutWhen<T>(cond: boolean, value: number): OperatorFunction<T, T> {
  return function (source: Observable<T>): Observable<T> {
    return cond ? source.pipe(timeout(value)) : source;
  };
}

@Injectable()
export class BasicRpcService extends MessageBusService implements IRpcService {

  //#region Properties

  private readonly __keyToSubject: Record<string, Subject<any>>;

  //#endregion

  //#region Constructor

  public constructor() {
    super();

    this.__keyToSubject = {};
  }

  //#endregion

  //#region Methods

  public sendRequestAsync<TRequest, TResponse>(
    sentRequest: ITypedRpcRequest<TRequest, TResponse>,
    data: TRequest,
    timeoutInMilliseconds?: number
  ): Observable<TResponse> {
    // Built the message which should be sent.
    const sentMessage = new RpcMessage<TRequest>(
      `${sentRequest.namespace}-request`,
      sentRequest.method,
      data
    );

    const actualKey = this._getRpcKey(
      sentRequest.namespace,
      sentRequest.method,
      sentMessage.id
    );
    const resolver = new ReplaySubject<TResponse>(1);
    this.__keyToSubject[actualKey] = resolver;

    // Broadcast about this request.
    const actualRequestNamespace = this._getRequestNamespace(
      sentRequest.namespace
    );
    this.addMessage(actualRequestNamespace, sentRequest.method, sentMessage);

    return resolver.pipe(
      timeoutWhen(timeoutInMilliseconds > 0, timeoutInMilliseconds),
      take(1)
    );
  }

  public sendResponse<TRequest, TResponse>(
    sentMessage: ITypedRpcRequest<TRequest, TResponse>,
    messageId: string,
    data: TResponse
  ) {
    const actualKey = this._getRpcKey(
      sentMessage.namespace,
      sentMessage.method,
      messageId
    );
    if (!this.__keyToSubject[actualKey]) {
      return;
    }

    const resolver = this.__keyToSubject[actualKey];
    resolver.next(data);
  }

  public hookMethodRequestAsync<TRequest, TResponse>(
    request: ITypedRpcRequest<TRequest, TResponse>,
    options?: IHookMethodRequestOptions
  ): Observable<RpcMessage<TResponse>> {
    const actualNamespace = this._getRequestNamespace(request.namespace);
    return super.hookMessageChannel<RpcMessage<TResponse>>(
      actualNamespace,
      request.method,
      options
    );
  }

  //#endregion

  //#region Internal methods

  protected _getRpcKey(
    namespace: string,
    method: string,
    messageId: string
  ): string {
    return `${namespace}.${method}.${messageId}`;
  }

  protected _getRequestNamespace(namespace: string): string {
    return `${namespace}-request`;
  }

  //#endregion
}
