import {Observable} from 'rxjs';
import {IHookMethodRequestOptions} from '../../interfaces/hook-method-request-options';
import {ITypedRpcRequest} from '../../interfaces/typed-rpc-request.interface';
import {RpcMessage} from '../../models';

export interface IRpcService {

  //#region Methods

  // Call a remote function asynchronously.
  sendRequestAsync<TRequest, TResponse>(typedRequest: ITypedRpcRequest<TRequest, TResponse>,
                                        data: TRequest,
                                        timeoutInMilliseconds?: number): Observable<TResponse>;

  // Send a response from requested function
  sendResponse<TRequest, TResponse>(sentMessage: ITypedRpcRequest<TRequest, TResponse>, messageId: string, data: TResponse): void;

  // Hook method request asynchronously
  hookMethodRequestAsync<TRequest, TResponse>(typedRequest: ITypedRpcRequest<TRequest, TResponse>,
                            options?: IHookMethodRequestOptions): Observable<RpcMessage<TResponse>>;

  //#endregion

}
