import {NgModule} from '@angular/core';
import {RpcResponderComponent} from './rpc-responder.component';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
    declarations: [
        RpcResponderComponent
    ],
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatButtonModule
  ],
    exports: [
        RpcResponderComponent
    ]
})
export class RpcResponderModule {

}
