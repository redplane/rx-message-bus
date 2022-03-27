import {NgModule} from '@angular/core';
import {ModuleLevelDemoComponent} from './module-level-demo.component';
import {ModuleLevelDemoRouteModule} from './module-level-demo.route';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ModuleLevelParentComponent} from './parent/module-level-parent.component';
import {ModuleLevelChildComponent} from './child/module-level-child.component';
import {MessageBusModule} from '@message-bus/core';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  imports: [
    // Module import.
    MessageBusModule.forRoot(),

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
