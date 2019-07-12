import {Observable, Subject} from 'rxjs';
import {INgRxMessageBusOptions} from "./ngrx-message-bus-option.interface";

// A small message queue channels - messages management.
// This service which helps modules to send and receive messages asynchronously.
export interface INgRxMessageBusService {

  //#region Methods

  /*
  * Add a message channel to message bus.
  * */
  addMessageChannel<T>(channelName: string, eventName: string): void;

  /*
  * Hook message event.
  * Specifying auto create will trigger channel creation if it is not available.
  * Auto create option can cause concurrent issue, such as parent channel can be replaced by child component.
  * Therefore, it should be used wisely.
  * */
  hookMessageChannel<T>(channelName: string, eventName: string, autoCreateChannel?: boolean, messageBusOptions?: INgRxMessageBusOptions): Observable<T>;

  /*
  * Publish message to event stream.
  * Channel will be created automatically if it isn't available.
  * */
  addMessage<T>(channelName: string, eventName: string, data?: T): void;

  /*
  * Clear recent message that has been sent.
  * */
  deleteChannelMessage(channelName: string, eventName: string): void;

  /*
  * Delete every channel message.
  * */
  deleteMessages(): void;

  /*
  * Publish a message when a channel is created.
  * */
  readonly channelAddedEvent: Observable<{channelName: string, eventName: string}>;

  //#endregion

}
