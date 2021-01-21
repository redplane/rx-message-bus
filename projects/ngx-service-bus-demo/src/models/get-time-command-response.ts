import {CommandRequest} from './command-request';

export class GetTimeCommandResponse extends CommandRequest {

  //#region Properties

  public readonly value: Date;

  //#endregion

  //#region Constructor

  public constructor(id?: string) {
    super(id);
    this.value = new Date();
  }

  //#endregion

}
