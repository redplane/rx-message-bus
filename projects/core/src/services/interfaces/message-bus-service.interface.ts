import {Observable, Subject} from 'rxjs';
import {ChannelInitializationEvent} from '../../models/channel-initialization-event';
import {IHookChannelOptions} from '../../interfaces/hook-channel-options.interface';
import {Type} from '@angular/core';

// A small message queue channels - messages management.
// This service which helps modules to send and receive messages asynchronously.
export interface IMessageBusService {

  //#region Methods

  // Add a message channel to message bus.
  addMessageChannel<T>(channelName: string, eventName: string): void;

  /*
  * Hook message event.
  * Specifying auto create will trigger channel creation if it is not available.
  * Auto create option can cause concurrent issue, such as parent channel can be replaced by child component.
  * Therefore, it should be used wisely.
  * */
  hookMessageChannel<T>(channelName: string, eventName: string, options?: IHookChannelOptions): Observable<T>;

  // Hook message which is transferred through message bus service.
  hookMessageChannelByType<T>(type: Type<T>, options?: IHookChannelOptions): Observable<T>;

  /*
  * Hook to channel initialization.
  * Event will be raised when a pair of channel - event name is created.
  * */
  hookChannelInitialization(channelName: string, eventName: string): Observable<ChannelInitializationEvent>;

  // Hook to channel initialization.
  // Event will be raised when a pair of channel - event name is created.
  hookChannelInitializationByType<T>(type: Type<T>): Observable<ChannelInitializationEvent>;

  /*
  * Publish message to event stream.
  * Channel will be created automatically if it isn't available.
  * */
  addMessage<T>(channelName: string, eventName: string, data?: T, lifetime?: number): void;

  /*
  * Publish message to event stream.
  * Channel will be created automatically if it isn't available.
  * */
  addMessageInstance<T>(message: T): void;

  // Clear recent message that has been sent.
  deleteChannelMessage(channelName: string, eventName: string): void;

  // Delete messages that have been sent through a specific channel & event.
   deleteMessageByType<T>(type: Type<T>): void;

  // Delete every channel message.
  deleteMessages(): void;

  //#endregion

}
