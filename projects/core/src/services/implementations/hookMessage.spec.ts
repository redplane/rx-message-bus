import {Subscription} from 'rxjs';
import {MessageBusService} from './message-bus.service';
import {MessageEvent} from '../../decorators';

const GREETING_CHANNEL_NAME = 'greeting-channel';
const GREETING_EVENT_NAME = 'greeting';

@MessageEvent(GREETING_CHANNEL_NAME, GREETING_EVENT_NAME)
class GreetingEvent {
  public constructor(public readonly message: string) {
  }
}

class NoMetadataEvent {
  public constructor(public readonly message: string) {
  }
}

describe('hookMessage test cases', () => {

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
  it('hookMessage can receive sent message from addMessage successfully', (done) => {

    const message = new GreetingEvent('Hello world');
    const messageBusService = new MessageBusService();

    // Hook channel initialization.
    const hookTypedMessageSubscription = messageBusService.hookMessage(GreetingEvent)
      .subscribe(value => {
        expect(value.message).toEqual(message.message);
        done();
      });

    // Add subscription to watch list.
    subscription.add(hookTypedMessageSubscription);

    messageBusService.addMessage(GREETING_CHANNEL_NAME, GREETING_EVENT_NAME, message);
  }, 2000);

  // Condition:
  // - Define message channel: greeting-channel
  // - Define message event: greeting-event
  // - Call addTypedMessage with defined message channel & message event.
  // Expects:
  // - Hooked channel name matches exactly.
  // - Hooked event name matches exactly.
  it('hookMessage can receive sent message from sendMessage successfully', (done) => {

    const message = new GreetingEvent('Hello world');
    const messageBusService = new MessageBusService();

    // Hook channel initialization.
    const hookTypedMessageSubscription = messageBusService.hookMessage(GreetingEvent)
      .subscribe(value => {
        expect(value.message).toEqual(message.message);
        done();
      });

    // Add subscription to watch list.
    subscription.add(hookTypedMessageSubscription);

    messageBusService.publish(message);
  }, 2000);

  it('hookMessage throws exception when class does not have metadata', (done) => {

    const message = new NoMetadataEvent('Hello world');
    const messageBusService = new MessageBusService();

    try {
      // Hook channel initialization.
      const hookTypedMessageSubscription = messageBusService.hookMessage(NoMetadataEvent)
        .subscribe(value => {
          fail();
        });

      // Add subscription to watch list.
      subscription.add(hookTypedMessageSubscription);
      messageBusService.publish(message);
    } catch (exception) {
      expect(exception != null);
      expect((exception as Error).message.startsWith('Metadata is not found'));
      done();
    }
  }, 2000);

  it('publish throws exception when class does not have metadata', (done) => {

    const message = new NoMetadataEvent('Hello world');
    const messageBusService = new MessageBusService();

    try {
      messageBusService.publish(message);
    } catch (exception) {
      expect(exception != null);
      expect((exception as Error).message.startsWith('Metadata is not found'));
      done();
    }
  }, 2000);
  //#endregion
});
