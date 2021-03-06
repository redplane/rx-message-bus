import {Component} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'component-level-demo',
  templateUrl: './component-level-demo.component.html',
  styleUrls: ['./component-level-demo.component.scss']
})
export class ComponentLevelDemoComponent {

  //#region Constructor

  public get childTypescript(): string {
    return `
      public constructor(@Inject(MESSAGE_BUS_SERVICE_PROVIDER) protected messageBusService: INgRxMessageBusService) {

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
      public constructor(@Inject(MESSAGE_BUS_SERVICE_PROVIDER) protected messageBusService: INgRxMessageBusService) {
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
