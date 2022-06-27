import {ModuleWithProviders, NgModule, Type} from '@angular/core';
import {RPC_SERVICE_PROVIDER} from '../constants';
import {IRpcService, BasicRpcService} from '../services';

@NgModule()
export class RpcModule {

  //#region Methods

  public static forRoot(implementation?: Type<IRpcService>): ModuleWithProviders<RpcModule> {
    return {
      ngModule: RpcModule,
      providers: [
        {
          provide: RPC_SERVICE_PROVIDER,
          useClass: implementation || BasicRpcService
        }
      ]
    };
  }

  //#endregion

}
