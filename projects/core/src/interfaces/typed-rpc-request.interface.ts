export interface ITypedRpcRequest<TRequest, TResponse> {

  //#region Properties

  readonly namespace: string;

  readonly method: string;

  //#endregion

}
