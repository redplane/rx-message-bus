import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

//#region Properties

const routes: Routes = [
  {
    path: '**',
    loadChildren: './main/main.module#MainModule'
  }
];

//#endregion

//#region Module

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouteModule {

}

//#endregion
