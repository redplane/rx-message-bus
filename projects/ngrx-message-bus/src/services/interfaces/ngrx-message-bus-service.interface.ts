import {Observable, Subject} from 'rxjs';
import {ChannelInitializationEvent} from '../../models/channel-initialization-event';
import {TypedChannelEvent} from '../../models/typed-channel-event';
import {IHookChannelOptions} from '../../interfaces/hook-channel-options.interface';

// A small message queue channels - messages management.
// This service which helps modules to send and receive messages asynchronously.
export interface INgRxMessageBusService {

  //#region Methods

  // Add a message channel to message bus.
  /** @deprecated use addTypedMessageChannel instead */
  addMessageChannel<T>(channelName: string, eventName: string): void;

  // Add a message channel to message bus.
  addTypedMessageChannel<T>(channelEvent: TypedChannelEvent<T>): void;

  /*
  * Hook message event.
  * Specifying auto create will trigger channel creation if it is not available.
  * Auto create option can cause concurrent issue, such as parent channel can be replaced by child component.
  * Therefore, it should be used wisely.
  * */
  /** @deprecated use hookTypedMessageChannel instead */
  hookMessageChannel<T>(channelName: string, eventName: string, options?: IHookChannelOptions): Observable<T>;

  // Hook to message channel.
  hookTypedMessageChannel<T>(channelEvent: TypedChannelEvent<T>, options?: IHookChannelOptions): Observable<T>;

  /*
  * Hook to channel initialization.
  * Event will be raised when a pair of channel - event name is created.
  * */
  /** @deprecated use hookTypedChannelInitialization instead */
  hookChannelInitialization(channelName: string, eventName: string): Observable<ChannelInitializationEvent>;

  // Hook to channel initialization.
  // Event will be raised when a pair of channel - event name is created.
  hookTypedChannelInitialization<T>(channelEvent: TypedChannelEvent<T>): Observable<ChannelInitializationEvent>;

  /*
  * Publish message to event stream.
  * Channel will be created automatically if it isn't available.
  * */
  /** @deprecated use addTypedMessage instead */
  addMessage<T>(channelName: string, eventName: string, data?: T, lifetime?: number): void;

  // Add typed message channel.
  addTypedMessage<T>(channelEvent: TypedChannelEvent<T>, message: T, lifeTime?: number): void;

  // Clear recent message that has been sent.
  /** @deprecated use deleteTypedChannelMessage instead */
  deleteChannelMessage(channelName: string, eventName: string): void;

  // Delete recent message that has been sent.
  deleteTypedChannelMessage<T>(channelEvent: TypedChannelEvent<T>): void;

  // Delete every channel message.
  deleteMessages(): void;

  //#endregion

}
