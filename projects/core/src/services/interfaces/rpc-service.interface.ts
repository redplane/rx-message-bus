import {Observable} from 'rxjs';
import {IHookMethodRequestOptions} from '../../interfaces/hook-method-request-options';
import {RpcMessage} from '../../models';
import {Type} from '@angular/core';

export interface IRpcService {

  //#region Methods

  // Call a remote function asynchronously.
  sendRequestAsync<TRequest, TResponse>(data: TRequest,
                                        timeoutInMilliseconds?: number): Observable<TResponse>;

  // Send a response from requested function
  sendResponseByType<TRequest, TResponse>(type: Type<TRequest>, messageId: string, data: TResponse): void;

  sendResponse<TResponse>(namespace: string, method: string, messageId: string, data: TResponse): void;

  sendExceptionByType<TRequest, TException>(type: Type<TRequest>, messageId: string, exception: TException);

  sendException<TException>(namespace: string, method: string, messageId: string, exception: TException);

  // Hook method request asynchronously
  hookMethodRequestAsync<TRequest, TResponse>(type: Type<TRequest>,
                                              options?: IHookMethodRequestOptions): Observable<RpcMessage<TResponse>>;

  hookMethodsRequestsAsync<TResponse>(): Observable<RpcMessage<TResponse>>;

  //#endregion

}
