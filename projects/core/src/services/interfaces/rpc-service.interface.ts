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
  sendResponse<TRequest, TResponse>(type: Type<TRequest>, messageId: string, data: TResponse): void;

  sendException<TRequest, TException>(type: Type<TRequest>, messageId: string, exception: TException);

  // Hook method request asynchronously
  hookMethodRequestAsync<TRequest, TResponse>(type: Type<TRequest>,
                            options?: IHookMethodRequestOptions): Observable<RpcMessage<TResponse>>;

  hookMethodsRequestsAsync<TResponse>(): Observable<RpcMessage<TResponse>>;

  //#endregion

}
