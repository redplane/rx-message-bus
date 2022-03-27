import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RpcDemoComponent} from './rpc-demo.component';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {TranslateModule} from '@ngx-translate/core';
import {RpcDemoRouteModule} from './rpc-demo.route';
import {MatButtonModule} from '@angular/material/button';
import {NgRxMessageBusModule} from '@message-bus/core';
import {ToStaticFileContentPipeModule} from '../../shared/to-static-file-content/to-static-file-content-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    TranslateModule,
    RpcDemoRouteModule,
    MatButtonModule,
    NgRxMessageBusModule.forRoot(),
    ToStaticFileContentPipeModule
  ],
  declarations: [
    RpcDemoComponent
  ]
})
export class RpcDemoModule {
}
