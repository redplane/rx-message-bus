import {NgModule} from '@angular/core';
import {ModuleLevelDemoComponent} from './module-level-demo.component';
import {ModuleLevelDemoRouteModule} from './module-level-demo-routing.module';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ModuleLevelParentComponent} from './parent/module-level-parent.component';
import {ModuleLevelChildComponent} from './child/module-level-child.component';
import {MessageBusModule} from '@message-bus/core';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';

@NgModule({
  imports: [
    // Module import.
    MessageBusModule.forRoot(),

    MatCardModule,
    MatTabsModule,
    TranslateModule.forChild(),
    MatButtonModule,

    ModuleLevelDemoRouteModule,
    RouterModule,
    MatDividerModule
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
