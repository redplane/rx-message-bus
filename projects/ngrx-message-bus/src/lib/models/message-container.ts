export class MessageContainer<T> {

  //#region Properties

  private _data: T;

  private _createdTime: number;

  private _available: boolean;

  private _expiredTime: number | null;

  //#endregion

  //#region Accessors

  /*
  * Message data.
  * */
  public get data(): T {
    return this._data;
  }

  /*
  * Message data.
  * */
  public set data(value: T) {
    this._data = value;
  }

  /*
  * When the message was created.
  * */
  public get createdTime(): number {
    return this._createdTime;
  }

  /*
  * Whether message is available or not.
  * */
  public get available(): boolean {
    if (!this._available) {
      return false;
    }

    if (this._expiredTime != null && this._expiredTime < new Date().getTime()) {
      return false;
    }

    return true;
  }

  /*
  * Whether message is available or not.
  * */
  public set available(value: boolean) {
    this._available = value;

    if (value) {
      this._expiredTime = null;
    }
  }

  //#endregion

  //#region Constructor

  public constructor(data: T, available: boolean, lifetimeInSecond?: number) {
    this._data = data;
    this._available = available;
    this._createdTime = new Date().getTime();

    if (lifetimeInSecond) {
      this._expiredTime = this._createdTime + lifetimeInSecond * 1000;
    }

  }

  //#endregion

}
