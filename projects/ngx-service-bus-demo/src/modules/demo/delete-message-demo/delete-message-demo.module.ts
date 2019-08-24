import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {MatButtonModule, MatCardModule, MatTabsModule} from "@angular/material";
import {TranslateModule} from "@ngx-translate/core";
import {NgRxMessageBusModule} from "../../../../../ngrx-message-bus/src/modules/ngrx-message-bus.module";
import {DeleteMessageDemoComponent} from "./delete-message-demo.component";
import {DeleteMessageDemoRouteModule} from "./delete-message-demo.route";
import {MessageListenerComponent} from "./message-listener/message-listener.component";
import {LocalTimePipe, MomentModule} from "ngx-moment";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [
    CommonModule,

    MatCardModule,
    MatTabsModule,
    TranslateModule.forChild(),
    MatButtonModule,
    MomentModule.forRoot(),

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
