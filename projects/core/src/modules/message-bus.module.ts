import {ModuleWithProviders, NgModule, Type} from '@angular/core';
import {MessageBusService} from '../services/implementations/message-bus.service';
import {MESSAGE_BUS_SERVICE, RPC_SERVICE} from '../constants/injection-tokens';
import {IMessageBusService} from '../services/interfaces/message-bus-service.interface';
import {BasicRpcService} from '../services';

//#region Module declaration

@NgModule()
export class MessageBusModule {

  //#region Methods

  public static forRoot(implementation?: Type<IMessageBusService>): ModuleWithProviders<MessageBusModule> {
    return {
      ngModule: MessageBusModule,
      providers: [
        {
          provide: MESSAGE_BUS_SERVICE,
          useClass: implementation || MessageBusService
        },
        {
          provide: RPC_SERVICE,
          useClass: BasicRpcService
        }
      ]
    };
  }

  //#endregion
}

//#endregion
