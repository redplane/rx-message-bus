import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ModuleLevelDemoComponent} from './module-level-demo.component';

//#region Routes

const routes: Routes = [
  {
    path: '',
    component: ModuleLevelDemoComponent
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
