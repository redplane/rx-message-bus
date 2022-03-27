import {NgModule} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {NgRxMessageBusModule} from '@message-bus/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {SkipHistoricalMessageDemoRoutingModule} from './skip-historical-message-demo-routing.module';
import {SkipHistoricalMessageDemoComponent} from './skip-historical-message-demo.component';

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
