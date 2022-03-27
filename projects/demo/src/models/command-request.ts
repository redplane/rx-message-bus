import {v4 as uuid} from 'uuid';

export abstract class CommandRequest {

  //#region Properties

  public readonly id: string;

  //#endregion

  //#region Constructor

  protected constructor(id?: string) {

    if (!id) {
      this.id = uuid();
    } else {
      this.id = id;
    }
  }

  //#endregion

}
