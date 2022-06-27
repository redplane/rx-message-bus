import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComponentLevelDemoComponent} from './component-level-demo.component';
import {ComponentLevelChildComponent} from './child/component-level-child.component';

//#region Routes

const routes: Routes = [
  {
    path: '',
    component: ComponentLevelDemoComponent,
    children: [
      {
        path: '',
        component: ComponentLevelChildComponent
      }
    ]
  }
];

//#endregion

//#region Module declaration

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ComponentLevelDemoRouteModule {

}

//#endregion
