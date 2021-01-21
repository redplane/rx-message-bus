import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

//#region Properties

const routes: Routes = [
  {
    path: 'demo',
    loadChildren: () => import('./demo/demo.module').then(m => m.DemoModule)
  },
  {
    path: '**',
    redirectTo: 'demo'
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
