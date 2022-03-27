import {IRpcService} from '../interfaces/rpc-service.interface';
import {Observable, of, OperatorFunction, ReplaySubject} from 'rxjs';
import {catchError, filter, map, take, timeout} from 'rxjs/operators';
import {MessageBusService} from './message-bus.service';
import {RpcMessage} from '../../models/rpc-message';
import {ITypedRpcRequest} from '../../interfaces/typed-rpc-request.interface';
import {IHookMethodRequestOptions} from '../../interfaces/hook-method-request-options';

function timeoutWhen<T>(cond: boolean, value: number): OperatorFunction<T, T> {
  return function (source: Observable<T>): Observable<T> {
    return cond ? source.pipe(timeout(value)) : source;
  };
}

export class BasicRpcService extends MessageBusService implements IRpcService {

  //#region Methods

  public sendRequestAsync<TRequest, TResponse>(sentRequest: ITypedRpcRequest<TRequest, TResponse>,
                                               data: TRequest,
                                               timeoutInMilliseconds?: number): Observable<TResponse> {

    // Built the message which should be sent.
    const sentMessage = new RpcMessage<TRequest>(`${sentRequest.namespace}-request`,
      sentRequest.method,
      data);

    // Whether exception has happened or not.
    let hasException = false;

    const resolver = new ReplaySubject<TResponse>(1);
    this.hookMessageChannel<RpcMessage<TResponse>>(
      `${sentRequest.namespace}-reply`, sentRequest.method)
      .pipe(
        timeoutWhen(timeoutInMilliseconds > 0, timeoutInMilliseconds),
        filter(incomingMessage => incomingMessage.id === sentMessage.id),
        take(1),
        map(incomingMessage => incomingMessage.data),
        catchError(exception => {
          resolver.error(exception);
          hasException = true;
          return of(void (0));
        })
      )
      .subscribe((value: TResponse) => {
        if (!hasException) {
          resolver.next(value);
        }
      });

    // Send the request message.
    this.addMessage<RpcMessage<TRequest>>(`${sentRequest.namespace}-request`, sentRequest.method, sentMessage);
    return resolver.pipe(take(1));
  }

  public sendResponse<TRequest, TResponse>(sentMessage: ITypedRpcRequest<TRequest, TResponse>, messageId: string, data: TResponse): void {
    const reply = new RpcMessage(`${sentMessage.namespace}-reply`, sentMessage.method, data, messageId);
    this.addMessage(`${sentMessage.namespace}-reply`, sentMessage.method, reply);
  }

  public hookMethodRequestAsync<TRequest, TResponse>(request: ITypedRpcRequest<TRequest, TResponse>,
                                                     options?: IHookMethodRequestOptions): Observable<RpcMessage<TResponse>> {
    return this.hookMessageChannel<RpcMessage<TResponse>>(`${request.namespace}-request`, request.method, options);
  }

  //#endregion
}
