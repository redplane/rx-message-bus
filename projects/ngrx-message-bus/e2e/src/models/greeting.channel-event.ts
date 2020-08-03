import {TypedChannelEvent} from '../../../src/models/typed-channel-event';
import {Greeting} from './greeting';

export class GreetingChannelEvent extends TypedChannelEvent<Greeting> {

  //#region Properties

  public readonly channelName: string;

  public readonly eventName: string;

  //#endregion

  //#region Constructor

  public constructor() {
    super();

    this.channelName = 'greeting-channel';
    this.eventName = 'greeting-event';
  }

  //#endregion
}
