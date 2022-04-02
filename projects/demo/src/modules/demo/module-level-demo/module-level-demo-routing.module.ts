import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ModuleLevelDemoComponent} from './module-level-demo.component';
import {ModuleLevelChildComponent} from './child/module-level-child.component';

//#region Routes

const routes: Routes = [
  {
    path: '',
    component: ModuleLevelDemoComponent,
    children: [
      {
        path: '',
        component: ModuleLevelChildComponent
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
export class ModuleLevelDemoRouteModule {

}

//#endregion
