import {Injectable} from '@angular/core';
import {IMessageBusService} from './message-bus-service.interface';
import {BehaviorSubject, Observable, of, Subject, throwError} from 'rxjs';
import {delay, flatMap, map, retryWhen} from 'rxjs/operators';
import {IMessageBusOption} from './message-bus-option.interface';

@Injectable()
export class MessageBusService implements IMessageBusService {

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
  private _options: IMessageBusOption;

  //#endregion

  //#region Constructor

  /*
  * Initialize service with injectors.
  * */
  public constructor(options: IMessageBusOption = null) {

    // Option is not specified.
    if (!options) {
      options = {
        subscriptionAttemptMode: 'times',
        channelSubscriptionAttemptDuration: this._defaultChannelSubscriptionDuration,
        channelSubscriptionAttemptTimes: this._defaultChannelSubscriptionAttemptTimes,
        channelConnectionAttemptDelay: this._defaultSubscriptionAttemptDelayTime
      };
    }

    // Attempt time is not valid.
    if (options.channelSubscriptionAttemptTimes < 0) {
      options.channelSubscriptionAttemptTimes = this._defaultChannelSubscriptionAttemptTimes;
    }

    // Attempt duration is not valid.
    if (options.channelSubscriptionAttemptDuration < 0) {
      options.channelSubscriptionAttemptDuration = this._defaultChannelSubscriptionDuration;
    }

    // Subscription attempt delay is not valid.
    if (options.channelConnectionAttemptDelay < 500) {
      options.channelConnectionAttemptDelay = this._defaultSubscriptionAttemptDelayTime;
    }

    // No mode is specify for message bus.
    const availableAttemptModes = ['duration', 'times', 'infinite'];
    if (!options.subscriptionAttemptMode || availableAttemptModes.indexOf(options.subscriptionAttemptMode) === -1) {
      options.subscriptionAttemptMode = 'duration';
    }

    // Update options to message bus.
    this._options = options;

    // Initialize list of channel mappings.
    this._mChannel = new Map<string, Map<string, Subject<any>>>();
  }

  //#endregion

  //#region Methods

  /*
  * Add message channel event emitter.
  * */
  public addMessageChannel<T>(channelName: string, eventName: string): Subject<T> {

    // Find channel mapping.
    const mChannel = this._mChannel;

    // Channel is not available.
    let mEventMessageEmitter: Map<string, Subject<any>>;

    if (mChannel.has(channelName)) {
      mEventMessageEmitter = mChannel.get(channelName);
    } else {
      mEventMessageEmitter = new Map<string, BehaviorSubject<any>>();
      mChannel.set(channelName, mEventMessageEmitter);
    }

    if (mEventMessageEmitter.has(eventName)) {
      return mEventMessageEmitter.get(eventName);
    }

    const behaviorSubject = new BehaviorSubject(null);
    mEventMessageEmitter.set(eventName, behaviorSubject);
    return <BehaviorSubject<T>>behaviorSubject;
  }

  /*
  * Hook message event.
  * Specifying auto create will trigger channel creation if it is not available.
  * Auto create option can cause concurrent issue, such as parent channel can be replaced by child component.
  * Therefore, it should be used wisely.
  * */
  public hookMessageChannel<T>(channelName: string, eventName: string, autoCreate?: boolean): Observable<T> {

    // Number of subscription retry.
    let subscriptionRetryTimes = 0;

    // Time when the first retry was made.
    const firstRetryTime = new Date().getTime();

    return this.loadMessageChannel(channelName, eventName, autoCreate)
      .pipe(
        flatMap((behaviourSubject: Observable<T>) => {
          if (!behaviourSubject) {
            return throwError('Channel is not found');
          }

          return behaviourSubject;
        }),
        retryWhen(exceptionObservable => {

          // Base on mode, we have different attempt strategy.
          const options = this._options;
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

    // Find the existing channel.
    const mChannel = this._mChannel;
    if (!mChannel) {
      return;
    }

    // Get message emitter and its buses.
    let mEventMessageEmitter = mChannel.get(channelName);
    let behaviourSubject: Subject<any>;

    if (!mEventMessageEmitter || !mEventMessageEmitter.get(eventName)) {
      behaviourSubject = new BehaviorSubject(data);
      mEventMessageEmitter = new Map<string, Subject<any>>();
      mEventMessageEmitter.set(eventName, behaviourSubject);
      mChannel.set(channelName, mEventMessageEmitter);
    } else {
      behaviourSubject = mEventMessageEmitter.get(eventName);
    }

    behaviourSubject.next(data);
  }

  /*
  * Load message channel using channel name and event name.
  * Specifying auto create will trigger channel creation if it is not available.
  * Auto create option can cause concurrent issue, such as parent channel can be replaced by child component.
  * Therefore, it should be used wisely.
  * */
  protected loadMessageChannel<T>(channelName: string, eventName: string, autoCreate?: boolean): Observable<Observable<T>> {
    let mChannel = this._mChannel;

    if (mChannel == null) {

      // Cannot create channel automatically.
      if (!autoCreate) {
        return of(null);
      }

      mChannel = new Map<string, Map<string, Subject<any>>>();
      this._mChannel = mChannel;
    }

    if (!mChannel.has(channelName)) {

      // Cannot create channel automatically.
      if (!autoCreate) {
        return of(null);
      }
      mChannel.set(channelName, null);
    }

    // Channel is not found.
    let mEventMessageEmitter = mChannel.get(channelName);
    if (mEventMessageEmitter == null) {

      if (!autoCreate) {
        return of(null);
      }

      mEventMessageEmitter = new Map<string, Subject<any>>();
      mChannel.set(channelName, mEventMessageEmitter);
    }

    let behaviourSubject = mEventMessageEmitter.get(eventName);
    if (behaviourSubject == null) {

      if (!autoCreate) {
        return of(null);
      }
      behaviourSubject = new BehaviorSubject<any>(null);
      mEventMessageEmitter.set(eventName, behaviourSubject);
    }

    return of(behaviourSubject);
  }


  //#endregion

}
