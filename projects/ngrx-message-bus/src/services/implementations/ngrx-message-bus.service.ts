import {Inject, Injectable, Optional} from '@angular/core';
import {Observable, of, ReplaySubject, Subject, throwError} from 'rxjs';
import {delay, filter, flatMap, map, retryWhen, switchMap} from 'rxjs/operators';
import {INgRxMessageBusService} from "../interfaces/ngrx-message-bus-service.interface";
import {MessageContainer} from "../../models/message-container";
import {ChannelInitializationEvent} from "../../models/channel-initialization-event";

@Injectable()
export class NgRxMessageBusService implements INgRxMessageBusService {

  //#region Properties

  /*
  * Map of channels & event emitter
  * */
  private _mChannelEventManager: Map<string, Map<string, Subject<any>>>;

  /*
  * Channel event initialization manager.
  * */
  private _mChannelEventInitializationManager: Map<string, Map<string, Subject<any>>>;

  //#endregion

  //#region Constructor

  /*
  * Initialize service with injectors.
  * */
  public constructor() {
    // Initialize list of channel mappings.
    this._mChannelEventManager = new Map<string, Map<string, Subject<any>>>();
    this._mChannelEventInitializationManager = new Map<string, Map<string, Subject<any>>>();
  }

  //#endregion

  //#region Methods

  /*
  * Add message channel event emitter.
  * */
  public addMessageChannel<T>(channelName: string, eventName: string): void {
    this.loadMessageChannel<T>(channelName, eventName, true);
  }

  /*
  * Hook message event.
  * Specifying auto create will trigger channel creation if it is not available.
  * Auto create option can cause concurrent issue, such as parent channel can be replaced by child component.
  * Therefore, it should be used wisely.
  * */
  public hookMessageChannel<T>(channelName: string, eventName: string): Observable<T> {

    return this
      .loadChannelInitializationEventEmitter(channelName, eventName)
      .pipe(
        // Cancel previous subscription and change to load available message channel.
        map(() => this.loadMessageChannel(channelName, eventName, true)),

        // Jump to event emitter.
        switchMap((messageEmitter: Subject<MessageContainer<T>>) => {

          // No recipient has been found.
          if (!messageEmitter) {
            return throwError('Channel is not found');
          }

          return messageEmitter;
        }),

        // Only pass data back to listener when message is available.
        filter(messageContainer => {
          return messageContainer && messageContainer.available;
        }),

        // Pass the data inside the message container to listeners.
        map((messageContainer: MessageContainer<T>) => messageContainer.data)
      );
  }

  /*
  * Publish message to event stream.
  * Channel will be created automatically if it isn't available.
  * */
  public addMessage<T>(channelName: string, eventName: string, data: T, lifetimeInSeconds?: number): void {
    const emitter = this.loadMessageChannel(channelName, eventName, true);

    // Build message container.
    const messageContainer = new MessageContainer<T>(data, true, lifetimeInSeconds);
    emitter.next(messageContainer);
  }

  /*
  * Delete messages that have been sent.
  * */
  public deleteChannelMessage(channelName: string, eventName: string): void {

    const channelMessageEmitter = this.loadMessageChannel(channelName, eventName, false);
    if (channelMessageEmitter == null) {
      return;
    }

    // Initialize unavailable message container.
    const messageContainer = new MessageContainer<any>(null, false, null);

    // Emit the blank message to channel.
    channelMessageEmitter.next(messageContainer);
  }

  /*
  * Delete message from every channel.
  * */
  public deleteMessages(): void {

    if (this._mChannelEventManager == null) {
      return;
    }

    // Go through every channel.
    const channelNames = this._mChannelEventManager.keys();
    for (const channelName of channelNames) {
      const channelNameEventNameMap = this._mChannelEventManager.get(channelName);
      if (!channelNameEventNameMap) {
        continue;
      }

      // Get event names.
      const eventNames = channelNameEventNameMap.keys();
      for (const eventName of eventNames) {
        // Get message emitter.
        const emitter = channelNameEventNameMap.get(eventName);

        // Initialize blank message.
        const messageContainer = new MessageContainer<any>(null, false, null);
        emitter.next(messageContainer);
      }
    }
  }

  /*
  * Hook to channel channel - event initialization.
  * */
  public hookChannelInitialization(channelName: string, eventName: string): Observable<ChannelInitializationEvent> {
    return this.loadChannelInitializationEventEmitter(channelName, eventName);
  }

  /*
  * Load message channel using channel name and event name.
  * Specifying auto create will trigger channel creation if it is not available.
  * Auto create option can cause concurrent issue, such as parent channel can be replaced by child component.
  * Therefore, it should be used wisely.
  * */
  protected loadMessageChannel<T>(channelName: string, eventName: string, autoCreate?: boolean): Subject<MessageContainer<T>> {
    let mChannelEventManager = this._mChannelEventManager;

    if (mChannelEventManager == null) {

      // Cannot create channel automatically.
      if (!autoCreate) {
        return null;
      }

      mChannelEventManager = new Map<string, Map<string, Subject<any>>>();
      this._mChannelEventManager = mChannelEventManager;
    }

    if (!mChannelEventManager.has(channelName)) {

      // Cannot create channel automatically.
      if (!autoCreate) {
        return null;
      }
      mChannelEventManager.set(channelName, null);
    }

    // Channel is not found.
    let channelNameMessageEmitterMap = mChannelEventManager.get(channelName);
    if (channelNameMessageEmitterMap == null) {

      if (!autoCreate) {
        return null;
      }

      channelNameMessageEmitterMap = new Map<string, Subject<any>>();
      mChannelEventManager.set(channelName, channelNameMessageEmitterMap);
    }

    let messageEmitter = channelNameMessageEmitterMap.get(eventName);
    let hasMessageEmitterAdded = false;

    if (messageEmitter == null) {

      if (!autoCreate) {
        return null;
      }

      // Mark the channel to be added.
      hasMessageEmitterAdded = true;

      messageEmitter = new ReplaySubject<MessageContainer<T>>(1);
      channelNameMessageEmitterMap.set(eventName, messageEmitter);
    }

    // Raise an event about message channel creation if it has been newly added.
    if (hasMessageEmitterAdded) {
      // Raise an event about newly created channel.
      const channelInitializationEmitter = this.loadChannelInitializationEventEmitter(channelName, eventName);
      channelInitializationEmitter.next(new ChannelInitializationEvent(channelName, eventName));
    }

    return messageEmitter;
  }

  /*
  * Load channel initialization event emitter.
  * */
  protected loadChannelInitializationEventEmitter(channelName: string, eventName: string): Subject<ChannelInitializationEvent> {

    if (!this._mChannelEventInitializationManager.has(channelName)) {
      this._mChannelEventInitializationManager.set(channelName, new Map<string, Subject<any>>());
    }

    let eventInitializationManager = this._mChannelEventInitializationManager.get(channelName);
    if (eventInitializationManager == null) {
      eventInitializationManager = new Map<string, Subject<any>>();
      this._mChannelEventInitializationManager.set(channelName, eventInitializationManager);
    }

    // Get the event emitter.
    let eventEmitter = eventInitializationManager.get(eventName);
    if (!eventEmitter) {
      eventEmitter = new ReplaySubject<ChannelInitializationEvent>(1);
      eventInitializationManager.set(eventName, eventEmitter);
      this._mChannelEventInitializationManager.set(channelName, eventInitializationManager);
    }

    return eventEmitter;
  }

  //#endregion

}
