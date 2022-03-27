import {Subscription} from 'rxjs';
import {MessageBusService} from './message-bus.service';
import {GreetingChannelEvent} from '../../../e2e/src/models/greeting.channel-event';

describe('addTypedMessageChannel test cases', () => {

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
  // - Call addTypedMessageChannel
  // Expects:
  // - Channel & event is created successfully.
  it('addTypedMessageChannel create a channel & event successfully.', (done) => {

    const channelEvent = new GreetingChannelEvent();
    const messageBusService = new MessageBusService();

    // Hook channel initialization.
    const hookTypedChannelInitializationSubscription = messageBusService
      .hookTypedChannelInitialization(channelEvent)
      .subscribe(value => {
        expect(value.channelName).toEqual(channelEvent.channelName);
        expect(value.eventName).toEqual(channelEvent.eventName);

        done();
      });

    // Add to subscription watch list.
    subscription.add(hookTypedChannelInitializationSubscription);

    messageBusService.addTypedMessageChannel(channelEvent);
  }, 2000);

  // Condition:
  // - Call addTypedMessageChannel
  // Expects:
  // - hookChannelInitialization can catch the event about channel name & event name.
  it('addTypedMessageChannel can be hooked by hookChannelInitialization', (done) => {
    const channelEvent = new GreetingChannelEvent();
    const messageBusService = new MessageBusService();

    // Hook channel initialization.
    const hookTypedChannelInitializationSubscription = messageBusService
      .hookChannelInitialization(channelEvent.channelName, channelEvent.eventName)
      .subscribe(value => {
        expect(value.channelName).toEqual(channelEvent.channelName);
        expect(value.eventName).toEqual(channelEvent.eventName);

        done();
      });

    // Add to subscription watch list.
    subscription.add(hookTypedChannelInitializationSubscription);

    messageBusService.addTypedMessageChannel(channelEvent);
  }, 2000);

  //#endregion
});
