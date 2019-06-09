import {NgModule} from '@angular/core';
import {MessageBusService} from "./message-bus.service";
import {IMessageBusOption} from "./message-bus-option.interface";

//#region Module declaration

@NgModule({
  providers: [
    {
      provide: 'IMessageBusService',
      useFactory: () => new MessageBusService(null)
    }
  ]
})
export class MessageBusModule {

  public static forRoot(options: IMessageBusOption) {
    return {
      ngModule: MessageBusModule,
      providers: [
        {
          provide: 'IMessageBusService',
          useFactory: () => new MessageBusService(options)
        }
      ]
    };

  }

}

//#endregion
