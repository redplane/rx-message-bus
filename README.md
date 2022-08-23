## Build status

[![Netlify Status](https://api.netlify.com/api/v1/badges/375d6117-d4fe-42a7-8fd2-ed03618d04c2/deploy-status)](https://app.netlify.com/sites/ngrx-message-bus-demo/deploys)

---

## Description

- **message-bus** is just a small angular library which provides a singleton shared service in [Angular application](https://angular.io/).

- **message-bus** is just an improved shared service. Instead of providing just one instance for **publishing** | **subscribing** messages, it provides `channels` and `events` to which components can _subscribe_ and _unsubscribe_. 

- Long story short, **message-bus** provides `back-end` mindset about pub/sub mechanism.

- Online DEMO can be found **[HERE](https://message-bus.netlify.app)**

----

## Installation:

**1. Module lifetime**

```typescript
import {MessageBusModule} from './message-bus.module';

@NgModule({
  declarations: [],
  imports: [
    //... Module declaration
    MessageBusModule.forRoot()
  ],
  providers: [
    AppSettings
  ],
  bootstrap: [AppComponent]
})


export class AppModule {
}
```

```typescript
import {ChangeDetection} from '@angular/cli/lib/config/workspace-schema';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parent',
  templateUrl: 'parent.component.html',
  changeDetection: ChangeDetection.OnPush
})
export class ParentComponent implements OnInit {

  public constructor(@Inject(MESSAGE_BUS_SERVICE) public messageBusService: IMessageBusService) {

  }
}
```

----

**2. Component lifetime**

```
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parent, [parent-comp]',
  templateUrl: 'parent.component.html',
  providers: [
    {
      provide: MESSAGE_BUS_SERVICE,
      useFactory: () => new MessageBusService()
    }
  ]
})
export class ParentComponent implements OnInit {
}
```

----

## Usage

### Channel - event declaration.
- Instead of defining **channel name** and **event name** manually each time when message is added to message channel or message channel is subscribed to. A class which inherits **TypedChannelEvent<T>** class which helps developer not to declare channel name or event name repeatedly and exhaustedly.
- An example of class which inherits **TypedChannelEvent<T>** class.

```
export class ModuleLevelMessageEvent extends TypedChannelEvent<string> {

  //#region Properties

  public readonly channelName: string;

  public readonly eventName: string;

  //#endregion

  //#region Constructor

  constructor() {
    super();

    this.channelName = MessageChannelNameConstant.parent;
    this.eventName = MessageEventNameConstant.sendParentMessage;
  }

  //#endregion
}
```

### Message subscription:

- To subscribe to an `event in message channel`, please use ~~**hookMessageChannel**~~ **hookTypedMessageChannel**.

- ~~**hookMessageChannel** allows user to specify whether **event** and **channel** should be automatically created if they don't exist or not.~~

- ~~**hookMessageChannel**~~ **hookTypedMessageChannel** returns an instance of `Subscription`. Don't forget to unsubscribe it to prevent [memory leak](https://itnext.io/angular-rxjs-detecting-memory-leaks-bdd312a070a0).

```

  // ... Above implementation
  //#region Constructor

  public constructor(@Inject(MESSAGE_BUS_SERVICE) protected messageBusService: IMessageBusService) {

    // Initialize subscription manager.
    this._subscription = new Subscription();

    const channelEvent = new ModuleLevelMessageEvent();
    const hookParentTypedMessageSubscription = this.messageBusService
      .hookTypedMessageChannel(channelEvent)
      .subscribe((value: string) => {
        this._typedMessage = value;
      });

    this._subscription.add(hookParentTypedMessageSubscription);
  }

  //#endregion

  //#region Methods

  public ngOnDestroy(): void {

    // Destroy the subscription to prevent memory leak.
    if (this._subscription && !this._subscription.closed) {
      this._subscription.unsubscribe();
    }
  }

  //#endregion
        
```


### Message publish:

- To publish a message through message bus to a specific event in a channel, please use ~~**addMessage**~~.
- The **event** and **channel** will be created automatically if they don't exist.

```

export class ComponentLevelParentComponent extends ParentComponent {

  //#region Properties

  //#endregion

  //#region Constructor

  public constructor(@Inject(MESSAGE_BUS_SERVICE) protected messageBusService: IMessageBusService) {
    super();
  }

  //#endregion

  //#region Methods

  public clickSendTypedMessage(): void {

    const channelEvent = new ModuleLevelMessageEvent();
    const date = new Date();
    const message = `${date.toLocaleTimeString()} [${this.name}] says: Hello`;

    this.messageBusService
      .addTypedMessage(channelEvent, message);
  }

  //#endregion
}

```

----

## APIs | Options

### Deprecated

- ~~**addMessageChannel<T>(channelName: string, eventName: string): Subject<T>** : Create a **channel** and **event** in the message bus. (_**One channel** has many **events**, however, **one event** can only belong to **one channel**._)~~
  - ~~**channelName (string)**: Name of channel should the **event** and **message** be created. (**required**).~~
  - ~~**eventName (string)**: Name of event in the channel above which message will go through. (**required**).~~
  
- ~~hookMessageChannel<T>(channelName: string, eventName: string): Observable<T>**: Subscribe to a specific channel and its event to listen to the incoming message. Every component which registers to the same channel and event can catch the message.~~
  - ~~**channelName (string)**: Name of channel to subscribe to. (**required**).~~
  - ~~**eventName (string)**: Name of event to subscribe to. (**required**).~~

- ~~**addMessage<T>(channelName: string, eventName: string, data?: T, lifeTimeInSeconds?: number): void**: Publish a message to a specific **event** in a specific **channel**. Event component registers to the published **channel** and **event** can receive the sent message.~~
  - ~~**channelName (string)**: Name of channel that message will be published to. (**required**).~~
  - ~~**eventName (string)**: Name of event that message will go through. (**required**).~~
  - ~~**data (any)**: Message data.~~
  - ~~**lifeTimeInSeconds (options)**: The number of seconds message remains. If this parameter isn't set, message will have infinitive lifetime.~~

- ~~**channelAddedEvent: Observable<{channelName: string, eventName: string}>**: Raised when a channel is created successfully. This event can be used for initializing connection from subscriber to message bus to ensure the specific channel & event is available to be consumed.~~

- ~~**hookChannelInitialization(channelName: string, eventName: string): Observable<ChannelInitializationEvent>**: Provide hook to outer component to know when a `message channel - event` is initialized successfully.~~
    - ~~**channelName (string)**: Name of channel.~~
    - ~~**eventName (string)**: Name of event.~~

### New api.

- **addTypedMessageChannel<T>(channelEvent: TypedChannelEvent<T>): void** : Create a **channel** and **event** in the message bus. (_**One channel** has many **events**, however, **one event** can only belong to **one channel**._)
  - **channelEvent (TypedChannelEvent)**: Combination of channel name & event name. This instance is for preventing developer from specifying channel name & event name & especially message data type manually. (**required**).
  
- **hookTypedMessageChannel<T>(channelEvent: TypedChannelEvent<T>): Observable<T>**: Subscribe to a specific channel and its event to listen to the incoming message. Every component which registers to the same channel and event can catch the message.
  - **channelEvent (TypedChannelEvent)**: Combination of channel name & event name. This instance is for preventing developer from specifying channel name & event name & especially message data type manually. (**required**).

- **addTypedMessage<T>(channelEvent: TypedChannelEvent<T>, message: T, lifeTimeInSeconds?: number): void**: Publish a message to a specific **event** in a specific **channel**. Event component registers to the published **channel** and **event** can receive the sent message.
  - **channelEvent (TypedChannelEvent)**: Combination of channel name & event name. This instance is for preventing developer from specifying channel name & event name & especially message data type manually. (**required**).
  - **message (any)**: Message data.
  - **lifeTimeInSeconds (options)**: The number of seconds message remains. If this parameter isn't set, message will have infinitive lifetime.

- **channelAddedEvent**: Observable<{channelName: string, eventName: string}>`: Raised when a channel is created successfully. This event can be used for initializing connection from subscriber to message bus to ensure the specific channel & event is available to be consumed.

- **hookTypedChannelInitialization<T>(channelEvent: TypedChannelEvent<T>): Observable<ChannelInitializationEvent>;**: Provide hook to outer component to know when a `message channel - event` is initialized successfully.
    - **channelEvent (TypedChannelEvent)**: Combination of channel name & event name. This instance is for preventing developer from specifying channel name & event name & especially message data type manually. (**required**).

----

## Different between **Module lifetime** and **Component lifetime**.

- **Module lifetime** is about single instance in the whole module that `message bus` is registered.

- **Component lifetime** is about single instance in the component that `message bus` is registered.

- `message bus` lifetime can be **overridden**  by the inner `message bus`. That means, if there are 2 instances, one is registered in **module**, the other is in **component**, the component's one will be the active and runnable one. Please refer [Hierarchical Dependency Injectors](https://angular.io/guide/hierarchical-dependency-injection) for more information.


## Releases

- **13.*.***:
  - Add [Remote procedure call](https://www.techtarget.com/searchapparchitecture/definition/Remote-Procedure-Call-RPC#:~:text=Remote%20Procedure%20Call%20is%20a,systems%20like%20a%20local%20system.)

- **3.0.1**:
    - Minor bug fix about injection token.
    
- **3.0.0**:
    - Add typed channel event apis, such as:
        - `addTypedMessageChannel`.
        - `hookTypedMessageChannel`.
        - `addTypedMessage`.
        - `hookTypedChannelInitialization`.
        
    - Marked weak typed methods as deprecated. Marked apis:
        - `addMessageChannel`.
        - `hookMessageChannel`.
        - `addMessage`.
        - `hookChannelInitialization`.

- **2.2.0**:
    - Removed `channelAddedEvent`. When `hookChannelMessage`, it will ensure a channel is created before publishing messages.
    
    - Added `lifetimeInSeconds?: number` into `addMessage<T>(channelName: string, eventName: string, data: T, lifetimeInSeconds?: number): void`, message will be expired after lifetime exceeds.
    
    - Removed `messageBusOptions` and `forRoot` from module declaration. From now, module will be imported as default:
    
    ```
       @NgModule({
         imports: [
           MessageBusModule,
           //...
         ]
       })
       export class ModuleLevelDemoModule {
       
       } 
    ```
  
  - Removed ```autoCreateChannel``` from ```hookChannelMessage```.
  - Changed `IMessageBusService` string injector to `MESSAGE_BUS_SERVICE` object injector.

- **1.0.4**: 
  - Changed `BehaviourSubject` to `ReplaySubject` to prevent unexpected value from being emitted.
  
- **1.0.3**: Minor bug fixes.

- **1.0.2**: Minor bug fixes.

- **1.0.1**: Added README.MD.

- **1.0.0**: Initial release.    




