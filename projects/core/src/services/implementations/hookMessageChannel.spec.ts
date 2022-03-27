import {GreetingChannelEvent} from '../../../e2e/src/models/greeting.channel-event';
import {Greeting} from '../../../e2e/src/models/greeting';
import {Subscription} from 'rxjs';
import {MessageBusService} from './message-bus.service';
import 'zone.js';
import 'zone.js/testing'; // AFTER zone, BEFORE everything else

import {fakeAsync, tick} from '@angular/core/testing';

describe('hookMessageChannel test cases', () => {

  //#region Properties

  let _subscription: Subscription;

  //#endregion

  //#region Life cycle

  beforeEach(() => {
    _subscription = new Subscription();
  });

  afterEach(() => {
    _subscription.unsubscribe();
  });

  //#endregion

  //#region Methods

  it('After channel is hooked, message can be received successfully',
    done => {

      const channelEvent = new GreetingChannelEvent();
      const messageBusService = new MessageBusService();
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
      _subscription.add(hookTypedMessageSubscription);

      messageBusService.addTypedMessage(channelEvent, greetingMessage);
      done();

    }, 2000);

  it('When skipHistoricalMessage is set, previous message cannot be received',
    <any>fakeAsync((): void => {

      const channelEvent = new GreetingChannelEvent();
      const messageBusService = new MessageBusService();
      const greetingMessage = new Greeting('Sender 01', 'Recipient 01', 'Message 001');

      messageBusService.addTypedMessage(channelEvent, greetingMessage);

      let hookedValue: Greeting = null;

      // Hook channel initialization.
      const hookTypedMessageSubscription = messageBusService.hookTypedMessageChannel(channelEvent,
        {
          skipHistoricalMessages: true
        })
        .subscribe((value: Greeting) => {
          hookedValue = value;
        });

      // Add subscription to watch list.
      _subscription.add(hookTypedMessageSubscription);

      tick(500);
      expect(hookedValue).toEqual(null);
    }));

  it('When skipHistoricalMessage is set, previous message cannot be received, new message can',
    <any>fakeAsync((): void => {

      const channelEvent = new GreetingChannelEvent();
      const messageBusService = new MessageBusService();
      const oldGreetingMessage = new Greeting('Sender 01', 'Recipient 01', 'Message 001');
      const newGreetingMessage = new Greeting('Sendor 02', 'Recipient 02', 'Message 002');
      messageBusService.addTypedMessage(channelEvent, oldGreetingMessage);

      let hookedValue: Greeting = null;
      let calledTime = 0;

      // Hook channel initialization.
      const hookTypedMessageSubscription = messageBusService.hookTypedMessageChannel(channelEvent,
        {
          skipHistoricalMessages: true
        })
        .subscribe((value: Greeting) => {
          hookedValue = value;
          calledTime++;
        });

      // Add subscription to watch list.
      _subscription.add(hookTypedMessageSubscription);

      tick(500);
      expect(hookedValue).toEqual(null);
      expect(calledTime).toEqual(0);

      tick(500);
      messageBusService.addTypedMessage(channelEvent, newGreetingMessage);

      tick(500);
      expect(hookedValue).not.toBeNull();
      expect(hookedValue.message).toBe(newGreetingMessage.message);
      expect(hookedValue.recipient).toBe(newGreetingMessage.recipient);
      expect(hookedValue.sender).toBe(newGreetingMessage.sender);
      expect(calledTime).toEqual(1);
    }));

  //#endregion
});
