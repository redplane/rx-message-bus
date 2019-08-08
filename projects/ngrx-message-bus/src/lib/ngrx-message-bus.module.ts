import {NgModule} from '@angular/core';
import {NgRxMessageBusService} from "./ngrx-message-bus.service";

//#region Module declaration

// @dynamic
@NgModule({
  providers: [
    {
      provide: 'INgRxMessageBusService',
      useClass: NgRxMessageBusService
    }
  ]
})
export class NgRxMessageBusModule {
}

//#endregion
