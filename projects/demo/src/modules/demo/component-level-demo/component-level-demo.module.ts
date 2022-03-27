import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ComponentLevelDemoComponent} from './component-level-demo.component';
import {ComponentLevelChildComponent} from './child/component-level-child.component';
import {ComponentLevelParentComponent} from './parent/component-level-parent.component';
import {ComponentLevelDemoRouteModule} from './component-level-demo.route';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {NgRxMessageBusModule} from '@message-bus/core';

@NgModule({
    imports: [
        MatCardModule,
        MatTabsModule,
        TranslateModule.forChild(),
        MatButtonModule,
        NgRxMessageBusModule.forRoot(),

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
