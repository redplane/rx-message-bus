import {Subscription} from 'rxjs';
import {NgRxMessageBusService} from './ngrx-message-bus.service';
import {GreetingChannelEvent} from '../../../e2e/src/models/greeting.channel-event';
import {Greeting} from '../../../e2e/src/models/greeting';
import {timeout} from 'rxjs/operators';
import {fakeAsync, tick} from '@angular/core/testing';

describe('addTypedMessage test cases', () => {

  //#region Properties

  let subscription: Subscription;

  //#endregion

  //#region Life cycle

  // Run before each test cases.
  beforeEach(() => {
    subscription = new Subscription();
  });

  // Run after each test cases.
  afterEach(async () => {
    if (subscription && !subscription.closed) {
      subscription.unsubscribe();
    }
  });

  //#endregion

  //#region Methods

  // Condition:
  // - Define message channel: greeting-channel
  // - Define message event: greeting-event
  // - Call addTypedMessage with defined message channel & message event.
  // Expects:
  // - Hooked channel name matches exactly.
  // - Hooked event name matches exactly.
  it('addTypedMessage broadcast message successfully', (done) => {

    const channelEvent = new GreetingChannelEvent();
    const messageBusService = new NgRxMessageBusService();
    const greetingMessage = new Greeting('Sender 01', 'Recipient 01', 'Message 001');

    // Hook channel initialization.
    const hookTypedMessageSubscription = messageBusService.hookTypedMessageChannel(channelEvent)
      .subscribe((value: Greeting) => {
        expect(value.sender).toEqual(greetingMessage.sender);
        expect(value.recipient).toEqual(greetingMessage.recipient);
        expect(value.message).toEqual(greetingMessage.message);

        done();
      });

    // Add subscription to watch list.
    subscription.add(hookTypedMessageSubscription);

    messageBusService.addTypedMessage(channelEvent, greetingMessage);
  }, 2000);

  // Condition:
  // - Call addTypedMessageChannel
  // Expects:
  // - hookChannelInitialization can catch the event about channel name & event name.
  it('addTypedMessage message can be hooked by hookMessageChannel', (done) => {
    const channelEvent = new GreetingChannelEvent();
    const messageBusService = new NgRxMessageBusService();
    const greetingMessage = new Greeting('Sender 01', 'Recipient 01', 'Message 001');

    // Hook channel initialization.
    const hookChannelInitializationSubscription = messageBusService
      .hookMessageChannel(channelEvent.channelName, channelEvent.eventName)
      .subscribe((value: Greeting) => {
        expect(value.sender).toEqual(greetingMessage.sender);
        expect(value.recipient).toEqual(greetingMessage.recipient);
        expect(value.message).toEqual(greetingMessage.message);

        done();
      });

    subscription.add(hookChannelInitializationSubscription);

    messageBusService.addTypedMessage(channelEvent, greetingMessage);
  }, 2000);

  // Condition:
  // - Call addTypedMessageChannel with timeout.
  // - Subscribe to message channel after message life time exceeded.
  // Expects:
  // - No message is subscribed.
  it('addTypedMessage with timeout, after timeout message cannot be retrieved.', fakeAsync(() => {
    const channelEvent = new GreetingChannelEvent();
    const messageBusService = new NgRxMessageBusService();
    const greetingMessage = new Greeting('Sender  01', 'Recipient 01', 'Message 001');
    const timeoutMillisecond = 3000;

    let hasError = false;

    messageBusService.addTypedMessage(channelEvent, greetingMessage, timeoutMillisecond);
    tick(timeoutMillisecond * 1.5);
    const hookTypedMessageSubscription = messageBusService.hookTypedMessageChannel(channelEvent)
      .pipe(timeout(200))
      .subscribe(() => {
      }, error => {
        hasError = true;
      });

    subscription.add(hookTypedMessageSubscription);
    tick(500);
    expect(hasError).toBeTrue();
  }));

  //#endregion
});
