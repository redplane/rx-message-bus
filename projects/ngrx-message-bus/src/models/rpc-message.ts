import {v4 as uuid} from 'uuid';

export class RpcMessage<TModel> {

  //#region Properties


  //#endregion

  //#region Constructor

  public constructor(public readonly namespace: string,
                     public readonly method: string,
                     public data?: TModel,
                     public readonly id?: string) {

    if (!id || !id.length) {
      this.id = uuid();
    }
  }

  //#endregion

}
