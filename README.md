## Build status

[![Netlify Status](https://api.netlify.com/api/v1/badges/375d6117-d4fe-42a7-8fd2-ed03618d04c2/deploy-status)](https://app.netlify.com/sites/ngrx-message-bus-demo/deploys)

---

## Description

- **ngrx-message-bus** is just a small angular library which provides a singleton shared service in [Angular application](https://angular.io/).

- **ngrx-message-bus** is just an improved shared service. Instead of providing just one instance for **publishing** | **subscribing** messages, it provides `channels` and `events` to which components can _subscribe_ and _unsubscribe_. 

- Long story short, **ngrx-message-bus** provides `back-end` mindset about pub/sub mechanism.

- Online DEMO can be found **[HERE](https://ngrx-message-bus-demo.netlify.com)**

----

## Installation:

**1. Module lifetime**

```
import {NgRxMessageBusModule} from 'ngrx-message-bus.module';

@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule, // required animations module
    HttpClientModule,

    // Application modules.
    SharedModule,
    AppRouteModule,
    NgRxMessageBusModule
  ],
  providers: [
    AppSettings
  ],
  bootstrap: [AppComponent]
})


export class AppModule {
}
```

```
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parent',
  templateUrl: 'parent.component.html'
})
export class ParentComponent implements OnInit {

  public constructor(@Inject('INgRxMessageBusService') public messageBusService: INgRxMessageBusService) {
  
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
      provide: 'INgRxMessageBusService',
      useFactory: () => new NgrxMessageBusService()
    }
  ]
})
export class ParentComponent implements OnInit {
}
```

----

## Usage



### Message subscription:

- To subscribe to an `event in message channel`, please use `hookMessageChannel`.

- `hookMessageChannel` allows user to specify whether **event** and **channel** should be automatically created if they don't exist or not.

- `hookMessageChannel` returns an instance of `Subscription`. Don't forget to unsubscribe it to prevent [memory leak](https://itnext.io/angular-rxjs-detecting-memory-leaks-bdd312a070a0).

```

export class ChildComponent implements OnDestroy {


  public constructor(@Inject('INgRxMessageBusService') protected messageBusService: INgRxMessageBusService) {
    // Initialize subscription manager.
    this._subscription = new Subscription();
  }
  
  public ngOnInit() {
      const hookParentMessageSubscription = this.messageBusService
        .hookMessageChannel(<channel_name>,
          <event_name>,
          <auto_create_channel_or_event>, <subscription_options>)
        .subscribe((message: string) => {
          // .. Handle message that passed in message bus.
        });
  
      this._subscription.add(hookParentMessageSubscription);
  }
  
  public ngOnDestroy(): void {

    // Destroy the subscription to prevent memory leak.
    if (this._subscription && !this._subscription.closed) {
      this._subscription.unsubscribe();
    }
  }

  //#endregion
}
        
```



### Message publish:

- To publish a message through message bus to a specific event in a channel, please use `addMessage`.
- The **event** and **channel** will be created automatically if they don't exist.

```

export class ComponentLevelParentComponent extends ParentComponent {

  public constructor(@Inject('INgRxMessageBusService') protected messageBusService: INgRxMessageBusService) {
    super();
  }
  
  public clickSendMessage(): void {
  
    // Get current date.
    const date = new Date();

    // Use addMessage to pass data to specific event in a channel.
    this.messageBusService
      .addMessage(<channel_name>, <event_name>, <data>)
  }
}

```

----

## APIs | Options

- `addMessageChannel<T>(channelName: string, eventName: string): Subject<T>` : Create a **channel** and **event** in the message bus. (_**One channel** has many **events**, however, **one event** can only belong to **one channel**._)

  - `channelName (string)`: Name of channel should the **event** and **message** be created. (**required**).
  
  - `eventName (string)`: Name of event in the channel above which message will go through. (**required**).
  
- `hookMessageChannel<T>(channelName: string, eventName: string): Observable<T>`: Subscribe to a specific channel and its event to listen to the incoming message. Every component which registers to the same channel and event can catch the message.

  - `channelName (string)`: Name of channel to subscribe to. (**required**).

  - `eventName (string)`: Name of event to subscribe to. (**required**).

- `addMessage<T>(channelName: string, eventName: string, data?: T, lifeTimeInSeconds?: number): void`: Publish a message to a specific **event** in a specific **channel**. Event component registers to the published **channel** and **event** can receive the sent message.

  - `channelName (string)`: Name of channel that message will be published to. (**required**).
  
  - `eventName (string)`: Name of event that message will go through. (**required**).
  
  - `data (any)`: Message data.
  
  - `lifeTimeInSeconds (options)`: The number of seconds message remains. If this parameter isn't set, message will have infinitive lifetime.

- `channelAddedEvent: Observable<{channelName: string, eventName: string}>`: Raised when a channel is created successfully. This event can be used for initializing connection from subscriber to message bus to ensure the specific channel & event is available to be consumed.

- `hookChannelInitialization(channelName: string, eventName: string): Observable<ChannelInitializationEvent>`: Provide hook to outer component to know when a `message channel - event` is initialized successfully.
    - `channelName (string)`: Name of channel.
    - `eventName (string)`: Name of event.

----

### Module options

- `ngrx-message-bus` provide an `Angular module` whose name is `NgRxMessageBusModule`.

- About parameters, please refer to `hookChannelMessage` subscription option section.

----

## Different between between **Module lifetime** and **Component lifetime**.

- **Module lifetime** is about single instance in the whole module that `message bus` is registered.

- **Component lifetime** is about single instance in the component that `message bus` is registered.

- `message bus` lifetime can be **overridden**  by the inner `message bus`. That means, if there are 2 instances, one is registered in **module**, the other is in **component**, the component's one will be the active and runnable one. Please refer [Hierarchical Dependency Injectors](https://angular.io/guide/hierarchical-dependency-injection) for more information.


## Releases

- **1.0.0**: Initial release.

- **1.0.1**: Added README.MD.

- **1.0.2**: Minor bug fixes.

- **1.0.3**: Minor bug fixes.

- **1.0.4**: 
  - Changed `BehaviourSubject` to `ReplaySubject` to prevent unexpected value from being emitted.
  
- **2.2.0**:
    - Removed `channelAddedEvent`. When `hookChannelMessage`, it will ensure channel is created before publishing messages.
    
    - Added `lifetimeInSeconds?: number` into `addMessage<T>(channelName: string, eventName: string, data: T, lifetimeInSeconds?: number): void`, message will be expired after lifetime exceeds.
    
    - Removed `messageBusOptions` and `forRoot` from module declaration. From now, module will be imported as default:
    
    ```
       @NgModule({
         imports: [
           NgRxMessageBusModule,
           //...
         ]
       })
       export class ModuleLevelDemoModule {
       
       } 
    ```
  
  - Removed ```autoCreateChannel``` from ```hookChannelMessage```.
  - Changed `INgRxMessageBusService` string injector to `MESSAGE_BUS_SERVICE_INJECTOR` object injector.
    



