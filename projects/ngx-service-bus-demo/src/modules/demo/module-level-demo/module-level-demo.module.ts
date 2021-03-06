import {NgModule} from '@angular/core';
import {ModuleLevelDemoComponent} from './module-level-demo.component';
import {ModuleLevelDemoRouteModule} from './module-level-demo.route';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ModuleLevelParentComponent} from './parent/module-level-parent.component';
import {ModuleLevelChildComponent} from './child/module-level-child.component';
import {NgRxMessageBusModule} from 'ngrx-message-bus';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    NgRxMessageBusModule.forRoot(),

    // Module import.
    NgRxMessageBusModule.forRoot(),

    MatCardModule,
    MatTabsModule,
    TranslateModule.forChild(),
    MatButtonModule,

    ModuleLevelDemoRouteModule,
    FlexModule
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
