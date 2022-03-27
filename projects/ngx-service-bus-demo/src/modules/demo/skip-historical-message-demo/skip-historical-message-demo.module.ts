import {NgModule} from '@angular/core';
import {SkipHistoricalMessageDemoComponent} from '@demo-app/modules/demo/skip-historical-message-demo/skip-historical-message-demo.component';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {SkipHistoricalMessageDemoRoutingModule} from '@demo-app/modules/demo/skip-historical-message-demo/skip-historical-message-demo-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {NgRxMessageBusModule} from 'ngrx-message-bus';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    SkipHistoricalMessageDemoComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,

    SkipHistoricalMessageDemoRoutingModule,
    TranslateModule,
    MatButtonModule,
    NgRxMessageBusModule.forRoot(),
    MatCheckboxModule,
    FormsModule
  ],
  exports: [
    SkipHistoricalMessageDemoComponent
  ]
})
export class SkipHistoricalMessageDemoModule {

}
