import {Component} from "@angular/core";

@Component({
  selector: 'singleton-service-demo',
  templateUrl: './hook-channel-event-demo.component.html',
  styleUrls: ['./hook-channel-event-demo.component.scss']
})
export class HookChannelEventDemoComponent {

  //#region Constructor

  public get moduleLevelChildTypescript(): string {
    return `
      public constructor(
        @SkipSelf() @Optional() @Inject('INgRxMessageBusService') public messageBusService: INgRxMessageBusService) {
    
        this.messageBusService
          .channelAddedEvent
          .subscribe(instance => {
            this.handleChannelCreateEvent(instance.channelName, instance.eventName);
          })
      }
    
      //#endregion
    
      //#region Methods
    
      public ngOnDestroy(): void {
        if (this._hookChannelMessageSubscription && !this._hookChannelMessageSubscription.closed) {
          this._hookChannelMessageSubscription.unsubscribe();
        }
      }
    
      protected handleChannelCreateEvent(channelName: string, channelEventName: string): void {
        this._hookChannelMessageSubscription = this._hookChannelMessageSubscription = this.messageBusService
          .hookMessageChannel(channelName, channelEventName)
          .subscribe((message: string) => this.message = message);
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
            \`$\{date.toLocaleTimeString()} [$\{this.name}] says: Hello\`)
      }
    `;
  }

  public get moduleTypescript(): string {
    return `
      @NgModule({
        imports: [
          RxMessageBusModule,
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
