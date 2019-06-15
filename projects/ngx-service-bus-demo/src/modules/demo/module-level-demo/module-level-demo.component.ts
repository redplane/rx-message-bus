import {Component, Inject} from "@angular/core";

@Component({
  selector: 'singleton-service-demo',
  templateUrl: './module-level-demo.component.html',
  styleUrls: ['./module-level-demo.component.scss']
})
export class ModuleLevelDemoComponent {

  //#region Constructor

  public get moduleLevelChildTypescript(): string {
    return `
      public constructor(@Inject('INgRxMessageBusService') protected messageBusService: INgRxMessageBusService) {
  
        // Initialize subscription manager.
        this._subscription = new Subscription();
    
        const hookParentMessageSubscription = this.messageBusService
          .hookMessageChannel(MessageChannelNameConstant.parent,
            MessageEventNameConstant.sendParentMessage,
            false, {
              subscriptionAttemptMode: 'infinite',
              channelConnectionAttemptDelay: 250
            })
          .subscribe((message: string) => {
            this._message = message;
          });
    
        this._subscription.add(hookParentMessageSubscription);
      }
    
      public ngOnDestroy(): void {
    
        // Destroy the subscription to prevent memory leak.
        if (this._subscription && !this._subscription.closed) {
          this._subscription.unsubscribe();
        }
    
      }
    `;
  }

  public get moduleLevelParentTypescript(): string {
    return `
      public constructor(@Inject('INgRxMessageBusService') protected messageBusService: INgRxMessageBusService) {
        super();
      }
    
      //#endregion
    
      //#region Methods
    
      public clickSendMessage(): void {
    
        // Get current date.
        const date = new Date();
    
        this.messageBusService
          .addMessage(MessageChannelNameConstant.parent, MessageEventNameConstant.sendParentMessage,
            \`\${date.toLocaleTimeString()} [\${this.name}] says: Hello\`)
      }
    `;
  }

  public get moduleTypescript(): string {
    return `
      @NgModule({
        imports: [
          RxMessageBusModule.forRoot({
            channelConnectionAttemptDelay: 250,
            subscriptionAttemptMode: 'infinite'
          }),
          
          // ...
        ]
      })
      export class ModuleLevelDemoModule {
      
      }
    `;
  }

  //#endregion

  //#region Methods


  //#endregion
}
