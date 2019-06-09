## Description

- **ngx-message-bus** is just a small angular library which provides a singleton shared service in [Angular application](https://angular.io/).

- **ngx-message-bus** is just an improved shared service. Instead of providing just one instance for **publishing** | **subscribing** messages, it provides `channels` and `events` to which components can _subscribe_ and _unsubscribe_. 

- Long story short, **ngx-message-bus** provides `back-end` mindset about pub/sub mechanism.



## Installation:

- ### Module lifetime

```
import {MessageBusModule} from 'message-bus.module';

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
    MessageBusModule
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

  public constructor(@Inject('IMessageBusService') public messageBusService: IMessageBusService) {
  
   }
}
```

- ### Component lifetime

```
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parent, [parent-comp]',
  templateUrl: 'parent.component.html',
  providers: [
    {
      provide: 'IMessageBusService',
      useFactory: () => new MessageBusService()
    }
  ]
})
export class ParentComponent implements OnInit {
}
```


## Different between between **Module lifetime** and **Component lifetime**.

- **Module lifetime** is about single instance in the whole module that `message bus` is registered.
- **Component lifetime** is about single instance in the component that `message bus` is registered.

- `message bus` lifetime can be **overridden**  by the inner `message bus`. That means, if there are 2 instances, one is registered in **module**, the other is in **component**, the component's one will be the active and runnable one. Please refer [Hierarchical Dependency Injectors](https://angular.io/guide/hierarchical-dependency-injection) for more information.






