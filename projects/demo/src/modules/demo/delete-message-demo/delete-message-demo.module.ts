import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {MessageBusModule} from '@message-bus/core';
import {DeleteMessageDemoComponent} from './delete-message-demo.component';
import {DeleteMessageDemoRouteModule} from './delete-message-demo.route';
import {MessageListenerComponent} from './message-listener/message-listener.component';
import {LocalTimePipe, MomentModule} from 'ngx-moment';
import {CommonModule} from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,

    MatCardModule,
    MatTabsModule,
    TranslateModule.forChild(),
    MatButtonModule,
    MomentModule.forRoot(),
    MessageBusModule.forRoot(),

    DeleteMessageDemoRouteModule
  ],
  declarations: [
    MessageListenerComponent,
    DeleteMessageDemoComponent
  ],
  providers: [
    LocalTimePipe
  ],
  exports: [
    RouterModule
  ]
})
export class DeleteMessageDemoModule {

}
