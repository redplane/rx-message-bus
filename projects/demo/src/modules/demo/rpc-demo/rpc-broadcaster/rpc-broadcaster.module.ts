import {NgModule} from '@angular/core';
import {RpcBroadcasterComponent} from './rpc-broadcaster.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CommonModule} from '@angular/common';
import {MessageModalModule} from '../../../shared/message-modal/message-modal.module';

@NgModule({
  declarations: [
    RpcBroadcasterComponent
  ],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
    MessageModalModule
  ],
  exports: [
    RpcBroadcasterComponent
  ]
})
export class RpcBroadcasterModule {
}
