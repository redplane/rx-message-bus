export class ChannelInitializationEvent {

  //#region Properties

  private readonly _channelName: string;

  private readonly _eventName: string;

  //#endregion

  //#region Accessors

  public get channelName(): string {
    return this._channelName;
  }

  public get eventName(): string {
    return this._eventName;
  }

  //#endregion

  //#region Constructor

  public constructor(channelName: string, eventName: string) {
    this._channelName = channelName;
    this._eventName = eventName;
  }

  //#endregion
}
