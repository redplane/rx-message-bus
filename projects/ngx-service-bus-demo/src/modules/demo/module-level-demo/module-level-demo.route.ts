import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ModuleLevelDemoComponent} from "./module-level-demo.component";

//#region Routes

const routes: Routes = [
  {
    path: 'module-level',
    component: ModuleLevelDemoComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'module-level'
  }
];

//#endregion

//#region Module declaration

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class SingletonServiceDemoRouteModule {

}

//#endregion
