import {NgModule} from '@angular/core';
import {RxMessageBusService} from "./rx-message-bus.service";
import {IRxMessageBusOption} from "./rx-message-bus-option.interface";

//#region Module declaration

// @dynamic
@NgModule({
  providers: [
    {
      provide: 'IRxMessageBusService',
      useClass: RxMessageBusService
    }
  ]
})
export class RxMessageBusModule {

  public static forRoot(options: IRxMessageBusOption) {

    return {
      ngModule: RxMessageBusModule,
      providers: [
        {
          provide: 'IMessageBusOption',
          useValue: options
        },
        {
          provide: 'IRxMessageBusService',
          useClass: RxMessageBusService
        }
      ]
    };
  }
}

//#endregion
