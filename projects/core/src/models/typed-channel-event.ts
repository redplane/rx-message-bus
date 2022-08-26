/*
* @deprecated Use class with hookMessage method instead.
* */
export abstract class TypedChannelEvent<T> {

  //#region Properties

  readonly abstract channelName: string;

  readonly abstract eventName: string;

  //#endregion

  //#region Constructor

  //#endregion

}
