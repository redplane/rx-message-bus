import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {MatButtonModule, MatCardModule, MatTabsModule} from "@angular/material";
import {TranslateModule} from "@ngx-translate/core";
import {NgRxMessageBusModule} from "../../../../../ngrx-message-bus/src/lib/ngrx-message-bus.module";
import {HookChannelEventDemoComponent} from "./hook-channel-event-demo.component";
import {HookChannelEventParentComponent} from "./parent/hook-channel-event-parent.component";
import {HookChannelEventChildComponent} from "./child/hook-channel-event-child.component";
import {HookChannelEventDemoRouteModule} from "./hook-channel-event-demo.route";

@NgModule({
  imports: [
    NgRxMessageBusModule,

    MatCardModule,
    MatTabsModule,
    TranslateModule.forChild(),
    MatButtonModule,

    HookChannelEventDemoRouteModule
  ],
  declarations: [
    HookChannelEventDemoComponent,
    HookChannelEventParentComponent,
    HookChannelEventChildComponent
  ],
  exports: [
    RouterModule
  ]
})
export class HookChannelEventDemoModule {

}
