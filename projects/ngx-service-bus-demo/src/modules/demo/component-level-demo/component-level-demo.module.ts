import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {MatButtonModule, MatCardModule, MatTabsModule} from "@angular/material";
import {TranslateModule} from "@ngx-translate/core";
import {ComponentLevelDemoComponent} from "./component-level-demo.component";
import {ComponentLevelChildComponent} from "./child/component-level-child.component";
import {ComponentLevelParentComponent} from "./parent/component-level-parent.component";
import {ComponentLevelDemoRouteModule} from "./component-level-demo.route";

@NgModule({
  imports: [
    MatCardModule,
    MatTabsModule,
    TranslateModule.forChild(),
    MatButtonModule,

    ComponentLevelDemoRouteModule
  ],
  declarations: [
    ComponentLevelParentComponent,
    ComponentLevelChildComponent,
    ComponentLevelDemoComponent
  ],
  exports: [
    RouterModule
  ]
})
export class ComponentLevelDemoModule {

}
