import {Inject, Injectable, Optional} from '@angular/core';
import {Observable, of, ReplaySubject, Subject, throwError} from 'rxjs';
import {delay, filter, flatMap, map, retryWhen, switchMap} from 'rxjs/operators';
import {INgRxMessageBusService} from "./ngrx-message-bus-service.interface";
import {INgRxMessageBusOptions} from "./ngrx-message-bus-option.interface";
import {MessageContainer} from "./message-container";
import {IChannelAddedEvent} from "./channel-added-event.interface";

@Injectable()
export class NgRxMessageBusService implements INgRxMessageBusService {

  //#region Properties

  /*
  * Times that hookChannelMessage should retry before subscription failure.
  * */
  private _defaultChannelSubscriptionAttemptTimes = 5;

  /*
  * Default seconds that hookChannelMessage should retry before subscription failure.
  * */
  private _defaultChannelSubscriptionDuration = 5000;

  /*
  * Retry connecting to channel after 1000ms.
  * */
  private _defaultSubscriptionAttemptDelayTime = 1000;

  /*
  * Map of channels & event emitter
  * */
  private _mChannel: Map<string, Map<string, Subject<any>>>;

  /*
  * Message bus service options.
  * */
  private _options: INgRxMessageBusOptions;

  /*
  * Special channel which raises a message when an ordinary channel is created.
  * */
  public readonly channelAddedEvent: Subject<IChannelAddedEvent>;

  //#endregion

  //#region Constructor

