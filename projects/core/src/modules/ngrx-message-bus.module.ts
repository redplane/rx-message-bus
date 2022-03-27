import {ModuleWithProviders, NgModule, Type} from '@angular/core';
import {NgRxMessageBusService} from '../services/implementations/ngrx-message-bus.service';
import {MESSAGE_BUS_SERVICE_PROVIDER, RPC_SERVICE_PROVIDER} from '../constants/injection-tokens.constant';
import {INgRxMessageBusService} from '../services/interfaces/ngrx-message-bus-service.interface';
import {BasicRpcService} from '../services';

//#region Module declaration

@NgModule()
export class NgRxMessageBusModule {

  //#region Methods

  public static forRoot(implementation?: Type<INgRxMessageBusService>): ModuleWithProviders<NgRxMessageBusModule> {
    return {
      ngModule: NgRxMessageBusModule,
      providers: [
        {
          provide: MESSAGE_BUS_SERVICE_PROVIDER,
          useClass: implementation || NgRxMessageBusService
        },
        {
          provide: RPC_SERVICE_PROVIDER,
          useClass: BasicRpcService
        }
      ]
    };
  }

  //#endregion
}

//#endregion
