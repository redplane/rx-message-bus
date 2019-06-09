import {Component, Inject} from "@angular/core";

@Component({
  selector: 'singleton-service-demo',
  templateUrl: './component-level-demo.component.html',
  styleUrls: ['./component-level-demo.component.scss']
})
export class ComponentLevelDemoComponent {

  //#region Constructor

  public get childTypescript(): string {
    return `
      public constructor(@Inject('IRxMessageBusService') protected messageBusService: IRxMessageBusService) {
  
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

  public get parentTypescript(): string {
    return `
      public constructor(@Inject('IRxMessageBusService') protected messageBusService: IRxMessageBusService) {
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