  /*
  * Initialize service with injectors.
  * */
  public constructor(@Inject('IMessageBusOption') @Optional() options?: INgRxMessageBusOptions) {

    // Setup initial option.
    this._options = options;

    // Initialize special channel.
    this.channelAddedEvent = new ReplaySubject(1);

    // Initialize list of channel mappings.
    this._mChannel = new Map<string, Map<string, Subject<any>>>();
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
  public hookMessageChannel<T>(channelName: string, eventName: string, autoCreate?: boolean, messageBusOptions?: INgRxMessageBusOptions): Observable<T> {

    // Number of subscription retry.
    let subscriptionRetryTimes = 0;

    // Time when the first retry was made.
    const firstRetryTime = new Date().getTime();

    // Base on mode, we have different attempt strategy.
    const options = this.loadMessageBusOptions(messageBusOptions);

    return of(null)
      .pipe(
        // Cancel previous subscription and change to load available message channel.
        map(() => this.loadMessageChannel(channelName, eventName, autoCreate)),

        switchMap((messageEmitter: Subject<MessageContainer<T>>) => {

          // No recipient has been found.
          if (!messageEmitter) {
            return throwError('Channel is not found');
          }

          return messageEmitter
            .pipe(
              // Only pass data back to listener when message is available.
              filter(messageContainer => {
                return messageContainer && messageContainer.available;
              }),

              // Pass the data inside the message container to listeners.
              map((messageContainer: MessageContainer<T>) => messageContainer.data)
            )
        }),

        retryWhen(exceptionObservable => {
          switch (options.subscriptionAttemptMode) {

            case 'times':

              // Maximum retry times exceeded.
              if (subscriptionRetryTimes > options.channelSubscriptionAttemptTimes) {
                return throwError(`Maximum subscription retries exceeded. Allowed value is : ${options.channelSubscriptionAttemptTimes}`);
              }

              subscriptionRetryTimes++;
              break;

            case 'duration':

              // Retry duration exceeded.
              const currentUnixTime = new Date().getTime();
              if (currentUnixTime - firstRetryTime > options.channelSubscriptionAttemptDuration) {
                return throwError(`Subscription attempt duration is over.
                Allowed value is: ${options.channelSubscriptionAttemptDuration} ms`);
              }
          }

          return exceptionObservable
            .pipe(
              delay(options.channelConnectionAttemptDelay)
            );
        })
      );
  }

  /*
  * Publish message to event stream.
  * Channel will be created automatically if it isn't available.
  * */
  public addMessage<T>(channelName: string, eventName: string, data: T): void {
    const emitter = this.loadMessageChannel(channelName, eventName, true);

    // Build message container.
    const messageContainer = new MessageContainer<T>();
    messageContainer.data = data;
    messageContainer.createdTime = new Date().getTime();
    messageContainer.available = true;
    emitter.next(messageContainer);
  }

  /*
  * Delete messages that have been sent.
  * */
  public deleteChannelMessage(channelName: string, eventName: string): void {

    const messageEmitter = this.loadMessageChannel(channelName, eventName, false);
    if (messageEmitter == null) {
      return;
    }

    const messageContainer = new MessageContainer<any>();
    messageContainer.data = null;
    messageContainer.available = false;

    // Emit the blank message to channel.
    messageEmitter.next(messageContainer);
  }

  /*
  * Delete message from every channel.
  * */
  public deleteMessages(): void {

    if (this._mChannel == null) {
      return;
    }

    // Go through every channel.
    const channelNames = this._mChannel.keys();
    for (const channelName of channelNames) {
      const channelNameEventNameMap = this._mChannel.get(channelName);
      if (!channelNameEventNameMap) {
        continue;
      }

      // Get event names.
      const eventNames = channelNameEventNameMap.keys();
      for (const eventName of eventNames) {
        // Get message emitter.
        const emitter = channelNameEventNameMap.get(eventName);

        // Initialize blank message.
        const messageContainer = new MessageContainer<any>();
        messageContainer.data = null;
        messageContainer.available = true;

        emitter.next(messageContainer);
      }
    }
  }

  /*
  * Load message channel using channel name and event name.
  * Specifying auto create will trigger channel creation if it is not available.
  * Auto create option can cause concurrent issue, such as parent channel can be replaced by child component.
  * Therefore, it should be used wisely.
  * */
  protected loadMessageChannel<T>(channelName: string, eventName: string, autoCreate?: boolean): Subject<MessageContainer<T>> {
    let mChannel = this._mChannel;

    if (mChannel == null) {

      // Cannot create channel automatically.
      if (!autoCreate) {
        return null;
      }

      mChannel = new Map<string, Map<string, Subject<any>>>();
      this._mChannel = mChannel;
    }

    if (!mChannel.has(channelName)) {

      // Cannot create channel automatically.
      if (!autoCreate) {
        return null;
      }
      mChannel.set(channelName, null);
    }

    // Channel is not found.
    let channelNameMessageEmitterMap = mChannel.get(channelName);
    if (channelNameMessageEmitterMap == null) {

      if (!autoCreate) {
        return null;
      }

      channelNameMessageEmitterMap = new Map<string, Subject<any>>();
      mChannel.set(channelName, channelNameMessageEmitterMap);
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
      this.channelAddedEvent.next({channelName, eventName});
    }

    return messageEmitter;
  }

  /*
  * Load message from options.
  * Default message bus option will be used if no option is defined.
  * */
  protected loadMessageBusOptions(originalOptions?: INgRxMessageBusOptions): INgRxMessageBusOptions {

    // Get options.
    let options = Object.assign({}, originalOptions || this._options);

    // Option is not specified.
    if (!options) {

      // Get predefined options.
      options = {
        subscriptionAttemptMode: 'times',
        channelSubscriptionAttemptDuration: this._defaultChannelSubscriptionDuration,
        channelSubscriptionAttemptTimes: this._defaultChannelSubscriptionAttemptTimes,
        channelConnectionAttemptDelay: this._defaultSubscriptionAttemptDelayTime
      };

      this._options = options;
    }

    // Attempt time is not valid.
    if (!options.channelSubscriptionAttemptTimes || options.channelSubscriptionAttemptTimes < 0) {
      options.channelSubscriptionAttemptTimes = this._defaultChannelSubscriptionAttemptTimes;
    }

    // Attempt duration is not valid.
    if (!options.channelSubscriptionAttemptDuration || options.channelSubscriptionAttemptDuration < 0) {
      options.channelSubscriptionAttemptDuration = this._defaultChannelSubscriptionDuration;
    }

    // Subscription attempt delay is not valid.
    if (!options.channelConnectionAttemptDelay || options.channelConnectionAttemptDelay < 500) {
      options.channelConnectionAttemptDelay = this._defaultSubscriptionAttemptDelayTime;
    }

    // No mode is specify for message bus.
    const availableAttemptModes = ['duration', 'times', 'infinite'];
    if (!options.subscriptionAttemptMode || availableAttemptModes.indexOf(options.subscriptionAttemptMode) === -1) {
      options.subscriptionAttemptMode = 'duration';
    }

    return options;
  }

  //#endregion

}
