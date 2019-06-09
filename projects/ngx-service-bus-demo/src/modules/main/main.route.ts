import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MainComponent} from "./main.component";

//#region Properties

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MainComponent
  }
];

//#endregion

//#region Module

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class MainRouteModule {

}

//#endregion
