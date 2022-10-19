import {RpcRequest} from '@message-bus/core';

@RpcRequest('system-time', 'get')
export class LoadTimeCommand {

  //#region Constructor

  public constructor() {
  }

  //#endregion

}
