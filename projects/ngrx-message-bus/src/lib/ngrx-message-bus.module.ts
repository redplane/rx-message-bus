import {NgModule} from '@angular/core';
import {NgRxMessageBusService} from "./ngrx-message-bus.service";
import {INgRxMessageBusOptions} from "./ngrx-message-bus-option.interface";

//#region Module declaration

// @dynamic
@NgModule({
  providers: [
    {
      provide: 'IRxMessageBusService',
      useClass: NgRxMessageBusService
    }
  ]
})
export class NgRxMessageBusModule {

  public static forRoot(options: INgRxMessageBusOptions) {

    return {
      ngModule: NgRxMessageBusModule,
      providers: [
        {
          provide: 'INgRxMessageBusOption',
          useValue: options
        },
        {
          provide: 'INgRxMessageBusService',
          useClass: NgRxMessageBusService
        }
      ]
    };
  }
}

//#endregion
