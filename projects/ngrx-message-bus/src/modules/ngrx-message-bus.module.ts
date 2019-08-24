import {ModuleWithProviders, NgModule, Type} from '@angular/core';
import {NgRxMessageBusService} from "../services/implementations/ngrx-message-bus.service";
import {MESSAGE_BUS_SERVICE_INJECTOR} from "../constants/injection-tokens.constant";
import {INgRxMessageBusService} from "../services/interfaces/ngrx-message-bus-service.interface";

//#region Module declaration

@NgModule({
  providers: [
    {
      provide: MESSAGE_BUS_SERVICE_INJECTOR,
      useClass: NgRxMessageBusService
    }
  ]
})
export class NgRxMessageBusModule {

  //#region Methods

  public static forRoot(messageBusServiceImplementation: Type<INgRxMessageBusService>): ModuleWithProviders {
    return {
      ngModule: NgRxMessageBusModule,
      providers: [
        {
          provide: MESSAGE_BUS_SERVICE_INJECTOR,
          useClass: messageBusServiceImplementation
        }
      ]
    }
  }

  //#endregion
}

//#endregion
