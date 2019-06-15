import {NgModule} from "@angular/core";
import {ModuleLevelDemoComponent} from "./module-level-demo.component";
import {ModuleLevelDemoRouteModule} from "./module-level-demo.route";
import {RouterModule} from "@angular/router";
import {MatButtonModule, MatCardModule, MatTabsModule} from "@angular/material";
import {TranslateModule} from "@ngx-translate/core";
import {ModuleLevelParentComponent} from "./parent/module-level-parent.component";
import {ModuleLevelChildComponent} from "./child/module-level-child.component";
import {NgRxMessageBusModule} from "../../../../../ngrx-message-bus/src/lib/ngrx-message-bus.module";

@NgModule({
  imports: [
    NgRxMessageBusModule.forRoot({
      channelConnectionAttemptDelay: 250,
      subscriptionAttemptMode: 'infinite'
    }),

    MatCardModule,
    MatTabsModule,
    TranslateModule.forChild(),
    MatButtonModule,

    ModuleLevelDemoRouteModule
  ],
  declarations: [
    ModuleLevelParentComponent,
    ModuleLevelChildComponent,
    ModuleLevelDemoComponent
  ],
  exports: [
    RouterModule
  ]
})
export class ModuleLevelDemoModule {

}
