import {NgModule} from "@angular/core";
import {ModuleLevelDemoComponent} from "./module-level-demo.component";
import {RxMessageBusModule} from "../../../../../ngx-message-bus/src/public_api";
import {SingletonServiceDemoRouteModule} from "./module-level-demo.route";
import {RouterModule} from "@angular/router";
import {MatButtonModule, MatCardModule, MatTabsModule} from "@angular/material";
import {TranslateModule} from "@ngx-translate/core";
import {ModuleLevelParentComponent} from "./parent/module-level-parent.component";
import {ModuleLevelChildComponent} from "./child/module-level-child.component";

@NgModule({
  imports: [
    RxMessageBusModule.forRoot({
      channelConnectionAttemptDelay: 250,
      subscriptionAttemptMode: 'infinite'
    }),

    RouterModule,

    SingletonServiceDemoRouteModule,
    MatCardModule,
    MatTabsModule,
    TranslateModule.forChild(),
    MatButtonModule
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
