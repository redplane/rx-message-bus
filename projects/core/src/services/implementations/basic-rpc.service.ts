import {IRpcService} from '../interfaces/rpc-service.interface';
import {Observable, OperatorFunction, ReplaySubject, Subject} from 'rxjs';
import {take, timeout} from 'rxjs/operators';
import {MessageBusService} from './message-bus.service';
import {RpcMessage} from '../../models/rpc-message';
import {IHookMethodRequestOptions} from '../../interfaces/hook-method-request-options';
import {Injectable, Type} from '@angular/core';
import {METHOD_METADATA, NAMESPACE_METADATA} from '../../decorators';

function timeoutWhen<T>(cond: boolean, value: number): OperatorFunction<T, T> {
  return function (source: Observable<T>): Observable<T> {
    return cond ? source.pipe(timeout(value)) : source;
  };
}

@Injectable()
export class BasicRpcService extends MessageBusService implements IRpcService {

  //#region Properties

  private readonly __keyToSubject: Record<string, Subject<any>>;

  private readonly __methodsRequest$: Subject<any>;

  //#endregion

  //#region Constructor

  public constructor() {
    super();

    this.__keyToSubject = {};
    this.__methodsRequest$ = new Subject<any>();
  }

  //#endregion

  //#region Methods

  public sendRequestAsync<TRequest, TResponse>(
    data: TRequest,
    timeoutInMilliseconds?: number
  ): Observable<TResponse> {

    if (!Reflect.hasMetadata(NAMESPACE_METADATA, data) || !Reflect.hasMetadata(METHOD_METADATA, data)) {
      throw new Error('Metadata is not found. Did you forget to add RpcRequest decorator on the target class ?');
    }

    const namespace = Reflect.getMetadata(NAMESPACE_METADATA, data);
    const method = Reflect.getMetadata(METHOD_METADATA, data);

    // Built the message which should be sent.
    const sentMessage = new RpcMessage<TRequest>(
      `${namespace}-request`,
      method,
      data
    );

    const actualKey = this._getRpcKey(
      namespace,
      method,
      sentMessage.id
    );
    const resolver = new ReplaySubject<TResponse>(1);
    this.__keyToSubject[actualKey] = resolver;

    // Broadcast about this request.
    const actualRequestNamespace = this._getRequestNamespace(
      namespace
    );
    this.addMessage(actualRequestNamespace, method, sentMessage);
    this.__methodsRequest$.next(sentMessage);

    return resolver.pipe(
      timeoutWhen(timeoutInMilliseconds > 0, timeoutInMilliseconds),
      take(1)
    );
  }

  public sendResponse<TRequest, TResponse>(
    type: Type<TRequest>,
    messageId: string,
    data: TResponse
  ) {
    const resolver = this._getResolver(type, messageId);
    resolver.next(data);
  }

  public hookMethodRequestAsync<TRequest, TResponse>(
    type: Type<TRequest>,
    options?: IHookMethodRequestOptions
  ): Observable<RpcMessage<TResponse>> {

    const instance = new type();
    const namespace = Reflect.getMetadata(NAMESPACE_METADATA, instance);
    const method = Reflect.getMetadata(METHOD_METADATA, instance);

    if (!Reflect.hasMetadata(NAMESPACE_METADATA, instance) || !Reflect.hasMetadata(METHOD_METADATA, instance)) {
      throw new Error('Metadata is not found. Did you forget to add RpcRequest decorator on the target class ?');
    }

    const actualNamespace = this._getRequestNamespace(namespace);
    return super.hookMessageChannel<RpcMessage<TResponse>>(
      actualNamespace,
      method,
      options
    );
  }

  public hookMethodsRequestsAsync<TResponse>()
    : Observable<RpcMessage<TResponse>> {
    return this.__methodsRequest$.asObservable();
  }

  public sendException<TRequest, TException>(type: Type<TRequest>,
                                             messageId: string, exception: TException) {
    const resolver = this._getResolver(type, messageId);
    resolver.error(exception);
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

  protected _getResolver<T>(type: Type<T>, messageId: string): Subject<any> {
    const instance = new type();
    const namespace = Reflect.getMetadata(NAMESPACE_METADATA, instance);
    const method = Reflect.getMetadata(METHOD_METADATA, instance);

    if (!Reflect.hasMetadata(NAMESPACE_METADATA, instance) || !Reflect.hasMetadata(METHOD_METADATA, instance)) {
      throw new Error('Metadata is not found. Did you forget to add RpcRequest decorator on the target class ?');
    }

    const actualKey = this._getRpcKey(
      namespace,
      method,
      messageId
    );
    if (!this.__keyToSubject[actualKey]) {
      return;
    }

    return this.__keyToSubject[actualKey];
  }

  //#endregion
}
