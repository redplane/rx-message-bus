import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ComponentLevelDemoComponent} from './component-level-demo.component';
import {ComponentLevelChildComponent} from './child/component-level-child.component';
import {ComponentLevelParentComponent} from './parent/component-level-parent.component';
import {ComponentLevelDemoRouteModule} from './component-level-demo-routing.module';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MessageBusModule} from '@message-bus/core';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    MatCardModule,
    MatTabsModule,
    TranslateModule.forChild(),
    MatButtonModule,
    MessageBusModule.forRoot(),

    ComponentLevelDemoRouteModule,
    CommonModule,
    RouterModule
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
